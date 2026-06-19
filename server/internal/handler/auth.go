package handler

import (
	"net/http"
	"time"

	"pt-server/internal/i18n"
	"pt-server/internal/model"
	"pt-server/internal/utils"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type RegisterRequest struct {
	Username string `json:"username" binding:"required,min=3,max=32"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (h *Handler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	if _, err := h.repo.User.GetByUsername(req.Username); err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": i18n.T(c, "username_exists")})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_hash_password")})
		return
	}

	user := &model.User{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: string(hash),
		Passkey:      utils.GeneratePasskey(),
		Role:         model.RoleUser,
	}

	role, err := h.repo.Role.GetByName(string(model.RoleUser))
	if err == nil {
		user.RoleID = &role.ID
	}

	if err := h.repo.User.Create(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_create_user")})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": user.ID})
}

func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	user, err := h.repo.User.GetByUsername(req.Username)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": i18n.T(c, "invalid_credentials")})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": i18n.T(c, "invalid_credentials")})
		return
	}

	var roleID *int64
	if user.RoleID != nil {
		roleID = user.RoleID
	} else {
		role, err := h.repo.Role.GetByName(string(user.Role))
		if err == nil {
			roleID = &role.ID
			h.repo.User.UpdateRoleID(user.ID, role.ID)
		}
	}

	claims := jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(7 * 24 * time.Hour).Unix(),
	}
	if roleID != nil {
		claims["role_id"] = *roleID
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := token.SignedString([]byte(h.cfg.JWTSecret))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_generate_token")})
		return
	}

	resp := gin.H{
		"token":    tokenStr,
		"user_id":  user.ID,
		"username": user.Username,
		"role":     user.Role,
	}
	if roleID != nil {
		resp["role_id"] = *roleID
	}
	c.JSON(http.StatusOK, resp)
}
