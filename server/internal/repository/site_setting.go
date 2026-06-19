package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type SiteSettingRepo struct {
	db *gorm.DB
}

func NewSiteSettingRepo(db *gorm.DB) *SiteSettingRepo {
	return &SiteSettingRepo{db: db}
}

func (r *SiteSettingRepo) List() ([]model.SiteSetting, error) {
	var settings []model.SiteSetting
	err := r.db.Order("key asc").Find(&settings).Error
	return settings, err
}

func (r *SiteSettingRepo) GetByKey(key string) (*model.SiteSetting, error) {
	var s model.SiteSetting
	err := r.db.Where("key = ?", key).First(&s).Error
	return &s, err
}

func (r *SiteSettingRepo) Upsert(s *model.SiteSetting) error {
	var existing model.SiteSetting
	result := r.db.Where("key = ?", s.Key).First(&existing)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return r.db.Create(s).Error
		}
		return result.Error
	}
	return r.db.Model(&existing).Updates(map[string]interface{}{
		"value": s.Value,
	}).Error
}
