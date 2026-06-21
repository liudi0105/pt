package seed

import (
	"log"

	"pt-server/internal/model"

	"gorm.io/gorm"
)

func insertNews(db *gorm.DB, data map[string]any) error {
	title := strVal(data, "title")
	if title == "" {
		return nil
	}
	var c int64
	db.Model(&model.News{}).Where("title = ?", title).Count(&c)
	if c > 0 {
		log.Printf("  News '%s' already exists, skipping", title)
		return nil
	}

	userID := resolveUserID(db, data)

	n := model.News{
		Title:   title,
		Content: strVal(data, "content"),
		UserID:  userID,
	}
	return db.Create(&n).Error
}

func insertComment(db *gorm.DB, data map[string]any) error {
	content := strVal(data, "content")
	if content == "" {
		return nil
	}

	userID := resolveUserID(db, data)
	torrentID := int64Val(data, "torrent_id")
	if userID == 0 || torrentID == 0 {
		return nil
	}

	var c int64
	db.Model(&model.Comment{}).Where("user_id = ? AND torrent_id = ? AND content = ?", userID, torrentID, content).Count(&c)
	if c > 0 {
		log.Printf("  Comment from user %d on torrent %d already exists, skipping", userID, torrentID)
		return nil
	}

	comment := model.Comment{
		UserID:    userID,
		TorrentID: torrentID,
		Content:   content,
	}
	return db.Create(&comment).Error
}

func insertAnnouncement(db *gorm.DB, data map[string]any) error {
	title := strVal(data, "title")
	if title == "" {
		return nil
	}
	var c int64
	db.Model(&model.Announcement{}).Where("title = ?", title).Count(&c)
	if c > 0 {
		log.Printf("  Announcement '%s' already exists, skipping", title)
		return nil
	}

	expiresAt := parseTimePtr(strVal(data, "expires_at"))
	a := model.Announcement{
		Title:     title,
		Content:   strVal(data, "content"),
		IsSticky:  boolVal(data, "is_sticky"),
		ExpiresAt: expiresAt,
		IsActive:  boolVal(data, "is_active"),
		CreatedBy: resolveUserID(db, data),
	}
	return db.Create(&a).Error
}
