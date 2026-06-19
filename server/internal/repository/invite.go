package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type InviteRepo struct {
	db *gorm.DB
}

func NewInviteRepo(db *gorm.DB) *InviteRepo {
	return &InviteRepo{db: db}
}

func (r *InviteRepo) Create(i *model.Invite) error {
	return r.db.Create(i).Error
}

func (r *InviteRepo) GetByCode(code string) (*model.Invite, error) {
	var i model.Invite
	err := r.db.Where("code = ?", code).First(&i).Error
	return &i, err
}

func (r *InviteRepo) ListBySender(senderID int64) ([]model.Invite, error) {
	var invites []model.Invite
	err := r.db.Where("sender_id = ?", senderID).Order("created_at DESC").Find(&invites).Error
	if err != nil {
		return nil, err
	}
	for i := range invites {
		if invites[i].UsedByID != nil {
			var u model.User
			if err := r.db.Select("username").First(&u, *invites[i].UsedByID).Error; err == nil {
				invites[i].UsedByName = u.Username
			}
		}
	}
	return invites, err
}

func (r *InviteRepo) MarkUsed(id int64, usedByID int64) error {
	return r.db.Model(&model.Invite{}).Where("id = ?", id).
		Updates(map[string]interface{}{"is_used": true, "used_by_id": usedByID}).Error
}

func (r *InviteRepo) CountBySender(senderID int64) (int64, error) {
	var count int64
	err := r.db.Model(&model.Invite{}).Where("sender_id = ?", senderID).Count(&count).Error
	return count, err
}
