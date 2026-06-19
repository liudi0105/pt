package model

import "time"

type Peer struct {
	UserID     int64     `json:"user_id"`
	PeerID     string    `json:"peer_id"`
	IP         string    `json:"ip"`
	Port       int       `json:"port"`
	Uploaded   int64     `json:"uploaded"`
	Downloaded int64     `json:"downloaded"`
	Left       int64     `json:"left"`
	Event      string    `json:"event"`
	LastSeen   time.Time `json:"last_seen"`
	IsSeeder   bool      `json:"is_seeder"`
}

type Snatch struct {
	ID           int64      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID       int64      `gorm:"uniqueIndex:idx_user_torrent;not null" json:"user_id"`
	TorrentID    int64      `gorm:"uniqueIndex:idx_user_torrent;not null" json:"torrent_id"`
	Uploaded     int64      `gorm:"default:0" json:"uploaded"`
	Downloaded   int64      `gorm:"default:0" json:"downloaded"`
	Left         int64      `gorm:"default:0" json:"left"`
	IP           string     `gorm:"size:45;default:''" json:"ip"`
	Port         int        `gorm:"default:0" json:"port"`
	PeerID       string     `gorm:"size:64;default:''" json:"peer_id"`
	SeedTime     int64      `gorm:"default:0" json:"seed_time"`
	LeechTime    int64      `gorm:"default:0" json:"leech_time"`
	IsSeeding    bool       `gorm:"index;default:false" json:"is_seeding"`
	IsHR         bool       `gorm:"default:false;index" json:"is_hr"`
	StartedAt    time.Time  `gorm:"autoCreateTime" json:"started_at"`
	LastAnnounce time.Time  `gorm:"autoUpdateTime" json:"last_announce"`
	FinishedAt   *time.Time `json:"finished_at"`
}
