package seed

import (
	"log"

	"pt-server/internal/model"

	"gorm.io/gorm"
)

func insertOffer(db *gorm.DB, data map[string]any) error {
	name := strVal(data, "name")
	if name == "" {
		return nil
	}
	var c int64
	db.Model(&model.Offer{}).Where("name = ?", name).Count(&c)
	if c > 0 {
		log.Printf("  Offer '%s' already exists, skipping", name)
		return nil
	}

	userID := resolveUserID(db, data)

	o := model.Offer{
		UserID:      userID,
		Name:        name,
		Description: strVal(data, "description"),
		Category:    strVal(data, "category"),
		Status:      model.OfferStatus(strVal(data, "status")),
		VoteYEAH:    intVal(data, "vote_yeah"),
		VoteAgainst: intVal(data, "vote_against"),
	}
	return db.Create(&o).Error
}
