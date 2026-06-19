package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type DictTypeRepo struct {
	db *gorm.DB
}

func NewDictTypeRepo(db *gorm.DB) *DictTypeRepo {
	return &DictTypeRepo{db: db}
}

func (r *DictTypeRepo) Create(t *model.DictType) error {
	return r.db.Create(t).Error
}

func (r *DictTypeRepo) GetByID(id int64) (*model.DictType, error) {
	var t model.DictType
	err := r.db.First(&t, id).Error
	return &t, err
}

func (r *DictTypeRepo) GetByKey(key string) (*model.DictType, error) {
	var t model.DictType
	err := r.db.Where("key = ?", key).First(&t).Error
	return &t, err
}

func (r *DictTypeRepo) List() ([]model.DictType, error) {
	var types []model.DictType
	err := r.db.Order("sort_order ASC, id ASC").Find(&types).Error
	return types, err
}

func (r *DictTypeRepo) Update(t *model.DictType) error {
	return r.db.Save(t).Error
}

func (r *DictTypeRepo) Delete(id int64) error {
	return r.db.Delete(&model.DictType{}, id).Error
}
