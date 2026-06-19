package model

import "time"

type ReportStatus string

const (
	ReportPending  ReportStatus = "pending"
	ReportResolved ReportStatus = "resolved"
	ReportDismissed ReportStatus = "dismissed"
)

type Report struct {
	ID         int64        `gorm:"primaryKey;autoIncrement" json:"id"`
	ReporterID int64        `gorm:"index;not null" json:"reporter_id"`
	TargetType string       `gorm:"size:32;not null" json:"target_type"`
	TargetID   int64        `gorm:"not null" json:"target_id"`
	Reason     string       `gorm:"type:text;not null" json:"reason"`
	Status     ReportStatus `gorm:"type:varchar(16);default:pending" json:"status"`
	CreatedAt  time.Time    `gorm:"autoCreateTime" json:"created_at"`

	ReporterName string `gorm:"-" json:"reporter_name"`
}
