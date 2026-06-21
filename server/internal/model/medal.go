package model

import "time"

type Medal struct {
	ID          int64                        `gorm:"primaryKey;autoIncrement" json:"id"`
	Code        int                          `gorm:"uniqueIndex;not null" json:"code"`
	Description string                       `gorm:"type:text" json:"description"`
	Image       string                       `gorm:"size:255" json:"image"`
	Color       string                       `gorm:"size:32;default:''" json:"color"`
	Price       float64                      `gorm:"type:decimal(12,2);default:0" json:"price"`
	IsActive    bool                         `gorm:"default:true" json:"is_active"`
	CreatedAt   time.Time                    `gorm:"autoCreateTime" json:"created_at"`
	I18n        map[string]map[string]string `gorm:"-" json:"i18n,omitempty"`
}

type UserMedal struct {
	ID        int64      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    int64      `gorm:"uniqueIndex:idx_user_medal;not null" json:"user_id"`
	MedalID   int64      `gorm:"uniqueIndex:idx_user_medal;not null" json:"medal_id"`
	IsWearing bool       `gorm:"default:false" json:"is_wearing"`
	ExpireAt  *time.Time `json:"expire_at"`
	CreatedAt time.Time  `gorm:"autoCreateTime" json:"created_at"`

	MedalCode int `gorm:"-" json:"medal_code"`
}
