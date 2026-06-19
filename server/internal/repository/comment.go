package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type CommentRepo struct {
	db *gorm.DB
}

func NewCommentRepo(db *gorm.DB) *CommentRepo {
	return &CommentRepo{db: db}
}

func (r *CommentRepo) Create(c *model.Comment) error {
	return r.db.Create(c).Error
}

func (r *CommentRepo) GetByID(id int64) (*model.Comment, error) {
	var c model.Comment
	err := r.db.First(&c, id).Error
	return &c, err
}

func (r *CommentRepo) ListByTorrent(torrentID int64, offset, limit int) ([]model.Comment, error) {
	var comments []model.Comment
	err := r.db.Where("torrent_id = ?", torrentID).
		Order("created_at ASC").
		Limit(limit).Offset(offset).
		Find(&comments).Error
	if err != nil {
		return nil, err
	}
	for i := range comments {
		var u model.User
		if err := r.db.Select("username").First(&u, comments[i].UserID).Error; err == nil {
			comments[i].Username = u.Username
		}
	}
	return comments, err
}

func (r *CommentRepo) Delete(id, userID int64) error {
	return r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&model.Comment{}).Error
}

func (r *CommentRepo) CountByTorrent(torrentID int64) (int64, error) {
	var count int64
	err := r.db.Model(&model.Comment{}).Where("torrent_id = ?", torrentID).Count(&count).Error
	return count, err
}
