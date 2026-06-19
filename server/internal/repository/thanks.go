package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type ThanksRepo struct {
	db *gorm.DB
}

func NewThanksRepo(db *gorm.DB) *ThanksRepo {
	return &ThanksRepo{db: db}
}

func (r *ThanksRepo) Add(userID, torrentID int64) error {
	return r.db.Create(&model.Thanks{UserID: userID, TorrentID: torrentID}).Error
}

func (r *ThanksRepo) Exists(userID, torrentID int64) (bool, error) {
	var count int64
	err := r.db.Model(&model.Thanks{}).Where("user_id = ? AND torrent_id = ?", userID, torrentID).Count(&count).Error
	return count > 0, err
}

func (r *ThanksRepo) CountByTorrent(torrentID int64) (int64, error) {
	var count int64
	err := r.db.Model(&model.Thanks{}).Where("torrent_id = ?", torrentID).Count(&count).Error
	return count, err
}

func (r *ThanksRepo) ListByUser(userID int64) ([]model.Thanks, error) {
	var thanks []model.Thanks
	err := r.db.Where("user_id = ?", userID).Find(&thanks).Error
	return thanks, err
}
