package seed

import (
	"log"

	"pt-server/internal/model"

	"gorm.io/gorm"
)

func insertUserAchievement(db *gorm.DB, data map[string]any) error {
	userID := resolveUserID(db, data)
	code := intVal(data, "achievement_code")
	if userID == 0 || code == 0 {
		return nil
	}

	var a model.Achievement
	if err := db.Where("code = ?", code).First(&a).Error; err != nil {
		log.Printf("  Achievement code %d not found, skipping", code)
		return nil
	}

	var c int64
	db.Model(&model.UserAchievement{}).Where("user_id = ? AND achievement_id = ?", userID, a.ID).Count(&c)
	if c > 0 {
		log.Printf("  UserAchievement for user %d achievement %d already exists, skipping", userID, a.ID)
		return nil
	}

	ua := model.UserAchievement{
		UserID:        userID,
		AchievementID: a.ID,
	}
	return db.Create(&ua).Error
}

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
