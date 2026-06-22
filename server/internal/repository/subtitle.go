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

type SubtitleFilter struct {
	Keyword  string
	Language string
	Page     int
	PageSize int
}

func (r *SubtitleRepo) ListAll(f SubtitleFilter) (*model.SubtitleListResult, error) {
	if f.Page < 1 {
		f.Page = 1
	}
	if f.PageSize < 1 || f.PageSize > 100 {
		f.PageSize = 50
	}

	query := r.db.Table("subs s").
		Joins("LEFT JOIN users u ON u.id = s.user_id").
		Joins("LEFT JOIN torrents t ON t.id = s.torrent_id")

	if f.Keyword != "" {
		like := "%" + f.Keyword + "%"
		query = query.Where("s.title LIKE ? OR t.name LIKE ?", like, like)
	}
	if f.Language != "" {
		query = query.Where("s.language = ?", f.Language)
	}

	var total int64
	query.Count(&total)

	var subs []model.Subtitle
	err := query.Select("s.*, COALESCE(u.username, '') as username, COALESCE(t.name, '') as torrent_name").
		Order("s.created_at DESC").
		Limit(f.PageSize).
		Offset((f.Page - 1) * f.PageSize).
		Scan(&subs).Error
	if err != nil {
		return nil, err
	}

	return &model.SubtitleListResult{
		Subtitles: subs,
		Total:     total,
	}, nil
}

func (r *SubtitleRepo) IncrementHits(id int64) error {
	return r.db.Model(&model.Subtitle{}).Where("id = ?", id).
		UpdateColumn("hits", gorm.Expr("hits + 1")).Error
}

func (r *SubtitleRepo) Delete(id int64) error {
	return r.db.Delete(&model.Subtitle{}, id).Error
}
