package handler

import (
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"pt-server/internal/model"
	"pt-server/internal/repository"
	"pt-server/internal/utils"

	i18n "pt-server/internal/i18n"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ListTorrents(c *gin.Context) {
	filter := repository.TorrentFilter{
		Category: c.Query("category"),
		Keyword:  c.Query("keyword"),
		Page:     1,
		PageSize: 50,
	}

	if p, err := strconv.Atoi(c.DefaultQuery("page", "1")); err == nil {
		filter.Page = p
	}
	if ps, err := strconv.Atoi(c.DefaultQuery("page_size", "50")); err == nil {
		filter.PageSize = ps
	}

	result, err := h.repo.Torrent.List(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_torrents")})
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *Handler) GetTorrent(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	torrent, err := h.repo.Torrent.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "torrent_not_found")})
		return
	}

	c.JSON(http.StatusOK, torrent)
}

type EditTorrentRequest struct {
	Name          string `json:"name" binding:"required"`
	Description   string `json:"description"`
	Category      string `json:"category" binding:"required"`
	Source        string `json:"source"`
	Medium        string `json:"medium"`
	Codec         string `json:"codec"`
	Standard      string `json:"standard"`
	Processing    string `json:"processing"`
	Team          string `json:"team"`
	AudioCodec    string `json:"audiocodec"`
	SmallDescr    string `json:"small_descr"`
	TechnicalInfo string `json:"technical_info"`
	Cover         string `json:"cover"`
	NFO           string `json:"nfo"`
	Tags          string `json:"tags"`
}

func (h *Handler) EditTorrent(c *gin.Context) {
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	torrent, err := h.repo.Torrent.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "torrent_not_found")})
		return
	}

	if torrent.UserID != userID.(int64) && role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": i18n.T(c, "not_authorized_to_edit")})
		return
	}

	var req EditTorrentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	torrent.Name = req.Name
	torrent.Description = req.Description
	torrent.Category = req.Category
	torrent.Source = req.Source
	torrent.Medium = req.Medium
	torrent.Codec = req.Codec
	torrent.Standard = req.Standard
	torrent.Processing = req.Processing
	torrent.Team = req.Team
	torrent.AudioCodec = req.AudioCodec
	torrent.SmallDescr = req.SmallDescr
	torrent.TechnicalInfo = req.TechnicalInfo
	torrent.Cover = req.Cover
	torrent.NFO = req.NFO
	torrent.Tags = req.Tags
	if err := h.repo.Torrent.Update(torrent); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_update_torrent")})
		return
	}

	c.JSON(http.StatusOK, torrent)
}

func (h *Handler) DeleteTorrent(c *gin.Context) {
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	torrent, err := h.repo.Torrent.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "torrent_not_found")})
		return
	}

	if torrent.UserID != userID.(int64) && role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": i18n.T(c, "not_authorized_to_delete")})
		return
	}

	if err := h.repo.Torrent.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_delete_torrent")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *Handler) UploadTorrent(c *gin.Context) {
	file, err := c.FormFile("torrent_file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "torrent_file_required")})
		return
	}

	f, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_read_file")})
		return
	}
	defer f.Close()

	buf := make([]byte, file.Size)
	if _, err := f.Read(buf); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_read_file")})
		return
	}

	torrentInfo, err := utils.ParseTorrent(buf)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_torrent_file")})
		return
	}

	userID, _ := c.Get("user_id")

	nfoContent := ""
	if nfoFile, err := c.FormFile("nfo"); err == nil {
		if nfoFH, err := nfoFile.Open(); err == nil {
			nfoBuf := make([]byte, nfoFile.Size)
			if _, err := nfoFH.Read(nfoBuf); err == nil {
				nfoContent = string(nfoBuf)
			}
			nfoFH.Close()
		}
	}

	t := &model.Torrent{
		UserID:        userID.(int64),
		InfoHash:      torrentInfo.InfoHash[:],
		Name:          c.PostForm("name"),
		Description:   c.PostForm("description"),
		Size:          torrentInfo.Length,
		FileCount:     len(torrentInfo.Files),
		Category:      c.PostForm("category"),
		Source:        c.PostForm("source"),
		Medium:        c.PostForm("medium"),
		Codec:         c.PostForm("codec"),
		Standard:      c.PostForm("standard"),
		Processing:    c.PostForm("processing"),
		Team:          c.PostForm("team"),
		AudioCodec:    c.PostForm("audiocodec"),
		SmallDescr:    c.PostForm("small_descr"),
		TechnicalInfo: c.PostForm("technical_info"),
		Cover:         c.PostForm("cover"),
		NFO:           nfoContent,
		Tags:          c.PostForm("tags"),
	}

	if t.Name == "" {
		t.Name = torrentInfo.Name
	}

	if err := h.repo.Torrent.Create(t); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_create_torrent")})
		return
	}

	uploadDir := h.cfg.UploadDir
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_create_upload_dir")})
		return
	}
	filename := filepath.Join(uploadDir, t.InfoHashHex+".torrent")
	if err := os.WriteFile(filename, buf, 0644); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_save_torrent_file")})
		return
	}

	t.FileName = filename
	h.repo.Torrent.UpdateFileName(t.ID, filename)

	c.JSON(http.StatusCreated, gin.H{"id": t.ID})
}

func (h *Handler) DownloadTorrent(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	torrent, err := h.repo.Torrent.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "torrent_not_found")})
		return
	}

	if torrent.IsDeleted {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "torrent_not_found")})
		return
	}

	// If file exists on disk, serve it
	if torrent.FileName != "" {
		if _, err := os.Stat(torrent.FileName); err == nil {
			c.FileAttachment(torrent.FileName, torrent.Name+".torrent")
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "torrent_file_not_found")})
}

func (h *Handler) ListPeers(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	torrent, err := h.repo.Torrent.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "torrent_not_found")})
		return
	}

	snatches, err := h.repo.Snatch.ListByTorrentID(torrent.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_peers")})
		return
	}

	type PeerInfo struct {
		UserID     int64  `json:"user_id"`
		Username   string `json:"username"`
		Uploaded   int64  `json:"uploaded"`
		Downloaded int64  `json:"downloaded"`
		IsSeeding  bool   `json:"is_seeding"`
		IP         string `json:"ip"`
		Port       int    `json:"port"`
		LastSeen   string `json:"last_seen"`
	}

	var peers []PeerInfo
	for _, s := range snatches {
		username := ""
		u, err := h.repo.User.GetByID(s.UserID)
		if err == nil {
			username = u.Username
		}
		peers = append(peers, PeerInfo{
			UserID:     s.UserID,
			Username:   username,
			Uploaded:   s.Uploaded,
			Downloaded: s.Downloaded,
			IsSeeding:  s.IsSeeding,
			IP:         s.IP,
			Port:       s.Port,
			LastSeen:   s.LastAnnounce.Format("2006-01-02 15:04:05"),
		})
	}

	c.JSON(http.StatusOK, gin.H{"peers": peers})
}

func (h *Handler) Announce(c *gin.Context) {
	h.tracker.Handle(c)
}

func (h *Handler) Scrape(c *gin.Context) {
	h.tracker.Scrape(c)
}
