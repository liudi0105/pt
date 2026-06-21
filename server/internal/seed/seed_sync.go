package seed

import (
	"fmt"

	"pt-server/internal/model"

	"gorm.io/gorm"
)

func SyncI18nFromSeed(db *gorm.DB, entries []Entry) error {
	for _, entry := range entries {
		switch entry.Model {
		case "dict_type":
			if err := syncDictTypeSeed(db, entry.Data); err != nil {
				return err
			}
		case "dict_data":
			if err := syncDictDataSeed(db, entry.Data); err != nil {
				return err
			}
		case "role":
			if err := syncRoleSeed(db, entry.Data); err != nil {
				return err
			}
		case "user_level":
			if err := syncUserLevelSeed(db, entry.Data); err != nil {
				return err
			}
		case "medal":
			if err := syncMedalSeed(db, entry.Data); err != nil {
				return err
			}
		}
	}
	return nil
}

func syncDictTypeSeed(db *gorm.DB, data map[string]any) error {
	key := strVal(data, "key")
	if key == "" {
		return nil
	}

	updates := map[string]any{}
	if v := strVal(data, "label_zh"); v != "" {
		updates["label"] = v
	}
	if v := strVal(data, "remark_zh"); v != "" {
		updates["remark"] = v
	}
	if len(updates) > 0 {
		if err := db.Model(&model.DictType{}).Where("key = ?", key).Updates(updates).Error; err != nil {
			return err
		}
	}

	prefix := "dict_type." + key
	for _, lf := range []struct {
		locale string
		field  string
		val    string
	}{
		{"zh", "label", strVal(data, "label_zh")},
		{"en", "label", strVal(data, "label_en")},
		{"zh", "remark", strVal(data, "remark_zh")},
		{"en", "remark", strVal(data, "remark_en")},
	} {
		if lf.val != "" {
			saveI18n(db, prefix+"."+lf.field, lf.locale, lf.val)
		}
	}
	return nil
}

func syncDictDataSeed(db *gorm.DB, data map[string]any) error {
	typeKey := strVal(data, "type_key")
	key := strVal(data, "key")
	if typeKey == "" || key == "" {
		return nil
	}

	updates := map[string]any{}
	if v := strVal(data, "label_zh"); v != "" {
		updates["label"] = v
	}
	if len(updates) > 0 {
		if err := db.Model(&model.DictData{}).Where("type_key = ? AND key = ?", typeKey, key).Updates(updates).Error; err != nil {
			return err
		}
	}

	prefix := "dict_data." + typeKey + "." + key
	for _, lf := range []struct {
		locale string
		val    string
	}{
		{"zh", strVal(data, "label_zh")},
		{"en", strVal(data, "label_en")},
	} {
		if lf.val != "" {
			saveI18n(db, prefix+".label", lf.locale, lf.val)
		}
	}
	return nil
}

func syncUserLevelSeed(db *gorm.DB, data map[string]any) error {
	if _, ok := data["code"]; !ok {
		return nil
	}
	code := intVal(data, "code")
	if code < 0 {
		return nil
	}

	updates := map[string]any{}
	if v := strVal(data, "label_zh"); v != "" {
		updates["label"] = v
	}
	if len(updates) > 0 {
		if err := db.Model(&model.UserLevel{}).Where("code = ?", code).Updates(updates).Error; err != nil {
			return err
		}
	}

	prefix := fmt.Sprintf("user_level.%d", code)
	for _, lf := range []struct {
		locale string
		val    string
	}{
		{"zh", strVal(data, "label_zh")},
		{"en", strVal(data, "label_en")},
	} {
		if lf.val != "" {
			saveI18n(db, prefix+".label", lf.locale, lf.val)
		}
	}
	return nil
}

func syncRoleSeed(db *gorm.DB, data map[string]any) error {
	key := strVal(data, "key")
	if key == "" {
		return nil
	}

	prefix := "role." + key
	for _, lf := range []struct {
		locale string
		field  string
		val    string
	}{
		{"zh", "display_name", strVal(data, "display_name_zh")},
		{"en", "display_name", strVal(data, "display_name_en")},
		{"zh", "description", strVal(data, "description_zh")},
		{"en", "description", strVal(data, "description_en")},
	} {
		if lf.val != "" {
			saveI18n(db, prefix+"."+lf.field, lf.locale, lf.val)
		}
	}
	return nil
}

func syncMedalSeed(db *gorm.DB, data map[string]any) error {
	if _, ok := data["code"]; !ok {
		return nil
	}
	code := intVal(data, "code")
	if code < 0 {
		return nil
	}

	updates := map[string]any{}
	if v := strVal(data, "description_zh"); v != "" {
		updates["description"] = v
	}
	if len(updates) > 0 {
		if err := db.Model(&model.Medal{}).Where("code = ?", code).Updates(updates).Error; err != nil {
			return err
		}
	}

	prefix := fmt.Sprintf("medal.%d", code)
	for _, lf := range []struct {
		locale string
		field  string
		val    string
	}{
		{"zh", "label", strVal(data, "label_zh")},
		{"en", "label", strVal(data, "label_en")},
		{"zh", "description", strVal(data, "description_zh")},
		{"en", "description", strVal(data, "description_en")},
	} {
		if lf.val != "" {
			saveI18n(db, prefix+"."+lf.field, lf.locale, lf.val)
		}
	}
	return nil
}
