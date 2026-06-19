package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type MedalRepo struct {
	db *gorm.DB
}

func NewMedalRepo(db *gorm.DB) *MedalRepo {
	return &MedalRepo{db: db}
}

func (r *MedalRepo) Create(m *model.Medal) error {
	return r.db.Create(m).Error
}

func (r *MedalRepo) List() ([]model.Medal, error) {
	var medals []model.Medal
	err := r.db.Order("code ASC, id ASC").Find(&medals).Error
	return medals, err
}

func (r *MedalRepo) GetByID(id int64) (*model.Medal, error) {
	var m model.Medal
	err := r.db.First(&m, id).Error
	return &m, err
}

func (r *MedalRepo) Delete(id int64) error {
	return r.db.Delete(&model.Medal{}, id).Error
}

type UserMedalRepo struct {
	db *gorm.DB
}

func NewUserMedalRepo(db *gorm.DB) *UserMedalRepo {
	return &UserMedalRepo{db: db}
}

func (r *UserMedalRepo) Buy(userID, medalID int64) error {
	return r.db.Create(&model.UserMedal{UserID: userID, MedalID: medalID}).Error
}

func (r *UserMedalRepo) ListByUser(userID int64) ([]model.UserMedal, error) {
	var ums []model.UserMedal
	err := r.db.Where("user_id = ?", userID).Find(&ums).Error
	if err != nil {
		return nil, err
	}
	for i := range ums {
		var m model.Medal
		if err := r.db.Select("code").First(&m, ums[i].MedalID).Error; err == nil {
			ums[i].MedalCode = m.Code
		}
	}
	return ums, err
}

func (r *UserMedalRepo) Exists(userID, medalID int64) (bool, error) {
	var count int64
	err := r.db.Model(&model.UserMedal{}).Where("user_id = ? AND medal_id = ?", userID, medalID).Count(&count).Error
	return count > 0, err
}
