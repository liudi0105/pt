package model

import "time"

type Message struct {
	ID        int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	SenderID  int64     `gorm:"index;not null" json:"sender_id"`
	ReceiverID int64    `gorm:"index;not null" json:"receiver_id"`
	Subject   string    `gorm:"size:255;not null" json:"subject"`
	Body      string    `gorm:"type:text;not null" json:"body"`
	IsRead    bool      `gorm:"default:false" json:"is_read"`
	IsDeleted bool      `gorm:"default:false" json:"-"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`

	SenderName   string `gorm:"-" json:"sender_name"`
	ReceiverName string `gorm:"-" json:"receiver_name"`
}
