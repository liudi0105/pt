package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type RoleRepo struct {
	db *gorm.DB
}

func NewRoleRepo(db *gorm.DB) *RoleRepo {
	return &RoleRepo{db: db}
}

func (r *RoleRepo) List() ([]model.RoleModel, error) {
	var roles []model.RoleModel
	err := r.db.Preload("Permissions").Order("sort_order asc").Find(&roles).Error
	return roles, err
}

func (r *RoleRepo) GetByID(id int64) (*model.RoleModel, error) {
	var role model.RoleModel
	err := r.db.Preload("Permissions").First(&role, id).Error
	return &role, err
}

func (r *RoleRepo) GetByName(name string) (*model.RoleModel, error) {
	var role model.RoleModel
	err := r.db.Where("name = ?", name).Preload("Permissions").First(&role).Error
	return &role, err
}

func (r *RoleRepo) Create(role *model.RoleModel) error {
	return r.db.Create(role).Error
}

func (r *RoleRepo) Update(role *model.RoleModel) error {
	return r.db.Save(role).Error
}

func (r *RoleRepo) Delete(id int64) error {
	return r.db.Delete(&model.RoleModel{}, id).Error
}

func (r *RoleRepo) SetPermissions(roleID int64, permIDs []int64) error {
	var role model.RoleModel
	if err := r.db.First(&role, roleID).Error; err != nil {
		return err
	}
	var perms []model.Permission
	if err := r.db.Find(&perms, permIDs).Error; err != nil {
		return err
	}
	return r.db.Model(&role).Association("Permissions").Replace(&perms)
}
