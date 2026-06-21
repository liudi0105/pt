package handler

import (
	"net/http"
	"strconv"

	"pt-server/internal/achievement"
	"pt-server/internal/model"

	i18n "pt-server/internal/i18n"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ListAchievements(c *gin.Context) {
	achievements, err := h.repo.Achievement.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_achievements")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"achievements": achievements})
}

func (h *Handler) ListUserAchievements(c *gin.Context) {
	userID, _ := c.Get("user_id")
	list, err := h.repo.UserAchievement.ListByUser(userID.(int64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_achievements")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"achievements": list})
}

func (h *Handler) CheckAchievements(c *gin.Context) {
	userID, _ := c.Get("user_id")
	checker := achievement.NewChecker(h.repo.DB(), h.repo.Achievement, h.repo.UserAchievement)
	unlocked, err := checker.CheckUser(userID.(int64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "achievement_check_failed")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"unlocked": unlocked})
}

func (h *Handler) CreateAchievement(c *gin.Context) {
	var m model.Achievement
	if err := c.ShouldBindJSON(&m); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	if err := h.repo.Achievement.Create(&m); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_create_achievement")})
		return
	}
	c.JSON(http.StatusCreated, m)
}

func (h *Handler) UpdateAchievement(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}
	var m model.Achievement
	if err := c.ShouldBindJSON(&m); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	m.ID = id
	if err := h.repo.Achievement.Update(&m); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_update_achievement")})
		return
	}
	c.JSON(http.StatusOK, m)
}

func (h *Handler) DeleteAchievement(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}
	if err := h.repo.Achievement.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_delete_achievement")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *Handler) ListUserAchievementsAdmin(c *gin.Context) {
	userID, err := strconv.ParseInt(c.Query("user_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}
	list, err := h.repo.UserAchievement.ListByUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_achievements")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"achievements": list})
}
