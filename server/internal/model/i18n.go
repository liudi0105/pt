package model

import "time"

type I18n struct {
	Key       string    `gorm:"size:255;not null;primaryKey" json:"key"`
	Locale    string    `gorm:"size:10;not null;primaryKey" json:"locale"`
	Value     string    `gorm:"type:text;not null" json:"value"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (I18n) TableName() string { return "sys_i18n" }
