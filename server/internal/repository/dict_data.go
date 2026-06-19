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
	err := r.db.Preload("Type").First(&d, id).Error
	return &d, err
}

func (r *DictDataRepo) ListByType(typeID int64) ([]model.DictData, error) {
	var data []model.DictData
	err := r.db.Where("type_id = ?", typeID).
		Order("sort_order ASC, id ASC").
		Find(&data).Error
	return data, err
}

func (r *DictDataRepo) ListByTypeName(typeName string) ([]model.DictData, error) {
	var data []model.DictData
	err := r.db.Joins("JOIN sys_dict_type ON sys_dict_type.id = sys_dict_data.type_id").
		Where("sys_dict_type.name = ? AND sys_dict_data.is_active = ?", typeName, true).
		Order("sys_dict_data.sort_order ASC, sys_dict_data.id ASC").
		Find(&data).Error
	return data, err
}

func (r *DictDataRepo) Update(d *model.DictData) error {
	return r.db.Save(d).Error
}

func (r *DictDataRepo) Delete(id int64) error {
	return r.db.Delete(&model.DictData{}, id).Error
}
