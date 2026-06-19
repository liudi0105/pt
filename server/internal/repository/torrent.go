package repository

import (
	"fmt"
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type TorrentRepo struct {
	db *gorm.DB
}

func NewTorrentRepo(db *gorm.DB) *TorrentRepo {
	return &TorrentRepo{db: db}
}

func (r *TorrentRepo) Create(t *model.Torrent) error {
	return r.db.Create(t).Error
}

func (r *TorrentRepo) GetByID(id int64) (*model.Torrent, error) {
	var t model.Torrent
	err := r.db.Where("is_deleted = ?", false).
		First(&t, id).Error
	if err != nil {
		return nil, err
	}
	// HACK: GORM doesn't support LEFT JOIN single column easily, use raw
	var uploader string
	r.db.Raw(`SELECT COALESCE(u.username, '') FROM users u WHERE u.id = ?`, t.UserID).Scan(&uploader)
	t.Uploader = uploader
	t.InfoHashHex = fmt.Sprintf("%x", t.InfoHash)
	return &t, nil
}

func (r *TorrentRepo) GetByInfoHash(infoHash []byte) (*model.Torrent, error) {
	var t model.Torrent
	err := r.db.Where("info_hash = ? AND is_deleted = ?", infoHash, false).First(&t).Error
	if err != nil {
		return nil, err
	}

	var uploader string
	r.db.Raw(`SELECT COALESCE(u.username, '') FROM users u WHERE u.id = ?`, t.UserID).Scan(&uploader)
	t.Uploader = uploader
	t.InfoHashHex = fmt.Sprintf("%x", t.InfoHash)
	return &t, nil
}

type TorrentFilter struct {
	Category string
	Keyword  string
	Page     int
	PageSize int
}

type TorrentListResult struct {
	Torrents []model.Torrent `json:"torrents"`
	Total    int             `json:"total"`
}

func (r *TorrentRepo) List(f TorrentFilter) (*TorrentListResult, error) {
	if f.Page < 1 {
		f.Page = 1
	}
	if f.PageSize < 1 || f.PageSize > 100 {
		f.PageSize = 50
	}

	query := r.db.Where("is_deleted = ?", false)
	if f.Category != "" {
		query = query.Where("category = ?", f.Category)
	}
	if f.Keyword != "" {
		query = query.Where("name LIKE ?", "%"+f.Keyword+"%")
	}

	var total int64
	query.Model(&model.Torrent{}).Count(&total)

	var torrents []model.Torrent
	err := query.Order("created_at DESC").
		Limit(f.PageSize).
		Offset((f.Page - 1) * f.PageSize).
		Find(&torrents).Error
	if err != nil {
		return nil, err
	}

	// Fetch uploader for each torrent
	for i := range torrents {
		torrents[i].InfoHashHex = fmt.Sprintf("%x", torrents[i].InfoHash)
		type result struct {
			Username string
		}
		var row result
		r.db.Raw("SELECT COALESCE(username, '') as username FROM users WHERE id = ?", torrents[i].UserID).Scan(&row)
		torrents[i].Uploader = row.Username
	}

	return &TorrentListResult{
		Torrents: torrents,
		Total:    int(total),
	}, nil
}

func (r *TorrentRepo) Latest(limit int) ([]model.Torrent, error) {
	if limit < 1 {
		limit = 5
	}
	result, err := r.List(TorrentFilter{Page: 1, PageSize: limit})
	if err != nil {
		return nil, err
	}
	return result.Torrents, nil
}

func (r *TorrentRepo) UpdateStats(id int64, seeders, leechers int) error {
	return r.db.Model(&model.Torrent{}).Where("id = ?", id).Updates(map[string]interface{}{
		"seeders":  seeders,
		"leechers": leechers,
	}).Error
}

func (r *TorrentRepo) UpdatePromotion(id int64, promo model.Promotion) error {
	return r.db.Model(&model.Torrent{}).Where("id = ?", id).Update("promotion", promo).Error
}

func (r *TorrentRepo) IncrementCompleted(id int64) error {
	return r.db.Model(&model.Torrent{}).Where("id = ?", id).
		UpdateColumn("completed", gorm.Expr("completed + 1")).Error
}

func (r *TorrentRepo) UpdateFileName(id int64, filename string) error {
	return r.db.Model(&model.Torrent{}).Where("id = ?", id).Update("file_name", filename).Error
}

func (r *TorrentRepo) Update(t *model.Torrent) error {
	return r.db.Model(&model.Torrent{}).Where("id = ? AND is_deleted = ?", t.ID, false).
		Select("name", "description", "category", "source", "medium", "codec", "standard", "processing", "team", "audiocodec", "small_descr", "technical_info", "cover", "nfo", "tags").Updates(t).Error
}

func (r *TorrentRepo) Delete(id int64) error {
	return r.db.Model(&model.Torrent{}).Where("id = ?", id).
		Update("is_deleted", true).Error
}

func (r *TorrentRepo) BatchUpdatePromotion(filter TorrentFilter, promo model.Promotion) (int64, error) {
	query := r.db.Model(&model.Torrent{}).Where("is_deleted = ?", false)
	if filter.Category != "" {
		query = query.Where("category = ?", filter.Category)
	}
	if filter.Keyword != "" {
		query = query.Where("name LIKE ?", "%"+filter.Keyword+"%")
	}
	result := query.Update("promotion", promo)
	return result.RowsAffected, result.Error
}
