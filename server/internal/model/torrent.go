package model

import "time"

type Promotion string

const (
	PromoNone      Promotion = "none"
	PromoFree      Promotion = "free"
	PromoTwoUp     Promotion = "twoup"
	PromoFreeTwoUp Promotion = "free_twoup"
	PromoThirtyPct Promotion = "thirty_percent"
)

type Torrent struct {
	ID            int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID        int64     `gorm:"index;not null" json:"user_id"`
	InfoHash      []byte    `gorm:"type:bytea;uniqueIndex;not null" json:"-"`
	InfoHashHex   string    `gorm:"-" json:"info_hash"`
	Name          string    `gorm:"size:255;not null" json:"name"`
	Description   string    `gorm:"type:text" json:"description"`
	FileName      string    `gorm:"size:255;default:''" json:"-"`
	Size          int64     `gorm:"default:0" json:"size"`
	FileCount     int       `gorm:"default:0" json:"file_count"`
	Category      string    `gorm:"size:32;index;default:''" json:"category"`
	Source        string    `gorm:"type:text;default:''" json:"source"`
	Medium        string    `gorm:"type:text;default:''" json:"medium"`
	Codec         string    `gorm:"type:text;default:''" json:"codec"`
	Standard      string    `gorm:"type:text;default:''" json:"standard"`
	Processing    string    `gorm:"type:text;default:''" json:"processing"`
	Team          string    `gorm:"type:text;default:''" json:"team"`
	AudioCodec    string    `gorm:"type:text;default:''" json:"audiocodec"`
	SmallDescr    string    `gorm:"type:text" json:"small_descr"`
	TechnicalInfo string    `gorm:"type:text" json:"technical_info"`
	Cover         string    `gorm:"type:text" json:"cover"`
	NFO           string    `gorm:"type:text" json:"nfo"`
	Tags          string    `gorm:"type:text;default:''" json:"tags"`
	Promotion     Promotion `gorm:"type:varchar(16);default:none;index" json:"promotion"`
	SeedHours     int       `gorm:"default:0" json:"seed_hours"`
	Seeders       int       `gorm:"default:0" json:"seeders"`
	Leechers      int       `gorm:"default:0" json:"leechers"`
	Completed     int       `gorm:"default:0" json:"completed"`
	CreatedAt     time.Time `gorm:"autoCreateTime;index" json:"created_at"`
	IsDeleted     bool      `gorm:"default:false" json:"-"`
	Uploader      string    `gorm:"-" json:"uploader"`
}
