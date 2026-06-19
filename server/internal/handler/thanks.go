package handler

import (
	"net/http"
	"strconv"

	i18n "pt-server/internal/i18n"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ThankTorrent(c *gin.Context) {
	torrentID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_torrent_id")})
		return
	}

	userID, _ := c.Get("user_id")

	exists, err := h.repo.Thanks.Exists(userID.(int64), torrentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_check_thanks")})
		return
	}
	if exists {
		c.JSON(http.StatusConflict, gin.H{"error": i18n.T(c, "already_thanked")})
		return
	}

	if err := h.repo.Thanks.Add(userID.(int64), torrentID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_add_thanks")})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"ok": true})
}

func (h *Handler) ThanksCount(c *gin.Context) {
	torrentID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_torrent_id")})
		return
	}

	count, _ := h.repo.Thanks.CountByTorrent(torrentID)
	c.JSON(http.StatusOK, gin.H{"count": count})
}

func (h *Handler) CheckThanks(c *gin.Context) {
	torrentID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_torrent_id")})
		return
	}

	userID, _ := c.Get("user_id")
	exists, _ := h.repo.Thanks.Exists(userID.(int64), torrentID)

	c.JSON(http.StatusOK, gin.H{"thanked": exists})
}
