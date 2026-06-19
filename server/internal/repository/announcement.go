package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type AnnouncementRepo struct {
	db *gorm.DB
}

func NewAnnouncementRepo(db *gorm.DB) *AnnouncementRepo {
	return &AnnouncementRepo{db: db}
}

func (r *AnnouncementRepo) Create(a *model.Announcement) error {
	return r.db.Create(a).Error
}

func (r *AnnouncementRepo) GetByID(id int64) (*model.Announcement, error) {
	var a model.Announcement
	err := r.db.First(&a, id).Error
	return &a, err
}

func (r *AnnouncementRepo) List() ([]model.Announcement, error) {
	var list []model.Announcement
	err := r.db.Order("is_sticky DESC, created_at DESC").Find(&list).Error
	return list, err
}

func (r *AnnouncementRepo) ListActive() ([]model.Announcement, error) {
	var list []model.Announcement
	err := r.db.Where("is_active = ? AND (expires_at IS NULL OR expires_at > datetime('now'))", true).
		Order("is_sticky DESC, created_at DESC").Find(&list).Error
	return list, err
}

func (r *AnnouncementRepo) Update(a *model.Announcement) error {
	return r.db.Save(a).Error
}

func (r *AnnouncementRepo) Delete(id int64) error {
	return r.db.Delete(&model.Announcement{}, id).Error
}
