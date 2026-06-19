package model

import "time"

type Attendance struct {
	ID              int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID          int64     `gorm:"uniqueIndex;not null" json:"user_id"`
	LastCheckin     time.Time `json:"last_checkin"`
	ConsecutiveDays int       `gorm:"default:0" json:"consecutive_days"`
	TotalDays       int       `gorm:"default:0" json:"total_days"`
	UpdatedAt       time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
