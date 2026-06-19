package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type MessageRepo struct {
	db *gorm.DB
}

func NewMessageRepo(db *gorm.DB) *MessageRepo {
	return &MessageRepo{db: db}
}

func (r *MessageRepo) Create(m *model.Message) error {
	return r.db.Create(m).Error
}

func (r *MessageRepo) GetByID(id int64) (*model.Message, error) {
	var m model.Message
	err := r.db.First(&m, id).Error
	return &m, err
}

func (r *MessageRepo) ListInbox(userID int64, offset, limit int) ([]model.Message, error) {
	var msgs []model.Message
	err := r.db.Where("receiver_id = ? AND is_deleted = ?", userID, false).
		Order("created_at DESC").Limit(limit).Offset(offset).Find(&msgs).Error
	if err != nil {
		return nil, err
	}
	for i := range msgs {
		var u model.User
		if err := r.db.Select("username").First(&u, msgs[i].SenderID).Error; err == nil {
			msgs[i].SenderName = u.Username
		}
	}
	return msgs, err
}

func (r *MessageRepo) ListOutbox(userID int64, offset, limit int) ([]model.Message, error) {
	var msgs []model.Message
	err := r.db.Where("sender_id = ? AND is_deleted = ?", userID, false).
		Order("created_at DESC").Limit(limit).Offset(offset).Find(&msgs).Error
	if err != nil {
		return nil, err
	}
	for i := range msgs {
		var u model.User
		if err := r.db.Select("username").First(&u, msgs[i].ReceiverID).Error; err == nil {
			msgs[i].ReceiverName = u.Username
		}
	}
	return msgs, err
}

func (r *MessageRepo) MarkRead(id, userID int64) error {
	return r.db.Model(&model.Message{}).Where("id = ? AND receiver_id = ?", id, userID).
		Update("is_read", true).Error
}

func (r *MessageRepo) CountUnread(userID int64) (int64, error) {
	var count int64
	err := r.db.Model(&model.Message{}).Where("receiver_id = ? AND is_read = ? AND is_deleted = ?", userID, false, false).Count(&count).Error
	return count, err
}

func (r *MessageRepo) DeleteForUser(id, userID int64) error {
	return r.db.Model(&model.Message{}).Where("id = ? AND (sender_id = ? OR receiver_id = ?)", id, userID, userID).
		Update("is_deleted", true).Error
}
