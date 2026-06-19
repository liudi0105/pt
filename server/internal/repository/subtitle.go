package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type SubtitleRepo struct {
	db *gorm.DB
}

func NewSubtitleRepo(db *gorm.DB) *SubtitleRepo {
	return &SubtitleRepo{db: db}
}

func (r *SubtitleRepo) Create(s *model.Subtitle) error {
	return r.db.Create(s).Error
}

func (r *SubtitleRepo) GetByID(id int64) (*model.Subtitle, error) {
	var s model.Subtitle
	err := r.db.First(&s, id).Error
	return &s, err
}

func (r *SubtitleRepo) ListByTorrent(torrentID int64) ([]model.Subtitle, error) {
	var subs []model.Subtitle
	err := r.db.Where("torrent_id = ?", torrentID).Order("created_at DESC").Find(&subs).Error
	if err != nil {
		return nil, err
	}
	for i := range subs {
		var u model.User
		if err := r.db.Select("username").First(&u, subs[i].UserID).Error; err == nil {
			subs[i].Username = u.Username
		}
	}
	return subs, err
}

func (r *SubtitleRepo) IncrementHits(id int64) error {
	return r.db.Model(&model.Subtitle{}).Where("id = ?", id).
		UpdateColumn("hits", gorm.Expr("hits + 1")).Error
}

func (r *SubtitleRepo) Delete(id int64) error {
	return r.db.Delete(&model.Subtitle{}, id).Error
}
