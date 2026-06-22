package model

import "time"

type Subtitle struct {
	ID         int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	TorrentID  int64     `gorm:"index;not null" json:"torrent_id"`
	UserID     int64     `gorm:"index;not null" json:"user_id"`
	Language   string    `gorm:"size:32;not null" json:"language"`
	Title      string    `gorm:"size:255" json:"title"`
	FileName   string    `gorm:"size:255;not null" json:"-"`
	FileSize   int64     `gorm:"default:0" json:"file_size"`
	Hits       int       `gorm:"default:0" json:"hits"`
	CreatedAt  time.Time `gorm:"autoCreateTime" json:"created_at"`

	Username    string `gorm:"-" json:"username"`
	TorrentName string `gorm:"-" json:"torrent_name"`
}

type SubtitleListResult struct {
	Subtitles []Subtitle `json:"subtitles"`
	Total     int64      `json:"total"`
}

func (Subtitle) TableName() string { return "subs" }
