package handler

import (
	"net/http"
	"time"

	"pt-server/internal/achievement"
	i18n "pt-server/internal/i18n"
	"pt-server/internal/model"
	"pt-server/internal/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func (h *Handler) ListInvites(c *gin.Context) {
	userID, _ := c.Get("user_id")
	invites, err := h.repo.Invite.ListBySender(userID.(int64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_invites")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"invites": invites})
}

func (h *Handler) CreateInvite(c *gin.Context) {
	userID, _ := c.Get("user_id")

	code := utils.GeneratePasskey()
	invite := &model.Invite{
		SenderID:  userID.(int64),
		Code:      code,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	}

	if err := h.repo.Invite.Create(invite); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_create_invite")})
		return
	}

	// Deduct bonus for invite
	h.repo.User.AddBonus(userID.(int64), -10)

	c.JSON(http.StatusCreated, invite)
}

type RegisterWithInviteRequest struct {
	Username string `json:"username" binding:"required,min=3,max=32"`
	Password string `json:"password" binding:"required,min=6"`
	Email    string `json:"email" binding:"required,email"`
	Invite   string `json:"invite" binding:"required"`
}

func (h *Handler) RegisterWithInvite(c *gin.Context) {
	var req RegisterWithInviteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	invite, err := h.repo.Invite.GetByCode(req.Invite)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_invite_code")})
		return
	}
	if invite.IsUsed {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invite_code_used")})
		return
	}
	if time.Now().After(invite.ExpiresAt) {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invite_code_expired")})
		return
	}

	// Check existing user
	if _, err := h.repo.User.GetByUsername(req.Username); err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": i18n.T(c, "username_exists")})
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	user := &model.User{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: string(hash),
		Passkey:      utils.GeneratePasskey(),
		Role:         model.RoleUser,
	}

	role, err := h.repo.Role.GetByKey(string(model.RoleUser))
	if err == nil {
		user.RoleID = &role.ID
	}

	if err := h.repo.User.Create(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_create_user")})
		return
	}

	// Auto-grant registration achievement
	checker := achievement.NewChecker(h.repo.DB(), h.repo.Achievement, h.repo.UserAchievement)
	checker.CheckUser(user.ID)

	h.repo.Invite.MarkUsed(invite.ID, user.ID)
	c.JSON(http.StatusCreated, gin.H{"id": user.ID})
}
