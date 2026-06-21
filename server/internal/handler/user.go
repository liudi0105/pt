package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"pt-server/internal/model"

	i18n "pt-server/internal/i18n"
	"pt-server/internal/repository"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func (h *Handler) GetProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")

	user, err := h.repo.User.GetByID(userID.(int64))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "user_not_found")})
		return
	}

	total, seeding, _ := h.repo.Snatch.CountByUser(user.ID)

	levelCode := 0
	levelLabel := ""
	if user.LevelID != nil {
		level, err := h.repo.Level.GetByID(*user.LevelID)
		if err == nil {
			levelCode = level.Code
			entries, err := h.repo.I18n.LoadByKeys([]string{fmt.Sprintf("user_level.%d.label", level.Code)})
			if err == nil {
				byKey := repository.GroupByKey(entries)
				if locales, ok := byKey[fmt.Sprintf("user_level.%d.label", level.Code)]; ok {
					levelLabel = locales[i18n.GetLang(c)]
				}
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"id":             user.ID,
		"username":       user.Username,
		"email":          user.Email,
		"passkey":        user.Passkey,
		"upload_bytes":   user.UploadBytes,
		"download_bytes": user.DownloadBytes,
		"bonus":          user.Bonus,
		"role":           user.Role,
		"level_code":     levelCode,
		"level_label":    levelLabel,
		"total_snatches": total,
		"seeding_count":  seeding,
		"created_at":     user.CreatedAt,
	})
}

func (h *Handler) GetSnatches(c *gin.Context) {
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
	snatches, err := h.repo.Snatch.ListByUser(userID.(int64), offset, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_snatches")})
		return
	}

	// Enrich with torrent names
	type SnatchWithTorrent struct {
		model.Snatch
		TorrentName string `json:"torrent_name"`
	}
	result := make([]SnatchWithTorrent, 0, len(snatches))
	for _, s := range snatches {
		swt := SnatchWithTorrent{Snatch: s}
		t, err := h.repo.Torrent.GetByID(s.TorrentID)
		if err == nil {
			swt.TorrentName = t.Name
		}
		result = append(result, swt)
	}

	c.JSON(http.StatusOK, gin.H{"snatches": result})
}

func (h *Handler) GetSeeding(c *gin.Context) {
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
	snatches, err := h.repo.Snatch.ListSeeding(userID.(int64), offset, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_seeding")})
		return
	}

	type SeedingInfo struct {
		model.Snatch
		TorrentName string `json:"torrent_name"`
		TorrentSize int64  `json:"torrent_size"`
	}
	result := make([]SeedingInfo, 0, len(snatches))
	for _, s := range snatches {
		si := SeedingInfo{Snatch: s}
		t, err := h.repo.Torrent.GetByID(s.TorrentID)
		if err == nil {
			si.TorrentName = t.Name
			si.TorrentSize = t.Size
		}
		result = append(result, si)
	}

	c.JSON(http.StatusOK, gin.H{"seeding": result})
}

type UpdatePasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=6"`
}

func (h *Handler) UpdatePassword(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req UpdatePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	user, err := h.repo.User.GetByID(userID.(int64))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "user_not_found")})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.CurrentPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": i18n.T(c, "current_password_incorrect")})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_update_password")})
		return
	}

	if err := h.repo.User.UpdatePassword(user.ID, string(hash)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_update_password")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

// ---- Bookmarks ----

func (h *Handler) ListBookmarks(c *gin.Context) {
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
	bms, err := h.repo.Bookmark.ListByUser(userID.(int64), offset, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_bookmarks")})
		return
	}

	type BookmarkWithTorrent struct {
		model.Bookmark
		TorrentName string `json:"torrent_name"`
		TorrentSize int64  `json:"torrent_size"`
		Seeders     int    `json:"seeders"`
		Leechers    int    `json:"leechers"`
	}
	result := make([]BookmarkWithTorrent, 0, len(bms))
	for _, bm := range bms {
		bwt := BookmarkWithTorrent{Bookmark: bm}
		t, err := h.repo.Torrent.GetByID(bm.TorrentID)
		if err == nil {
			bwt.TorrentName = t.Name
			bwt.TorrentSize = t.Size
			bwt.Seeders = t.Seeders
			bwt.Leechers = t.Leechers
		}
		result = append(result, bwt)
	}

	c.JSON(http.StatusOK, gin.H{"bookmarks": result})
}

func (h *Handler) AddBookmark(c *gin.Context) {
	userID, _ := c.Get("user_id")

	torrentID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_torrent_id")})
		return
	}

	exists, err := h.repo.Bookmark.Exists(userID.(int64), torrentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_check_bookmark")})
		return
	}
	if exists {
		c.JSON(http.StatusConflict, gin.H{"error": i18n.T(c, "already_bookmarked")})
		return
	}

	if err := h.repo.Bookmark.Add(userID.(int64), torrentID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_add_bookmark")})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"ok": true})
}

func (h *Handler) RemoveBookmark(c *gin.Context) {
	userID, _ := c.Get("user_id")

	torrentID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_torrent_id")})
		return
	}

	if err := h.repo.Bookmark.Remove(userID.(int64), torrentID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_remove_bookmark")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *Handler) CheckBookmark(c *gin.Context) {
	userID, _ := c.Get("user_id")

	torrentID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_torrent_id")})
		return
	}

	exists, err := h.repo.Bookmark.Exists(userID.(int64), torrentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_check_bookmark")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"bookmarked": exists})
}

// ---- Bonus Shop ----

type BuyUploadRequest struct {
	BonusSpent float64 `json:"bonus_spent" binding:"required,min=1"`
}

const bonusPerGB = 100.0

func (h *Handler) BuyUpload(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req BuyUploadRequest
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

	uploadBytes := int64(req.BonusSpent / bonusPerGB * 1024 * 1024 * 1024)

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
		Comment:       "兑换上传流量",
	})
	if err := h.repo.User.AddUpload(user.ID, uploadBytes); err != nil {
		// Rollback bonus
		h.repo.User.AddBonus(user.ID, req.BonusSpent)
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "transaction_failed")})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"ok":           true,
		"upload_bytes": uploadBytes,
		"bonus_spent":  req.BonusSpent,
		"remaining":    user.Bonus - req.BonusSpent,
	})
}
