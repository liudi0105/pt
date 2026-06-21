package seed

import (
	"fmt"
	"log"

	"pt-server/internal/model"

	"gorm.io/gorm"
)

func insertMedal(db *gorm.DB, data map[string]any) error {
	if _, ok := data["code"]; !ok {
		return nil
	}
	code := intVal(data, "code")
	if code < 0 {
		return nil
	}
	var c int64
	db.Model(&model.Medal{}).Where("code = ?", code).Count(&c)
	if c > 0 {
		log.Printf("  Medal '%d' already exists, skipping", code)
		return nil
	}

	m := model.Medal{
		Code:        code,
		Description: strVal(data, "description"),
		Image:       strVal(data, "image"),
		Price:       floatVal(data, "price"),
		IsActive:    boolVal(data, "is_active"),
	}
	if err := db.Create(&m).Error; err != nil {
		return err
	}

	prefix := fmt.Sprintf("medal.%d", code)
	localeFields := []struct{ locale, field, val string }{
		{"zh", "label", strVal(data, "label_zh")},
		{"en", "label", strVal(data, "label_en")},
		{"zh", "description", strVal(data, "description_zh")},
		{"en", "description", strVal(data, "description_en")},
	}
	for _, lf := range localeFields {
		if lf.val != "" {
			saveI18n(db, prefix+"."+lf.field, lf.locale, lf.val)
		}
	}
	return nil
}

func insertUserMedal(db *gorm.DB, data map[string]any) error {
	userID := resolveUserID(db, data)
	medalID := int64Val(data, "medal_id")
	if userID == 0 || medalID == 0 {
		return nil
	}

	var c int64
	db.Model(&model.UserMedal{}).Where("user_id = ? AND medal_id = ?", userID, medalID).Count(&c)
	if c > 0 {
		log.Printf("  UserMedal for user %d medal %d already exists, skipping", userID, medalID)
		return nil
	}

	um := model.UserMedal{
		UserID:  userID,
		MedalID: medalID,
	}
	return db.Create(&um).Error
}
