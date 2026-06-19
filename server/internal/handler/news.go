package handler

import (
	"net/http"
	"strconv"

	"pt-server/internal/model"
	i18n "pt-server/internal/i18n"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ListNews(c *gin.Context) {
	news, err := h.repo.News.List(20)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_news")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"news": news})
}

type CreateNewsRequest struct {
	Title   string `json:"title" binding:"required"`
	Content string `json:"content" binding:"required"`
}

func (h *Handler) CreateNews(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req CreateNewsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	n := &model.News{
		Title:   req.Title,
		Content: req.Content,
		UserID:  userID.(int64),
	}

	if err := h.repo.News.Create(n); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_create_news")})
		return
	}

	c.JSON(http.StatusCreated, n)
}

func (h *Handler) DeleteNews(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	if err := h.repo.News.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_delete_news")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}
