package handler

import (
	"net/http"
	"strconv"
	"time"

	i18n "pt-server/internal/i18n"
	"pt-server/internal/model"
	"pt-server/internal/repository"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func (h *Handler) ListForums(c *gin.Context) {
	forums, err := h.repo.Forum.ListActive()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_forums")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"forums": forums})
}

func (h *Handler) ListForumTopics(c *gin.Context) {
	forumID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_forum_id")})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 50 {
		pageSize = 20
	}

	offset := (page - 1) * pageSize
	topics, err := h.repo.Topic.ListByForum(forumID, offset, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_topics")})
		return
	}

	total, _ := h.repo.Topic.CountByForum(forumID)

	forum, _ := h.repo.Forum.GetByID(forumID)

	c.JSON(http.StatusOK, gin.H{"topics": topics, "total": total, "forum": forum})
}

func (h *Handler) GetTopic(c *gin.Context) {
	topicID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_topic_id")})
		return
	}

	topic, err := h.repo.Topic.GetByID(topicID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "topic_not_found")})
		return
	}

	h.repo.Topic.IncrementViews(topicID)

	userID, _ := c.Get("user_id")
	if uid, ok := userID.(int64); ok {
		latestPostID, err := h.repo.Post.GetLatestPostID(topicID)
		if err == nil {
			h.repo.ReadPost.Upsert(&model.ReadPost{
				UserID:  uid,
				TopicID: topicID,
				PostID:  latestPostID,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{"topic": topic})
}

func (h *Handler) ListTopicPosts(c *gin.Context) {
	topicID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_topic_id")})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 50 {
		pageSize = 20
	}

	offset := (page - 1) * pageSize
	posts, err := h.repo.Post.ListByTopic(topicID, offset, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_posts")})
		return
	}

	total, _ := h.repo.Post.CountByTopic(topicID)

	topic, _ := h.repo.Topic.GetByID(topicID)

	c.JSON(http.StatusOK, gin.H{"posts": posts, "total": total, "topic": topic})
}

type CreateTopicRequest struct {
	ForumID int64  `json:"forum_id" binding:"required"`
	Title   string `json:"title" binding:"required"`
	Content string `json:"content" binding:"required"`
}

func (h *Handler) CreateTopic(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid := userID.(int64)

	var req CreateTopicRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	forum, err := h.repo.Forum.GetByID(req.ForumID)
	if err != nil || !forum.IsActive {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "forum_not_found")})
		return
	}

	now := time.Now()
	topic := &model.Topic{
		ForumID:    req.ForumID,
		UserID:     uid,
		Title:      req.Title,
		PostCount:  1,
		IsSticky:   false,
		IsLocked:   false,
		LastPostAt: now,
	}

	post := &model.Post{
		UserID:  uid,
		Content: req.Content,
		IsFirst: true,
	}

	if err := h.repo.DB().Transaction(func(tx *gorm.DB) error {
		topicRepo := repository.NewTopicRepo(tx)
		postRepo := repository.NewPostRepo(tx)

		if err := topicRepo.Create(topic); err != nil {
			return err
		}

		post.TopicID = topic.ID
		if err := postRepo.Create(post); err != nil {
			return err
		}

		return nil
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_create_topic")})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"topic": topic, "post": post})
}

type CreatePostRequest struct {
	Content string `json:"content" binding:"required"`
}

func (h *Handler) CreatePost(c *gin.Context) {
	topicID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_topic_id")})
		return
	}

	userID, _ := c.Get("user_id")

	topic, err := h.repo.Topic.GetByID(topicID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "topic_not_found")})
		return
	}

	if topic.IsLocked {
		c.JSON(http.StatusForbidden, gin.H{"error": i18n.T(c, "topic_is_locked")})
		return
	}

	var req CreatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	post := &model.Post{
		TopicID: topicID,
		UserID:  userID.(int64),
		Content: req.Content,
	}

	now := time.Now()
	if err := h.repo.DB().Transaction(func(tx *gorm.DB) error {
		postRepo := repository.NewPostRepo(tx)
		if err := postRepo.Create(post); err != nil {
			return err
		}

		return tx.Model(&model.Topic{}).
			Where("id = ?", topic.ID).
			Updates(map[string]any{
				"last_post_at": now,
				"post_count":   gorm.Expr("post_count + 1"),
			}).Error
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_create_post")})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"post": post})
}

func (h *Handler) UpdateTopic(c *gin.Context) {
	topicID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_topic_id")})
		return
	}

	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")

	topic, err := h.repo.Topic.GetByID(topicID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "topic_not_found")})
		return
	}

	if topic.UserID != userID.(int64) && role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": i18n.T(c, "cannot_edit_topic")})
		return
	}

	var req struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	if err := h.repo.DB().Transaction(func(tx *gorm.DB) error {
		if req.Title != "" {
			topic.Title = req.Title
		}
		if err := tx.Save(topic).Error; err != nil {
			return err
		}

		if req.Content != "" {
			var firstPost model.Post
			if err := tx.Where("topic_id = ? AND is_first = ?", topicID, true).First(&firstPost).Error; err == nil {
				firstPost.Content = req.Content
				if err := tx.Save(&firstPost).Error; err != nil {
					return err
				}
			}
		}
		return nil
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_update_topic")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"topic": topic})
}

func (h *Handler) UpdatePost(c *gin.Context) {
	postID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_post_id")})
		return
	}

	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")

	post, err := h.repo.Post.GetByID(postID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "post_not_found")})
		return
	}

	if post.UserID != userID.(int64) && role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": i18n.T(c, "cannot_edit_post")})
		return
	}

	var req struct {
		Content string `json:"content" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	post.Content = req.Content
	if err := h.repo.Post.Update(post); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_update_post")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"post": post})
}

func (h *Handler) DeleteTopic(c *gin.Context) {
	topicID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_topic_id")})
		return
	}

	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")

	topic, err := h.repo.Topic.GetByID(topicID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "topic_not_found")})
		return
	}

	if topic.UserID != userID.(int64) && role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": i18n.T(c, "cannot_delete_topic")})
		return
	}

	if err := h.repo.DB().Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("topic_id = ?", topicID).Delete(&model.ReadPost{}).Error; err != nil {
			return err
		}
		if err := tx.Where("topic_id = ?", topicID).Delete(&model.Post{}).Error; err != nil {
			return err
		}
		return tx.Delete(&model.Topic{}, topicID).Error
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_delete_topic")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *Handler) DeletePost(c *gin.Context) {
	postID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_post_id")})
		return
	}

	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")

	post, err := h.repo.Post.GetByID(postID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "post_not_found")})
		return
	}

	if post.IsFirst {
		c.JSON(http.StatusForbidden, gin.H{"error": i18n.T(c, "cannot_delete_first_post")})
		return
	}

	deleteAndRecount := func(tx *gorm.DB) error {
		if role == "admin" {
			if err := tx.Delete(&model.Post{}, postID).Error; err != nil {
				return err
			}
		} else {
			if post.UserID != userID.(int64) {
				return gorm.ErrRecordNotFound
			}
			if err := tx.Where("id = ? AND user_id = ?", postID, userID.(int64)).Delete(&model.Post{}).Error; err != nil {
				return err
			}
		}

		var count int64
		if err := tx.Model(&model.Post{}).Where("topic_id = ?", post.TopicID).Count(&count).Error; err != nil {
			return err
		}

		var latestPost model.Post
		if err := tx.Where("topic_id = ?", post.TopicID).Order("created_at DESC, id DESC").First(&latestPost).Error; err != nil {
			return err
		}

		return tx.Model(&model.Topic{}).
			Where("id = ?", post.TopicID).
			Updates(map[string]any{
				"post_count":   count,
				"last_post_at": latestPost.CreatedAt,
			}).Error
	}

	if err := h.repo.DB().Transaction(deleteAndRecount); err != nil {
		if role == "admin" {
			c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_delete_post")})
		} else {
			c.JSON(http.StatusForbidden, gin.H{"error": i18n.T(c, "cannot_delete_post")})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *Handler) ListRecentTopics(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 50 {
		pageSize = 20
	}

	offset := (page - 1) * pageSize
	topics, err := h.repo.Topic.ListRecent(offset, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_topics")})
		return
	}

	total, _ := h.repo.Topic.CountAll()

	c.JSON(http.StatusOK, gin.H{"topics": topics, "total": total})
}

func (h *Handler) SearchTopics(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "search_query_required")})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 50 {
		pageSize = 20
	}

	offset := (page - 1) * pageSize
	topics, err := h.repo.Topic.Search(query, offset, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_search")})
		return
	}

	total, _ := h.repo.Topic.SearchCount(query)

	c.JSON(http.StatusOK, gin.H{"topics": topics, "total": total, "query": query})
}

// Admin handlers

type CreateForumRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	SortOrder   int    `json:"sort_order"`
}

func (h *Handler) AdminListForums(c *gin.Context) {
	forums, err := h.repo.Forum.ListAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_forums")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"forums": forums})
}

func (h *Handler) AdminCreateForum(c *gin.Context) {
	var req CreateForumRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	forum := &model.Forum{
		Name:        req.Name,
		Description: req.Description,
		SortOrder:   req.SortOrder,
		IsActive:    true,
	}

	if err := h.repo.Forum.Create(forum); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_create_forum")})
		return
	}

	c.JSON(http.StatusCreated, forum)
}

func (h *Handler) AdminUpdateForum(c *gin.Context) {
	forumID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_forum_id")})
		return
	}

	forum, err := h.repo.Forum.GetByID(forumID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "forum_not_found")})
		return
	}

	var req CreateForumRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	forum.Name = req.Name
	forum.Description = req.Description
	forum.SortOrder = req.SortOrder

	if err := h.repo.Forum.Update(forum); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_update_forum")})
		return
	}

	c.JSON(http.StatusOK, forum)
}

func (h *Handler) AdminDeleteForum(c *gin.Context) {
	forumID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_forum_id")})
		return
	}

	if err := h.repo.Forum.Delete(forumID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_delete_forum")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *Handler) ListUnreadTopics(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid, ok := userID.(int64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": i18n.T(c, "unauthorized")})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 50 {
		pageSize = 20
	}

	offset := (page - 1) * pageSize
	topics, err := h.repo.Topic.ListUnread(uid, offset, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_topics")})
		return
	}

	total, _ := h.repo.Topic.CountUnread(uid)

	c.JSON(http.StatusOK, gin.H{
		"topics": topics,
		"total":  total,
	})
}
