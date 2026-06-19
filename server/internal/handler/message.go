package handler

import (
	"net/http"
	"strconv"

	"pt-server/internal/model"
	i18n "pt-server/internal/i18n"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ListInbox(c *gin.Context) {
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
	msgs, err := h.repo.Message.ListInbox(userID.(int64), offset, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_inbox")})
		return
	}
	unread, _ := h.repo.Message.CountUnread(userID.(int64))
	c.JSON(http.StatusOK, gin.H{"messages": msgs, "unread": unread})
}

func (h *Handler) ListOutbox(c *gin.Context) {
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
	msgs, err := h.repo.Message.ListOutbox(userID.(int64), offset, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_outbox")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"messages": msgs})
}

type SendMessageRequest struct {
	ReceiverID int64  `json:"receiver_id" binding:"required"`
	Subject    string `json:"subject" binding:"required"`
	Body       string `json:"body" binding:"required"`
}

func (h *Handler) SendMessage(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var req SendMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	msg := &model.Message{
		SenderID:   userID.(int64),
		ReceiverID: req.ReceiverID,
		Subject:    req.Subject,
		Body:       req.Body,
	}
	if err := h.repo.Message.Create(msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_send_message")})
		return
	}
	c.JSON(http.StatusCreated, msg)
}

func (h *Handler) ReadMessage(c *gin.Context) {
	userID, _ := c.Get("user_id")
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	msg, err := h.repo.Message.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "message_not_found")})
		return
	}
	if msg.ReceiverID != userID.(int64) {
		c.JSON(http.StatusForbidden, gin.H{"error": i18n.T(c, "not_your_message")})
		return
	}

	h.repo.Message.MarkRead(id, userID.(int64))
	c.JSON(http.StatusOK, msg)
}

func (h *Handler) DeleteMessage(c *gin.Context) {
	userID, _ := c.Get("user_id")
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}
	if err := h.repo.Message.DeleteForUser(id, userID.(int64)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_delete_message")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
