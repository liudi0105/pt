package seed

import (
	"log"

	"pt-server/internal/model"

	"gorm.io/gorm"
)

func insertAchievement(db *gorm.DB, data map[string]any) error {
	if _, ok := data["code"]; !ok {
		return nil
	}
	code := intVal(data, "code")
	if code < 0 {
		return nil
	}
	var c int64
	db.Model(&model.Achievement{}).Where("code = ?", code).Count(&c)
	if c > 0 {
		log.Printf("  Achievement '%d' already exists, skipping", code)
		return nil
	}

	a := model.Achievement{
		Code:        code,
		Name:        strVal(data, "name"),
		Description: strVal(data, "description"),
		Icon:        strVal(data, "icon"),
		Group:       strVal(data, "group"),
		Condition:   strVal(data, "condition"),
		IsActive:    boolVal(data, "is_active"),
	}
	return db.Create(&a).Error
}
