package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type LuckyDrawPrizeRepo struct {
	db *gorm.DB
}

func NewLuckyDrawPrizeRepo(db *gorm.DB) *LuckyDrawPrizeRepo {
	return &LuckyDrawPrizeRepo{db: db}
}

func (r *LuckyDrawPrizeRepo) ListActive() ([]model.LuckyDrawPrize, error) {
	var prizes []model.LuckyDrawPrize
	err := r.db.Where("is_active = ?", true).Order("sort_order ASC, id ASC").Find(&prizes).Error
	return prizes, err
}

func (r *LuckyDrawPrizeRepo) GetByID(id int64) (*model.LuckyDrawPrize, error) {
	var p model.LuckyDrawPrize
	err := r.db.First(&p, id).Error
	return &p, err
}

func (r *LuckyDrawPrizeRepo) DecrementStock(id int64) error {
	return r.db.Model(&model.LuckyDrawPrize{}).Where("id = ? AND stock > 0", id).
		UpdateColumn("stock", gorm.Expr("stock - 1")).Error
}

// Admin
func (r *LuckyDrawPrizeRepo) AdminList() ([]model.LuckyDrawPrize, error) {
	var prizes []model.LuckyDrawPrize
	err := r.db.Order("sort_order ASC, id ASC").Find(&prizes).Error
	return prizes, err
}

func (r *LuckyDrawPrizeRepo) Create(p *model.LuckyDrawPrize) error {
	return r.db.Create(p).Error
}

func (r *LuckyDrawPrizeRepo) Update(p *model.LuckyDrawPrize) error {
	return r.db.Save(p).Error
}

func (r *LuckyDrawPrizeRepo) Delete(id int64) error {
	return r.db.Delete(&model.LuckyDrawPrize{}, id).Error
}

type LuckyDrawRecordRepo struct {
	db *gorm.DB
}

func NewLuckyDrawRecordRepo(db *gorm.DB) *LuckyDrawRecordRepo {
	return &LuckyDrawRecordRepo{db: db}
}

func (r *LuckyDrawRecordRepo) Create(rec *model.LuckyDrawRecord) error {
	return r.db.Create(rec).Error
}

func (r *LuckyDrawRecordRepo) ListByUser(userID int64, page, pageSize int) ([]model.LuckyDrawRecord, int64, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}
	var total int64
	query := r.db.Model(&model.LuckyDrawRecord{}).Where("user_id = ?", userID)
	query.Count(&total)
	var recs []model.LuckyDrawRecord
	err := query.Order("id DESC").Limit(pageSize).Offset((page - 1) * pageSize).Find(&recs).Error
	return recs, total, err
}

type GameBetRepo struct {
	db *gorm.DB
}

func NewGameBetRepo(db *gorm.DB) *GameBetRepo {
	return &GameBetRepo{db: db}
}

func (r *GameBetRepo) Create(bet *model.GameBet) error {
	return r.db.Create(bet).Error
}

func (r *GameBetRepo) ListByUser(userID int64, page, pageSize int) ([]model.GameBet, int64, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}
	var total int64
	query := r.db.Model(&model.GameBet{}).Where("user_id = ?", userID)
	query.Count(&total)
	var bets []model.GameBet
	err := query.Order("id DESC").Limit(pageSize).Offset((page - 1) * pageSize).Find(&bets).Error
	return bets, total, err
}
