package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type SnatchRepo struct {
	db *gorm.DB
}

func NewSnatchRepo(db *gorm.DB) *SnatchRepo {
	return &SnatchRepo{db: db}
}

func (r *SnatchRepo) Upsert(s *model.Snatch) error {
	return r.db.Clauses(clause.OnConflict{
		Columns: []clause.Column{{Name: "user_id"}, {Name: "torrent_id"}},
		DoUpdates: clause.AssignmentColumns([]string{
			"uploaded",
			"downloaded",
			"left",
			"ip",
			"port",
			"peer_id",
			"seed_time",
			"leech_time",
			"is_seeding",
			"started_at",
			"last_announce",
			"finished_at",
		}),
	}).Create(s).Error
}

func (r *SnatchRepo) GetByUserAndTorrent(userID, torrentID int64) (*model.Snatch, error) {
	var s model.Snatch
	err := r.db.Where("user_id = ? AND torrent_id = ?", userID, torrentID).First(&s).Error
	return &s, err
}

func (r *SnatchRepo) ListByUser(userID int64, offset, limit int) ([]model.Snatch, error) {
	var snatches []model.Snatch
	err := r.db.Where("user_id = ?", userID).
		Order("last_announce DESC").
		Limit(limit).Offset(offset).
		Find(&snatches).Error
	return snatches, err
}

func (r *SnatchRepo) ListSeeding(userID int64, offset, limit int) ([]model.Snatch, error) {
	var snatches []model.Snatch
	err := r.db.Where("user_id = ? AND is_seeding = ?", userID, true).
		Order("last_announce DESC").
		Limit(limit).Offset(offset).
		Find(&snatches).Error
	return snatches, err
}

func (r *SnatchRepo) CountByUser(userID int64) (total int64, seeding int64, err error) {
	err = r.db.Model(&model.Snatch{}).Where("user_id = ?", userID).Count(&total).Error
	if err != nil {
		return
	}
	err = r.db.Model(&model.Snatch{}).Where("user_id = ? AND is_seeding = ?", userID, true).Count(&seeding).Error
	return
}

func (r *SnatchRepo) ListByTorrentID(torrentID int64) ([]model.Snatch, error) {
	var snatches []model.Snatch
	err := r.db.Where("torrent_id = ?", torrentID).Order("uploaded DESC").Limit(100).Find(&snatches).Error
	return snatches, err
}

func (r *SnatchRepo) ListHR(userID int64, offset, limit int) ([]model.Snatch, error) {
	var snatches []model.Snatch
	err := r.db.Where("user_id = ? AND is_hr = ?", userID, true).
		Order("last_announce DESC").Limit(limit).Offset(offset).Find(&snatches).Error
	return snatches, err
}

func (r *SnatchRepo) CountHR(userID int64) (int64, error) {
	var count int64
	err := r.db.Model(&model.Snatch{}).Where("user_id = ? AND is_hr = ?", userID, true).Count(&count).Error
	return count, err
}
