package model

import "time"

type Medal struct {
	ID          int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	Name        string    `gorm:"size:64;not null" json:"name"`
	Description string    `gorm:"type:text" json:"description"`
	Image       string    `gorm:"size:255" json:"image"`
	Price       float64   `gorm:"type:decimal(12,2);default:0" json:"price"`
	IsActive    bool      `gorm:"default:true" json:"is_active"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
}

type UserMedal struct {
	ID        int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    int64     `gorm:"uniqueIndex:idx_user_medal;not null" json:"user_id"`
	MedalID   int64     `gorm:"uniqueIndex:idx_user_medal;not null" json:"medal_id"`
	ExpireAt  *time.Time `json:"expire_at"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`

	MedalName string `gorm:"-" json:"medal_name"`
}
