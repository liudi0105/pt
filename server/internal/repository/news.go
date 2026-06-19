package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type NewsRepo struct {
	db *gorm.DB
}

func NewNewsRepo(db *gorm.DB) *NewsRepo {
	return &NewsRepo{db: db}
}

func (r *NewsRepo) Create(n *model.News) error {
	return r.db.Create(n).Error
}

func (r *NewsRepo) List(limit int) ([]model.News, error) {
	var news []model.News
	err := r.db.Order("created_at DESC").Limit(limit).Find(&news).Error
	if err != nil {
		return nil, err
	}
	for i := range news {
		var u model.User
		if err := r.db.Select("username").First(&u, news[i].UserID).Error; err == nil {
			news[i].Username = u.Username
		}
	}
	return news, err
}

func (r *NewsRepo) Delete(id int64) error {
	return r.db.Delete(&model.News{}, id).Error
}
