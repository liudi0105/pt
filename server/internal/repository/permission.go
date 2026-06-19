package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type PermissionRepo struct {
	db *gorm.DB
}

func NewPermissionRepo(db *gorm.DB) *PermissionRepo {
	return &PermissionRepo{db: db}
}

func (r *PermissionRepo) List() ([]model.Permission, error) {
	var perms []model.Permission
	err := r.db.Order("group asc, id asc").Find(&perms).Error
	return perms, err
}

func (r *PermissionRepo) GetByID(id int64) (*model.Permission, error) {
	var p model.Permission
	err := r.db.First(&p, id).Error
	return &p, err
}

func (r *PermissionRepo) Create(p *model.Permission) error {
	return r.db.Create(p).Error
}

func (r *PermissionRepo) Delete(id int64) error {
	return r.db.Delete(&model.Permission{}, id).Error
}
