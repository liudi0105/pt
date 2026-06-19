package model

import "time"

type Announcement struct {
	ID        int64      `gorm:"primaryKey;autoIncrement" json:"id"`
	Title     string     `gorm:"size:255;not null" json:"title"`
	Content   string     `gorm:"type:text" json:"content"`
	IsSticky  bool       `gorm:"default:false" json:"is_sticky"`
	ExpiresAt *time.Time `json:"expires_at,omitempty"`
	IsActive  bool       `gorm:"default:true" json:"is_active"`
	CreatedBy int64      `gorm:"not null" json:"created_by"`
	CreatedAt time.Time  `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time  `gorm:"autoUpdateTime" json:"updated_at"`
}
