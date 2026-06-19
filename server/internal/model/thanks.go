package model

import "time"

type Thanks struct {
	ID        int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    int64     `gorm:"uniqueIndex:idx_thanks_user_torrent;not null" json:"user_id"`
	TorrentID int64     `gorm:"uniqueIndex:idx_thanks_user_torrent;not null" json:"torrent_id"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}
