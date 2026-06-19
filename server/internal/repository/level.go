package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type LevelRepo struct {
	db *gorm.DB
}

func NewLevelRepo(db *gorm.DB) *LevelRepo {
	return &LevelRepo{db: db}
}

func (r *LevelRepo) Create(l *model.UserLevel) error {
	return r.db.Create(l).Error
}

func (r *LevelRepo) GetByID(id int64) (*model.UserLevel, error) {
	var l model.UserLevel
	err := r.db.First(&l, id).Error
	return &l, err
}

func (r *LevelRepo) List() ([]model.UserLevel, error) {
	var levels []model.UserLevel
	err := r.db.Order("sort_order ASC, id ASC").Find(&levels).Error
	return levels, err
}

func (r *LevelRepo) Update(l *model.UserLevel) error {
	return r.db.Save(l).Error
}

func (r *LevelRepo) Delete(id int64) error {
	return r.db.Delete(&model.UserLevel{}, id).Error
}
