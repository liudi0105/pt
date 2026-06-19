package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type BonusLogRepo struct {
	db *gorm.DB
}

func NewBonusLogRepo(db *gorm.DB) *BonusLogRepo {
	return &BonusLogRepo{db: db}
}

func (r *BonusLogRepo) Create(l *model.BonusLog) error {
	return r.db.Create(l).Error
}

type BonusLogFilter struct {
	UserID       int64
	BusinessType int
	Page         int
	PageSize     int
}

type BonusLogListResult struct {
	Logs  []model.BonusLog `json:"logs"`
	Total int              `json:"total"`
}

func (r *BonusLogRepo) List(f BonusLogFilter) (*BonusLogListResult, error) {
	if f.Page < 1 {
		f.Page = 1
	}
	if f.PageSize < 1 || f.PageSize > 100 {
		f.PageSize = 20
	}

	query := r.db.Model(&model.BonusLog{})
	if f.UserID > 0 {
		query = query.Where("user_id = ?", f.UserID)
	}
	if f.BusinessType > 0 {
		query = query.Where("business_type = ?", f.BusinessType)
	}

	var total int64
	query.Count(&total)

	var logs []model.BonusLog
	err := query.Order("id DESC").
		Limit(f.PageSize).
		Offset((f.Page - 1) * f.PageSize).
		Find(&logs).Error
	if err != nil {
		return nil, err
	}

	return &BonusLogListResult{Logs: logs, Total: int(total)}, nil
}
