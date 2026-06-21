package model

import "time"

type RoleModel struct {
	ID          int64                        `gorm:"primaryKey" json:"id"`
	Key         string                       `gorm:"size:32;uniqueIndex;not null" json:"key"`
	DisplayName string                       `gorm:"size:64" json:"display_name"`
	Description string                       `gorm:"size:255" json:"description"`
	IsSystem    bool                         `gorm:"default:false" json:"is_system"`
	SortOrder   int                          `gorm:"default:0" json:"sort_order"`
	Permissions []Permission                 `gorm:"many2many:role_permissions" json:"permissions,omitempty"`
	CreatedAt   time.Time                    `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time                    `gorm:"autoUpdateTime" json:"updated_at"`
	I18n        map[string]map[string]string `gorm:"-" json:"i18n,omitempty"`
}

type Permission struct {
	ID          int64     `gorm:"primaryKey" json:"id"`
	Code        string    `gorm:"size:64;uniqueIndex;not null" json:"code"`
	Name        string    `gorm:"size:64" json:"name"`
	Group       string    `gorm:"size:32;index;not null" json:"group"`
	Description string    `gorm:"size:255" json:"description"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
}
