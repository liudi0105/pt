package model

import "time"

type Comment struct {
	ID         int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID     int64     `gorm:"index;not null" json:"user_id"`
	TorrentID  int64     `gorm:"index;not null" json:"torrent_id"`
	Content    string    `gorm:"type:text;not null" json:"content"`
	CreatedAt  time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt  time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	Username string `gorm:"-" json:"username"`
}
