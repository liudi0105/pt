package model

import "time"

type Role string

const (
	RoleUser  Role = "user"
	RoleVIP   Role = "vip"
	RoleAdmin Role = "admin"
)

type User struct {
	ID            int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	Username      string    `gorm:"size:64;uniqueIndex;not null" json:"username"`
	Email         string    `gorm:"size:128;uniqueIndex;not null" json:"email"`
	PasswordHash  string    `gorm:"size:255;not null" json:"-"`
	Passkey       string    `gorm:"size:64;uniqueIndex;not null" json:"passkey"`
	Role          Role      `gorm:"type:varchar(16);default:user;index" json:"role"`
	RoleID        *int64    `gorm:"index" json:"role_id"`
	Status        int       `gorm:"default:0;index" json:"status"`
	UploadBytes   int64     `gorm:"default:0" json:"upload_bytes"`
	DownloadBytes int64     `gorm:"default:0" json:"download_bytes"`
	Bonus         float64   `gorm:"type:decimal(12,2);default:0" json:"bonus"`
	LevelID       *int64    `gorm:"index" json:"level_id"`
	CreatedAt     time.Time `gorm:"autoCreateTime" json:"created_at"`
}
