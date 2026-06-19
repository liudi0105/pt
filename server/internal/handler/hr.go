package handler

import (
	"net/http"
	"strconv"

	i18n "pt-server/internal/i18n"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ListHR(c *gin.Context) {
	userID, _ := c.Get("user_id")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	snatches, err := h.repo.Snatch.ListHR(userID.(int64), offset, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_hr")})
		return
	}

	type HRInfo struct {
		ID          int64  `json:"id"`
		TorrentID   int64  `json:"torrent_id"`
		TorrentName string `json:"torrent_name"`
		Uploaded    int64  `json:"uploaded"`
		Downloaded  int64  `json:"downloaded"`
		SeedTime    int64  `json:"seed_time"`
		IsSeeding   bool   `json:"is_seeding"`
		FinishedAt  string `json:"finished_at"`
	}

	result := make([]HRInfo, 0, len(snatches))
	for _, s := range snatches {
		hi := HRInfo{
			ID:         s.ID,
			TorrentID:  s.TorrentID,
			Uploaded:   s.Uploaded,
			Downloaded: s.Downloaded,
			SeedTime:   s.SeedTime,
			IsSeeding:  s.IsSeeding,
		}
		if s.FinishedAt != nil {
			hi.FinishedAt = s.FinishedAt.Format("2006-01-02 15:04:05")
		}
		t, err := h.repo.Torrent.GetByID(s.TorrentID)
		if err == nil {
			hi.TorrentName = t.Name
		}
		result = append(result, hi)
	}

	count, _ := h.repo.Snatch.CountHR(userID.(int64))
	c.JSON(http.StatusOK, gin.H{"hr_list": result, "total": count})
}
