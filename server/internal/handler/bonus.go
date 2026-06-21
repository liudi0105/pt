package handler

import (
	"net/http"
	"strconv"

	"pt-server/internal/bonus"
	"pt-server/internal/model"
	"pt-server/internal/repository"

	i18n "pt-server/internal/i18n"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ListUserBonusLogs(c *gin.Context) {
	userID, _ := c.Get("user_id")

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	result, err := h.repo.BonusLog.List(repository.BonusLogFilter{
		UserID:   userID.(int64),
		Page:     page,
		PageSize: pageSize,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "server_error")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"logs": result.Logs, "total": result.Total})
}

func (h *Handler) GetSeedBonusRate(c *gin.Context) {
	userID, _ := c.Get("user_id")
	cfg := h.siteCfg.BonusSnapshot()

	result, err := bonus.CalculateSeedBonusForUser(h.repo.DB(), userID.(int64), cfg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "server_error")})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"bonus_per_hour": result.SeedBonus,
		"seed_points":    result.SeedPoints,
		"torrent_count":  result.TorrentCount,
		"total_size":     result.TotalSize,
	})
}

func (h *Handler) GetBonusSettings(c *gin.Context) {
	cfg := h.siteCfg.BonusSnapshot()
	c.JSON(http.StatusOK, gin.H{
		"tzero":            cfg.TZero,
		"nzero":            cfg.NZero,
		"bzero":            cfg.BZero,
		"l":                cfg.L,
		"perseeding":       cfg.PerSeeding,
		"maxseeding":       cfg.MaxSeeding,
		"harvest_interval": cfg.HarvestInterval.String(),
	})
}

func (h *Handler) GetSeedBonusBreakdown(c *gin.Context) {
	userID, _ := c.Get("user_id")
	cfg := h.siteCfg.BonusSnapshot()

	result, err := bonus.CalculateSeedBonusBreakdown(h.repo.DB(), userID.(int64), cfg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "server_error")})
		return
	}

	c.JSON(http.StatusOK, result)
}

type BuyDownloadRequest struct {
	BonusSpent float64 `json:"bonus_spent" binding:"required"`
}

func (h *Handler) BuyDownload(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req BuyDownloadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	user, err := h.repo.User.GetByID(userID.(int64))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "user_not_found")})
		return
	}

	if user.Bonus < req.BonusSpent {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "insufficient_bonus")})
		return
	}

	downloadBytes := int64(req.BonusSpent / bonusPerGB * 1024 * 1024 * 1024)

	oldBonus := user.Bonus
	if err := h.repo.User.AddBonus(user.ID, -req.BonusSpent); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "transaction_failed")})
		return
	}
	h.repo.BonusLog.Create(&model.BonusLog{
		UserID:        user.ID,
		BusinessType:  model.BonusTypeExchange,
		OldTotalValue: oldBonus,
		Value:         -req.BonusSpent,
		NewTotalValue: oldBonus - req.BonusSpent,
		Comment:       "兑换下载流量",
	})
	if err := h.repo.User.AddDownload(user.ID, downloadBytes); err != nil {
		h.repo.User.AddBonus(user.ID, req.BonusSpent)
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "transaction_failed")})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"ok":             true,
		"download_bytes": downloadBytes,
		"bonus_spent":    req.BonusSpent,
		"remaining":      user.Bonus - req.BonusSpent,
	})
}
