package model

import "time"

type SiteSetting struct {
	ID          int64     `gorm:"primaryKey" json:"id"`
	Key         string    `gorm:"size:64;uniqueIndex;not null" json:"key"`
	Value       string    `gorm:"size:255;not null" json:"value"`
	Type        string    `gorm:"size:32;default:'string'" json:"type"`
	Description string    `gorm:"size:255" json:"description"`
	IsActive    bool      `gorm:"default:true" json:"is_active"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
