package model

import "time"

type DictType struct {
	ID        int64                        `gorm:"primaryKey;autoIncrement" json:"id"`
	Key       string                       `gorm:"size:64;not null;unique" json:"key"`
	Label     string                       `gorm:"size:128;not null" json:"label"`
	Remark    string                       `gorm:"size:255" json:"remark"`
	SortOrder int                          `gorm:"default:0" json:"sort_order"`
	IsSystem  bool                         `gorm:"default:false" json:"is_system"`
	IsActive  bool                         `gorm:"default:true" json:"is_active"`
	CreatedAt time.Time                    `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time                    `gorm:"autoUpdateTime" json:"updated_at"`
	I18n      map[string]map[string]string `gorm:"-" json:"i18n,omitempty"`
}

func (DictType) TableName() string { return "sys_dict_type" }

type DictData struct {
	ID        int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	TypeKey   string    `gorm:"size:64;index;not null" json:"type_key"`
	Key       string    `gorm:"size:128;not null" json:"key"`
	Label     string    `gorm:"size:255" json:"label"`
	SortOrder int       `gorm:"default:0" json:"sort_order"`
	IsActive  bool      `gorm:"default:true" json:"is_active"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	I18n map[string]map[string]string `gorm:"-" json:"i18n,omitempty"`
}

func (DictData) TableName() string { return "sys_dict_data" }

type UserLevel struct {
	ID           int64                        `gorm:"primaryKey;autoIncrement" json:"id"`
	Code         int                          `gorm:"uniqueIndex;not null" json:"code"`
	Label        string                       `gorm:"size:128" json:"label"`
	MinUpload    int64                        `gorm:"default:0" json:"min_upload"`
	MinDownload  int64                        `gorm:"default:0" json:"min_download"`
	MinRatio     float64                      `gorm:"type:decimal(10,3);default:0" json:"min_ratio"`
	MinBonus     float64                      `gorm:"type:decimal(12,2);default:0" json:"min_bonus"`
	MinSeedCount int                          `gorm:"default:0" json:"min_seed_count"`
	Color        string                       `gorm:"size:32" json:"color"`
	Icon         string                       `gorm:"size:64" json:"icon"`
	SortOrder    int                          `gorm:"default:0" json:"sort_order"`
	IsActive     bool                         `gorm:"default:true" json:"is_active"`
	CreatedAt    time.Time                    `gorm:"autoCreateTime" json:"created_at"`
	I18n         map[string]map[string]string `gorm:"-" json:"i18n,omitempty"`
}

func (UserLevel) TableName() string { return "sys_user_level" }
