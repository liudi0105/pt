package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type ReportRepo struct {
	db *gorm.DB
}

func NewReportRepo(db *gorm.DB) *ReportRepo {
	return &ReportRepo{db: db}
}

func (r *ReportRepo) Create(report *model.Report) error {
	return r.db.Create(report).Error
}

func (r *ReportRepo) List(page, pageSize int) ([]model.Report, int64, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	var total int64
	r.db.Model(&model.Report{}).Count(&total)

	var reports []model.Report
	err := r.db.Order("created_at DESC").Limit(pageSize).Offset((page - 1) * pageSize).Find(&reports).Error
	if err != nil {
		return nil, 0, err
	}
	for i := range reports {
		var u model.User
		if err := r.db.Select("username").First(&u, reports[i].ReporterID).Error; err == nil {
			reports[i].ReporterName = u.Username
		}
	}
	return reports, total, nil
}

func (r *ReportRepo) UpdateStatus(id int64, status model.ReportStatus) error {
	return r.db.Model(&model.Report{}).Where("id = ?", id).Update("status", status).Error
}
