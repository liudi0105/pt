package model

import "time"

type Achievement struct {
	ID          int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	Code        int       `gorm:"uniqueIndex;not null" json:"code"`
	Name        string    `gorm:"size:128" json:"name"`
	Description string    `gorm:"type:text" json:"description"`
	Icon        string    `gorm:"size:255" json:"icon"`
	Group       string    `gorm:"size:32;index;default:other" json:"group"`
	Condition   string    `gorm:"type:text" json:"condition"`
	IsActive    bool      `gorm:"default:true" json:"is_active"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (Achievement) TableName() string { return "achievements" }

type UserAchievement struct {
	ID              int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID          int64     `gorm:"uniqueIndex:idx_user_achievement;not null" json:"user_id"`
	AchievementID   int64     `gorm:"uniqueIndex:idx_user_achievement;not null" json:"achievement_id"`
	UnlockedAt      time.Time `json:"unlocked_at"`
	AchievementCode int       `gorm:"-" json:"achievement_code"`
}

func (UserAchievement) TableName() string { return "user_achievements" }
