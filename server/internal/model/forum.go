package model

import "time"

type Forum struct {
	ID          int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	Name        string    `gorm:"size:128;not null" json:"name"`
	Description string    `gorm:"size:255" json:"description"`
	SortOrder   int       `gorm:"default:0" json:"sort_order"`
	IsActive    bool      `gorm:"default:true" json:"is_active"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
}

type Topic struct {
	ID         int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	ForumID    int64     `gorm:"index;not null" json:"forum_id"`
	UserID     int64     `gorm:"index;not null" json:"user_id"`
	Title      string    `gorm:"size:255;not null" json:"title"`
	Views      int       `gorm:"default:0" json:"views"`
	PostCount  int       `gorm:"default:0" json:"post_count"`
	IsSticky   bool      `gorm:"default:false;index" json:"is_sticky"`
	IsLocked   bool      `gorm:"default:false" json:"is_locked"`
	LastPostAt time.Time `json:"last_post_at"`
	CreatedAt  time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt  time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	Username  string `gorm:"-" json:"username,omitempty"`
	ForumName string `gorm:"-" json:"forum_name,omitempty"`
}

type Post struct {
	ID        int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	TopicID   int64     `gorm:"index;not null" json:"topic_id"`
	UserID    int64     `gorm:"index;not null" json:"user_id"`
	Content   string    `gorm:"type:text;not null" json:"content"`
	IsFirst   bool      `gorm:"default:false" json:"is_first"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	Username string `gorm:"-" json:"username,omitempty"`
}

type ForumMod struct {
	ID      int64 `gorm:"primaryKey;autoIncrement" json:"id"`
	ForumID int64 `gorm:"uniqueIndex:idx_forum_mod;not null" json:"forum_id"`
	UserID  int64 `gorm:"uniqueIndex:idx_forum_mod;not null" json:"user_id"`
}

type ReadPost struct {
	ID      int64 `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID  int64 `gorm:"uniqueIndex:idx_read_post;not null" json:"user_id"`
	TopicID int64 `gorm:"uniqueIndex:idx_read_post;not null" json:"topic_id"`
	PostID  int64 `gorm:"not null" json:"post_id"`
}
