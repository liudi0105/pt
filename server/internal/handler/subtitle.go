package handler

import (
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"pt-server/internal/model"
	"pt-server/internal/repository"

	i18n "pt-server/internal/i18n"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ListAllSubtitles(c *gin.Context) {
	filter := repository.SubtitleFilter{
		Keyword:  c.Query("keyword"),
		Language: c.Query("language"),
		Page:     1,
		PageSize: 50,
	}

	if p, err := strconv.Atoi(c.DefaultQuery("page", "1")); err == nil {
		filter.Page = p
	}
	if ps, err := strconv.Atoi(c.DefaultQuery("page_size", "50")); err == nil {
		filter.PageSize = ps
	}

	result, err := h.repo.Subtitle.ListAll(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_subtitles")})
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *Handler) ListSubtitles(c *gin.Context) {
	torrentID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_torrent_id")})
		return
	}

	subs, err := h.repo.Subtitle.ListByTorrent(torrentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_subtitles")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"subtitles": subs})
}

func (h *Handler) UploadSubtitle(c *gin.Context) {
	torrentID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_torrent_id")})
		return
	}

	userID, _ := c.Get("user_id")
	language := c.PostForm("language")
	if language == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "language_required")})
		return
	}

	file, err := c.FormFile("subtitle_file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "subtitle_file_required")})
		return
	}

	uploadDir := filepath.Join(h.cfg.UploadDir, "subs")
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_create_upload_dir")})
		return
	}

	filename := filepath.Join(uploadDir, strconv.FormatInt(torrentID, 10)+"_"+file.Filename)
	if err := c.SaveUploadedFile(file, filename); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_save_subtitle_file")})
		return
	}

	sub := &model.Subtitle{
		TorrentID: torrentID,
		UserID:    userID.(int64),
		Language:  language,
		Title:     c.PostForm("title"),
		FileName:  filename,
		FileSize:  file.Size,
	}

	if err := h.repo.Subtitle.Create(sub); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_save_subtitle_record")})
		return
	}

	c.JSON(http.StatusCreated, sub)
}

func (h *Handler) DownloadSubtitle(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("subId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	sub, err := h.repo.Subtitle.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "subtitle_not_found")})
		return
	}

	h.repo.Subtitle.IncrementHits(id)

	_, name := filepath.Split(sub.FileName)
	c.FileAttachment(sub.FileName, name)
}

func (h *Handler) DeleteSubtitle(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("subId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	sub, err := h.repo.Subtitle.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "subtitle_not_found")})
		return
	}

	os.Remove(sub.FileName)

	if err := h.repo.Subtitle.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_delete_subtitle")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}
