package model

import "time"

const (
	BonusTypeHarvest  = 1  // 做种收获
	BonusTypeExchange = 2  // 积分兑换
	BonusTypeReward   = 3  // 奖励发放
	BonusTypePenalty  = 4  // 违规扣减
	BonusTypeTransfer = 5  // 积分转账
	BonusTypeAdmin    = 99 // 管理员调整
)

type BonusLog struct {
	ID            int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID        int64     `gorm:"index;not null" json:"user_id"`
	BusinessType  int       `gorm:"not null;default:0" json:"business_type"`
	OldTotalValue float64   `gorm:"type:decimal(20,1)" json:"old_total_value"`
	Value         float64   `gorm:"type:decimal(20,1)" json:"value"`
	NewTotalValue float64   `gorm:"type:decimal(20,1)" json:"new_total_value"`
	Comment       string    `gorm:"type:text" json:"comment"`
	CreatedAt     time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (BonusLog) TableName() string {
	return "bonus_logs"
}
