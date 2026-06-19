package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type DictDataRepo struct {
	db *gorm.DB
}

func NewDictDataRepo(db *gorm.DB) *DictDataRepo {
	return &DictDataRepo{db: db}
}

func (r *DictDataRepo) Create(d *model.DictData) error {
	return r.db.Create(d).Error
}

func (r *DictDataRepo) GetByID(id int64) (*model.DictData, error) {
	var d model.DictData
	err := r.db.First(&d, id).Error
	return &d, err
}

func (r *DictDataRepo) ListByTypeKey(typeKey string) ([]model.DictData, error) {
	var data []model.DictData
	err := r.db.Where("type_key = ?", typeKey).
		Order("sort_order ASC, id ASC").
		Find(&data).Error
	return data, err
}

func (r *DictDataRepo) ListByTypeKeys(typeKeys []string) ([]model.DictData, error) {
	var data []model.DictData
	err := r.db.Where("type_key IN ? AND is_active = ?", typeKeys, true).
		Order("sort_order ASC, id ASC").
		Find(&data).Error
	return data, err
}

func (r *DictDataRepo) UpdateTypeKey(oldKey, newKey string) error {
	return r.db.Model(&model.DictData{}).
		Where("type_key = ?", oldKey).
		Update("type_key", newKey).Error
}

func (r *DictDataRepo) DeleteByTypeKey(typeKey string) error {
	return r.db.Where("type_key = ?", typeKey).Delete(&model.DictData{}).Error
}

func (r *DictDataRepo) Update(d *model.DictData) error {
	return r.db.Save(d).Error
}

func (r *DictDataRepo) Delete(id int64) error {
	return r.db.Delete(&model.DictData{}, id).Error
}
