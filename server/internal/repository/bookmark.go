package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type BookmarkRepo struct {
	db *gorm.DB
}

func NewBookmarkRepo(db *gorm.DB) *BookmarkRepo {
	return &BookmarkRepo{db: db}
}

func (r *BookmarkRepo) Add(userID, torrentID int64) error {
	return r.db.Create(&model.Bookmark{UserID: userID, TorrentID: torrentID}).Error
}

func (r *BookmarkRepo) Remove(userID, torrentID int64) error {
	return r.db.Where("user_id = ? AND torrent_id = ?", userID, torrentID).Delete(&model.Bookmark{}).Error
}

func (r *BookmarkRepo) Exists(userID, torrentID int64) (bool, error) {
	var count int64
	err := r.db.Model(&model.Bookmark{}).Where("user_id = ? AND torrent_id = ?", userID, torrentID).Count(&count).Error
	return count > 0, err
}

func (r *BookmarkRepo) ListByUser(userID int64, offset, limit int) ([]model.Bookmark, error) {
	var bks []model.Bookmark
	err := r.db.Where("user_id = ?", userID).Order("created_at DESC").Limit(limit).Offset(offset).Find(&bks).Error
	return bks, err
}
