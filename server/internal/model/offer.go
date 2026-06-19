package model

import "time"

type OfferStatus string

const (
	OfferPending OfferStatus = "pending"
	OfferAllowed OfferStatus = "allowed"
	OfferDenied  OfferStatus = "denied"
)

type Offer struct {
	ID          int64       `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID      int64       `gorm:"index;not null" json:"user_id"`
	Name        string      `gorm:"size:255;not null" json:"name"`
	Description string      `gorm:"type:text" json:"description"`
	Category    string      `gorm:"size:32;index" json:"category"`
	Status      OfferStatus `gorm:"type:varchar(16);default:pending" json:"status"`
	VoteYEAH    int         `gorm:"default:0" json:"vote_yeah"`
	VoteAgainst int         `gorm:"default:0" json:"vote_against"`
	CreatedAt   time.Time   `gorm:"autoCreateTime" json:"created_at"`

	Username string `gorm:"-" json:"username"`
}

type OfferVote struct {
	ID        int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    int64     `gorm:"uniqueIndex:idx_offer_user;not null" json:"user_id"`
	OfferID   int64     `gorm:"uniqueIndex:idx_offer_user;not null" json:"offer_id"`
	IsYEAH    bool      `gorm:"not null" json:"is_yeah"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}
