package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type AchievementRepo struct {
	db *gorm.DB
}

func NewAchievementRepo(db *gorm.DB) *AchievementRepo {
	return &AchievementRepo{db: db}
}

func (r *AchievementRepo) Create(m *model.Achievement) error {
	return r.db.Create(m).Error
}

func (r *AchievementRepo) List() ([]model.Achievement, error) {
	var list []model.Achievement
	err := r.db.Order("code ASC, id ASC").Find(&list).Error
	return list, err
}

func (r *AchievementRepo) ListActive() ([]model.Achievement, error) {
	var list []model.Achievement
	err := r.db.Where("is_active = ?", true).Order("code ASC, id ASC").Find(&list).Error
	return list, err
}

func (r *AchievementRepo) GetByID(id int64) (*model.Achievement, error) {
	var m model.Achievement
	err := r.db.First(&m, id).Error
	return &m, err
}

func (r *AchievementRepo) Update(m *model.Achievement) error {
	return r.db.Save(m).Error
}

func (r *AchievementRepo) Delete(id int64) error {
	return r.db.Delete(&model.Achievement{}, id).Error
}

type UserAchievementRepo struct {
	db *gorm.DB
}

func NewUserAchievementRepo(db *gorm.DB) *UserAchievementRepo {
	return &UserAchievementRepo{db: db}
}

func (r *UserAchievementRepo) Grant(userID, achievementID int64) error {
	return r.db.Create(&model.UserAchievement{
		UserID:        userID,
		AchievementID: achievementID,
	}).Error
}

func (r *UserAchievementRepo) ListByUser(userID int64) ([]model.UserAchievement, error) {
	var list []model.UserAchievement
	err := r.db.Where("user_id = ?", userID).Order("unlocked_at DESC").Find(&list).Error
	if err != nil {
		return nil, err
	}
	for i := range list {
		var a model.Achievement
		if err := r.db.Select("code").First(&a, list[i].AchievementID).Error; err == nil {
			list[i].AchievementCode = a.Code
		}
	}
	return list, err
}

func (r *UserAchievementRepo) Exists(userID, achievementID int64) (bool, error) {
	var count int64
	err := r.db.Model(&model.UserAchievement{}).
		Where("user_id = ? AND achievement_id = ?", userID, achievementID).
		Count(&count).Error
	return count > 0, err
}

func (r *UserAchievementRepo) CountByUser(userID int64) (int64, error) {
	var count int64
	err := r.db.Model(&model.UserAchievement{}).
		Where("user_id = ?", userID).
		Count(&count).Error
	return count, err
}
