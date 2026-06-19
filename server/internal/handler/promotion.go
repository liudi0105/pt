package handler

import (
	"net/http"
	"strconv"

	"pt-server/internal/model"
	i18n "pt-server/internal/i18n"

	"github.com/gin-gonic/gin"
)

type UpdatePromotionRequest struct {
	Promotion string `json:"promotion" binding:"required"`
}

func (h *Handler) AdminUpdatePromotion(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_torrent_id")})
		return
	}

	var req UpdatePromotionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	promo := model.Promotion(req.Promotion)
	switch promo {
	case model.PromoNone, model.PromoFree, model.PromoTwoUp, model.PromoFreeTwoUp, model.PromoThirtyPct:
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_promotion_type")})
		return
	}

	if err := h.repo.Torrent.UpdatePromotion(id, promo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_update_promotion")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}
