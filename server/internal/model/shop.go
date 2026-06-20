package model

import "time"

type ShopItem struct {
	ID          int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	Name        string    `gorm:"size:255;not null" json:"name"`
	Description string    `gorm:"type:text" json:"description"`
	Price       float64   `gorm:"type:decimal(12,2);not null" json:"price"`
	Stock       int       `gorm:"default:-1" json:"stock"` // -1 = unlimited
	Type        string    `gorm:"size:50;not null;default:'item'" json:"type"`
	Metadata    string    `gorm:"type:text" json:"metadata"`
	SortOrder   int       `gorm:"default:0" json:"sort_order"`
	IsActive    bool      `gorm:"default:true" json:"is_active"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (ShopItem) TableName() string {
	return "shop_items"
}

type UserItem struct {
	ID        int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    int64     `gorm:"index;not null" json:"user_id"`
	ItemID    int64     `gorm:"not null" json:"item_id"`
	Quantity  int       `gorm:"default:1" json:"quantity"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (UserItem) TableName() string {
	return "user_items"
}

type LuckyDrawPrize struct {
	ID          int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	Name        string    `gorm:"size:255;not null" json:"name"`
	Description string    `gorm:"type:text" json:"description"`
	Price       float64   `gorm:"type:decimal(12,2);not null" json:"price"`                // cost per draw
	Probability float64   `gorm:"type:decimal(5,2);not null;default:1" json:"probability"` // percentage
	Stock       int       `gorm:"default:-1" json:"stock"`
	Image       string    `gorm:"size:255" json:"image"`
	IsActive    bool      `gorm:"default:true" json:"is_active"`
	SortOrder   int       `gorm:"default:0" json:"sort_order"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (LuckyDrawPrize) TableName() string {
	return "lucky_draw_prizes"
}

type LuckyDrawRecord struct {
	ID        int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    int64     `gorm:"index;not null" json:"user_id"`
	PrizeID   *int64    `json:"prize_id"` // null for consolation
	PrizeName string    `gorm:"size:255" json:"prize_name"`
	Cost      float64   `gorm:"type:decimal(12,2);not null" json:"cost"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (LuckyDrawRecord) TableName() string {
	return "lucky_draw_records"
}

type GameBet struct {
	ID         int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID     int64     `gorm:"index;not null" json:"user_id"`
	BetAmount  float64   `gorm:"type:decimal(12,2);not null" json:"bet_amount"`
	BetChoice  string    `gorm:"size:10;not null" json:"bet_choice"` // "big" or "small"
	DiceResult int       `gorm:"not null" json:"dice_result"`
	Result     string    `gorm:"size:10;not null" json:"result"` // "win" or "lose"
	Payout     float64   `gorm:"type:decimal(12,2);not null" json:"payout"`
	CreatedAt  time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (GameBet) TableName() string {
	return "game_bets"
}
