package repository

import (
	"pt-server/internal/config"
	"pt-server/internal/model"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func NewDB(cfg *config.Config) (*gorm.DB, error) {
	var dial gorm.Dialector
	switch cfg.Driver {
	case "postgres":
		dial = postgres.Open(cfg.DSN)
	default:
		dial = sqlite.Open(cfg.DSN)
	}

	db, err := gorm.Open(dial, &gorm.Config{
		SkipDefaultTransaction: true,
	})
	if err != nil {
		return nil, err
	}

	db.AutoMigrate(&model.User{}, &model.Torrent{}, &model.Snatch{}, &model.Bookmark{}, &model.Comment{}, &model.Offer{}, &model.OfferVote{}, &model.Attendance{}, &model.Thanks{}, &model.News{}, &model.Subtitle{}, &model.Message{}, &model.Invite{}, &model.Report{}, &model.Medal{}, &model.UserMedal{}, &model.DictType{}, &model.DictData{}, &model.UserLevel{}, 	&model.RoleModel{}, &model.Permission{}, &model.SiteSetting{})

	return db, nil
}
