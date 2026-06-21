package seed

import (
	"log"

	"pt-server/internal/model"

	"gorm.io/gorm"
)

func insertForum(db *gorm.DB, data map[string]any) error {
	name := strVal(data, "name")
	if name == "" {
		return nil
	}
	var c int64
	db.Model(&model.Forum{}).Where("name = ?", name).Count(&c)
	if c > 0 {
		log.Printf("  Forum '%s' already exists, skipping", name)
		return nil
	}

	forum := model.Forum{
		Name:        name,
		Description: strVal(data, "description"),
		SortOrder:   intVal(data, "sort_order"),
		IsActive:    boolVal(data, "is_active"),
	}
	if forum.SortOrder == 0 {
		forum.SortOrder = 10
	}
	if _, ok := data["id"]; ok {
		forum.ID = int64Val(data, "id")
	}
	if createdAt := strVal(data, "created_at"); createdAt != "" {
		forum.CreatedAt = parseTime(createdAt)
	}
	return db.Create(&forum).Error
}

func insertForumMod(db *gorm.DB, data map[string]any) error {
	forumID := int64Val(data, "forum_id")
	userID := resolveUserID(db, data)
	if forumID == 0 || userID == 0 {
		return nil
	}

	var c int64
	db.Model(&model.ForumMod{}).Where("forum_id = ? AND user_id = ?", forumID, userID).Count(&c)
	if c > 0 {
		log.Printf("  ForumMod for forum %d user %d already exists, skipping", forumID, userID)
		return nil
	}

	mod := model.ForumMod{
		ForumID: forumID,
		UserID:  userID,
	}
	if _, ok := data["id"]; ok {
		mod.ID = int64Val(data, "id")
	}
	return db.Create(&mod).Error
}

func insertTopic(db *gorm.DB, data map[string]any) error {
	title := strVal(data, "title")
	if title == "" {
		return nil
	}
	forumID := int64Val(data, "forum_id")
	userID := resolveUserID(db, data)
	if forumID == 0 || userID == 0 {
		return nil
	}

	var c int64
	db.Model(&model.Topic{}).Where("forum_id = ? AND title = ?", forumID, title).Count(&c)
	if c > 0 {
		log.Printf("  Topic '%s' already exists, skipping", title)
		return nil
	}

	topic := model.Topic{
		ForumID:    forumID,
		UserID:     userID,
		Title:      title,
		Views:      intVal(data, "views"),
		PostCount:  intVal(data, "post_count"),
		IsSticky:   boolVal(data, "is_sticky"),
		IsLocked:   boolVal(data, "is_locked"),
		LastPostAt: parseTime(strVal(data, "last_post_at")),
	}
	if topic.LastPostAt.IsZero() {
		topic.LastPostAt = parseTime(strVal(data, "created_at"))
	}
	if _, ok := data["id"]; ok {
		topic.ID = int64Val(data, "id")
	}
	if createdAt := strVal(data, "created_at"); createdAt != "" {
		topic.CreatedAt = parseTime(createdAt)
	}
	if updatedAt := strVal(data, "updated_at"); updatedAt != "" {
		topic.UpdatedAt = parseTime(updatedAt)
	}
	return db.Create(&topic).Error
}

func insertPost(db *gorm.DB, data map[string]any) error {
	topicID := int64Val(data, "topic_id")
	userID := resolveUserID(db, data)
	content := strVal(data, "content")
	if topicID == 0 || userID == 0 || content == "" {
		return nil
	}

	var c int64
	db.Model(&model.Post{}).Where("topic_id = ? AND user_id = ? AND content = ?", topicID, userID, content).Count(&c)
	if c > 0 {
		log.Printf("  Post for topic %d already exists, skipping", topicID)
		return nil
	}

	post := model.Post{
		TopicID: topicID,
		UserID:  userID,
		Content: content,
		IsFirst: boolVal(data, "is_first"),
	}
	if _, ok := data["id"]; ok {
		post.ID = int64Val(data, "id")
	}
	if createdAt := strVal(data, "created_at"); createdAt != "" {
		post.CreatedAt = parseTime(createdAt)
	}
	if updatedAt := strVal(data, "updated_at"); updatedAt != "" {
		post.UpdatedAt = parseTime(updatedAt)
	}
	return db.Create(&post).Error
}

func insertReadPost(db *gorm.DB, data map[string]any) error {
	userID := resolveUserID(db, data)
	topicID := int64Val(data, "topic_id")
	postID := int64Val(data, "post_id")
	if userID == 0 || topicID == 0 || postID == 0 {
		return nil
	}

	var c int64
	db.Model(&model.ReadPost{}).Where("user_id = ? AND topic_id = ?", userID, topicID).Count(&c)
	if c > 0 {
		log.Printf("  ReadPost for user %d topic %d already exists, skipping", userID, topicID)
		return nil
	}

	rp := model.ReadPost{
		UserID:  userID,
		TopicID: topicID,
		PostID:  postID,
	}
	if _, ok := data["id"]; ok {
		rp.ID = int64Val(data, "id")
	}
	return db.Create(&rp).Error
}
