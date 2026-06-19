package repository

import (
	"time"

	"pt-server/internal/model"

	"gorm.io/gorm"
)

type AttendanceRepo struct {
	db *gorm.DB
}

func NewAttendanceRepo(db *gorm.DB) *AttendanceRepo {
	return &AttendanceRepo{db: db}
}

func (r *AttendanceRepo) GetByUser(userID int64) (*model.Attendance, error) {
	var a model.Attendance
	err := r.db.Where("user_id = ?", userID).First(&a).Error
	return &a, err
}

func (r *AttendanceRepo) Upsert(a *model.Attendance) error {
	return r.db.Where("user_id = ?", a.UserID).Assign(a).FirstOrCreate(a).Error
}

func (r *AttendanceRepo) HasCheckedToday(userID int64) (bool, error) {
	var a model.Attendance
	err := r.db.Where("user_id = ?", userID).First(&a).Error
	if err != nil {
		return false, nil
	}
	today := time.Now().Truncate(24 * time.Hour)
	return a.LastCheckin.After(today) || a.LastCheckin.Equal(today), nil
}
