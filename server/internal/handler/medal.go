package handler

import (
	"net/http"
	"strconv"

	"pt-server/internal/model"
	i18n "pt-server/internal/i18n"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ListMedals(c *gin.Context) {
	medals, err := h.repo.Medal.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_medals")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"medals": medals})
}

func (h *Handler) CreateMedal(c *gin.Context) {
	var m model.Medal
	if err := c.ShouldBindJSON(&m); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	if err := h.repo.Medal.Create(&m); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_create_medal")})
		return
	}
	c.JSON(http.StatusCreated, m)
}

func (h *Handler) DeleteMedal(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}
	if err := h.repo.Medal.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_delete_medal")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *Handler) BuyMedal(c *gin.Context) {
	userID, _ := c.Get("user_id")
	medalID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	medal, err := h.repo.Medal.GetByID(medalID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "medal_not_found")})
		return
	}

	exists, _ := h.repo.UserMedal.Exists(userID.(int64), medalID)
	if exists {
		c.JSON(http.StatusConflict, gin.H{"error": i18n.T(c, "already_own_medal")})
		return
	}

	user, _ := h.repo.User.GetByID(userID.(int64))
	if user.Bonus < medal.Price {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "insufficient_bonus")})
		return
	}

	if err := h.repo.User.AddBonus(userID.(int64), -medal.Price); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "transaction_failed")})
		return
	}
	if err := h.repo.UserMedal.Buy(userID.(int64), medalID); err != nil {
		h.repo.User.AddBonus(userID.(int64), medal.Price)
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "transaction_failed")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *Handler) ListUserMedals(c *gin.Context) {
	userID, _ := c.Get("user_id")
	ums, err := h.repo.UserMedal.ListByUser(userID.(int64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_medals")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"medals": ums})
}
