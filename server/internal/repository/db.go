package repository

import (
	"pt-server/internal/config"

	"github.com/glebarez/sqlite"
	"gorm.io/driver/postgres"
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

	return db, nil
}
