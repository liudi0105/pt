package handler

import (
	"net/http"
	"strconv"

	"pt-server/internal/model"
	i18n "pt-server/internal/i18n"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ListComments(c *gin.Context) {
	torrentID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_torrent_id")})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "50"))
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 50
	}

	offset := (page - 1) * pageSize
	comments, err := h.repo.Comment.ListByTorrent(torrentID, offset, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_comments")})
		return
	}

	total, _ := h.repo.Comment.CountByTorrent(torrentID)

	c.JSON(http.StatusOK, gin.H{"comments": comments, "total": total})
}

type CreateCommentRequest struct {
	Content string `json:"content" binding:"required"`
}

func (h *Handler) CreateComment(c *gin.Context) {
	torrentID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_torrent_id")})
		return
	}

	userID, _ := c.Get("user_id")

	var req CreateCommentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	comment := &model.Comment{
		UserID:    userID.(int64),
		TorrentID: torrentID,
		Content:   req.Content,
	}

	if err := h.repo.Comment.Create(comment); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_create_comment")})
		return
	}

	c.JSON(http.StatusCreated, comment)
}

func (h *Handler) DeleteComment(c *gin.Context) {
	commentID, err := strconv.ParseInt(c.Param("commentId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_comment_id")})
		return
	}

	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")

	if role == "admin" {
		if err := h.repo.Comment.Delete(commentID, 0); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_delete_comment")})
			return
		}
	} else {
		if err := h.repo.Comment.Delete(commentID, userID.(int64)); err != nil {
			c.JSON(http.StatusForbidden, gin.H{"error": i18n.T(c, "cannot_delete_comment")})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}
