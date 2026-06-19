package model

import "time"

type Invite struct {
	ID        int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	SenderID  int64     `gorm:"index;not null" json:"sender_id"`
	Code      string    `gorm:"uniqueIndex;size:64;not null" json:"code"`
	Email     string    `gorm:"size:255" json:"email"`
	IsUsed    bool      `gorm:"default:false" json:"is_used"`
	UsedByID  *int64    `gorm:"default:null" json:"used_by_id"`
	ExpiresAt time.Time `json:"expires_at"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`

	UsedByName string `gorm:"-" json:"used_by_name"`
}
