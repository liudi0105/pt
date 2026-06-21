package seed

import (
	"fmt"
	"log"

	"pt-server/internal/model"

	"gorm.io/gorm"
)

func insertPermissionsBatch(db *gorm.DB, entries []Entry) {
	if len(entries) == 0 {
		return
	}
	type permSeed struct {
		item model.Permission
	}
	seeds := make([]permSeed, 0, len(entries))
	codes := make([]string, 0, len(entries))
	for _, entry := range entries {
		code := strVal(entry.Data, "code")
		if code == "" {
			continue
		}
		seeds = append(seeds, permSeed{item: model.Permission{
			Code:        code,
			Name:        strVal(entry.Data, "name"),
			Group:       strVal(entry.Data, "group"),
			Description: strVal(entry.Data, "description"),
		}})
		codes = append(codes, code)
	}
	if len(seeds) == 0 {
		return
	}
	existing, err := existingStrings(db, "permissions", "code", codes)
	if err != nil {
		log.Printf("Warning: %v", err)
		return
	}
	toInsert := make([]model.Permission, 0, len(seeds))
	for _, seed := range seeds {
		if _, ok := existing[seed.item.Code]; ok {
			log.Printf("  Permission '%s' already exists, skipping", seed.item.Code)
			continue
		}
		toInsert = append(toInsert, seed.item)
	}
	if len(toInsert) == 0 {
		return
	}
	if err := db.CreateInBatches(&toInsert, seedBatchSize).Error; err != nil {
		log.Printf("Warning: %v", err)
	}
}

func insertSiteSettingsBatch(db *gorm.DB, entries []Entry) {
	if len(entries) == 0 {
		return
	}
	type settingSeed struct {
		item model.SiteSetting
	}
	seeds := make([]settingSeed, 0, len(entries))
	keys := make([]string, 0, len(entries))
	for _, entry := range entries {
		key := strVal(entry.Data, "key")
		if key == "" {
			continue
		}
		item := model.SiteSetting{
			Key:         key,
			Value:       strVal(entry.Data, "value"),
			Type:        strVal(entry.Data, "type"),
			Description: strVal(entry.Data, "description"),
			IsActive:    boolVal(entry.Data, "is_active"),
		}
		if item.Type == "" {
			item.Type = "string"
		}
		seeds = append(seeds, settingSeed{item: item})
		keys = append(keys, key)
	}
	if len(seeds) == 0 {
		return
	}
	existing, err := existingStrings(db, "site_settings", "key", keys)
	if err != nil {
		log.Printf("Warning: %v", err)
		return
	}
	toInsert := make([]model.SiteSetting, 0, len(seeds))
	for _, seed := range seeds {
		if _, ok := existing[seed.item.Key]; ok {
			log.Printf("  SiteSetting '%s' already exists, skipping", seed.item.Key)
			continue
		}
		toInsert = append(toInsert, seed.item)
	}
	if len(toInsert) == 0 {
		return
	}
	if err := db.CreateInBatches(&toInsert, seedBatchSize).Error; err != nil {
		log.Printf("Warning: %v", err)
	}
}

func insertUserLevelsBatch(db *gorm.DB, entries []Entry) {
	if len(entries) == 0 {
		return
	}
	type levelSeed struct {
		item model.UserLevel
	}
	seeds := make([]levelSeed, 0, len(entries))
	codes := make([]int, 0, len(entries))
	for _, entry := range entries {
		if _, ok := entry.Data["code"]; !ok {
			continue
		}
		code := intVal(entry.Data, "code")
		if code < 0 {
			continue
		}
		seeds = append(seeds, levelSeed{item: model.UserLevel{
			Code:         code,
			Label:        strVal(entry.Data, "label_zh"),
			MinUpload:    int64Val(entry.Data, "min_upload"),
			MinDownload:  int64Val(entry.Data, "min_download"),
			MinRatio:     floatVal(entry.Data, "min_ratio"),
			MinBonus:     floatVal(entry.Data, "min_bonus"),
			MinSeedCount: intVal(entry.Data, "min_seed_count"),
			Color:        strVal(entry.Data, "color"),
			Icon:         strVal(entry.Data, "icon"),
			SortOrder:    intVal(entry.Data, "sort_order"),
			IsActive:     boolVal(entry.Data, "is_active"),
		}})
		codes = append(codes, code)
	}
	if len(seeds) == 0 {
		return
	}
	existing, err := existingUserLevelCodes(db, codes)
	if err != nil {
		log.Printf("Warning: %v", err)
		return
	}
	toInsert := make([]model.UserLevel, 0, len(seeds))
	for _, seed := range seeds {
		if _, ok := existing[seed.item.Code]; ok {
			log.Printf("  UserLevel '%d' already exists, skipping", seed.item.Code)
			continue
		}
		toInsert = append(toInsert, seed.item)
	}
	if len(toInsert) == 0 {
		return
	}
	if err := db.CreateInBatches(&toInsert, seedBatchSize).Error; err != nil {
		log.Printf("Warning: %v", err)
	}
}

func insertRolesBatch(db *gorm.DB, entries []Entry) {
	if len(entries) == 0 {
		return
	}
	type roleSeed struct {
		item  model.RoleModel
		perms []string
	}
	seeds := make([]roleSeed, 0, len(entries))
	names := make([]string, 0, len(entries))
	for _, entry := range entries {
		key := strVal(entry.Data, "key")
		if key == "" {
			continue
		}
		perms := []string{}
		if raw, ok := entry.Data["permissions"].([]any); ok {
			perms = make([]string, 0, len(raw))
			for _, p := range raw {
				if code, ok := p.(string); ok && code != "" {
					perms = append(perms, code)
				}
			}
		}
		seeds = append(seeds, roleSeed{
			item: model.RoleModel{
				Key:         key,
				DisplayName: strVal(entry.Data, "display_name"),
				Description: strVal(entry.Data, "description"),
				IsSystem:    boolVal(entry.Data, "is_system"),
				SortOrder:   intVal(entry.Data, "sort_order"),
			},
			perms: perms,
		})
		names = append(names, key)
	}
	if len(seeds) == 0 {
		return
	}
	existing, err := existingStrings(db, "role_models", "key", names)
	if err != nil {
		log.Printf("Warning: %v", err)
		return
	}
	toInsert := make([]model.RoleModel, 0, len(seeds))
	remaining := make([]roleSeed, 0, len(seeds))
	for _, seed := range seeds {
		if _, ok := existing[seed.item.Key]; ok {
			log.Printf("  Role '%s' already exists, skipping", seed.item.Key)
			continue
		}
		toInsert = append(toInsert, seed.item)
		remaining = append(remaining, seed)
	}
	if len(toInsert) == 0 {
		return
	}
	if err := db.CreateInBatches(&toInsert, seedBatchSize).Error; err != nil {
		log.Printf("Warning: %v", err)
		return
	}
	insertedByName := make(map[string]model.RoleModel, len(toInsert))
	for _, role := range toInsert {
		insertedByName[role.Key] = role
	}

	permCodes := make(map[string]struct{})
	for _, seed := range remaining {
		for _, code := range seed.perms {
			permCodes[code] = struct{}{}
		}
	}
	codes := make([]string, 0, len(permCodes))
	for code := range permCodes {
		codes = append(codes, code)
	}
	var perms []model.Permission
	if len(codes) > 0 {
		if err := db.Where("code IN ?", codes).Find(&perms).Error; err != nil {
			log.Printf("Warning: %v", err)
			return
		}
	}
	permByCode := make(map[string]model.Permission, len(perms))
	for _, perm := range perms {
		permByCode[perm.Code] = perm
	}
	for _, seed := range remaining {
		if len(seed.perms) == 0 {
			continue
		}
		var matched []model.Permission
		for _, code := range seed.perms {
			if perm, ok := permByCode[code]; ok {
				matched = append(matched, perm)
			} else {
				log.Printf("  Permission '%s' not found, skipping", code)
			}
		}
		if len(matched) > 0 {
			role, ok := insertedByName[seed.item.Key]
			if !ok {
				continue
			}
			if err := db.Model(&role).Association("Permissions").Replace(&matched); err != nil {
				log.Printf("Warning: %v", err)
			}
		}
	}
}

func insertDictTypes(db *gorm.DB, entries []Entry) {
	if len(entries) == 0 {
		return
	}
	seeds := make([]dictTypeSeed, 0, len(entries))
	keys := make([]string, 0, len(entries))
	for _, entry := range entries {
		key := strVal(entry.Data, "key")
		if key == "" {
			continue
		}
		seeds = append(seeds, dictTypeSeed{
			item: model.DictType{
				Key:       key,
				Label:     strVal(entry.Data, "label_zh"),
				Remark:    strVal(entry.Data, "remark_zh"),
				SortOrder: intVal(entry.Data, "sort_order"),
				IsSystem:  boolVal(entry.Data, "is_system"),
				IsActive:  boolVal(entry.Data, "is_active"),
			},
			i18n: map[string]map[string]string{
				"zh": {
					"label":  strVal(entry.Data, "label_zh"),
					"remark": strVal(entry.Data, "remark_zh"),
				},
				"en": {
					"label":  strVal(entry.Data, "label_en"),
					"remark": strVal(entry.Data, "remark_en"),
				},
			},
		})
		keys = append(keys, key)
	}
	if len(seeds) == 0 {
		return
	}

	existing, err := existingKeys(db, "sys_dict_type", keys, "key")
	if err != nil {
		log.Printf("Warning: %v", err)
		return
	}

	toInsert := make([]model.DictType, 0, len(seeds))
	remaining := make([]dictTypeSeed, 0, len(seeds))
	for _, seed := range seeds {
		if _, ok := existing[seed.item.Key]; ok {
			log.Printf("  DictType '%s' already exists, skipping", seed.item.Key)
			continue
		}
		toInsert = append(toInsert, seed.item)
		remaining = append(remaining, seed)
	}
	if len(toInsert) == 0 {
		return
	}
	if err := db.CreateInBatches(&toInsert, seedBatchSize).Error; err != nil {
		log.Printf("Warning: %v", err)
		return
	}
	for _, seed := range remaining {
		prefix := "dict_type." + seed.item.Key
		for _, lf := range []struct {
			locale string
			field  string
			val    string
		}{
			{"zh", "label", seed.i18n["zh"]["label"]},
			{"en", "label", seed.i18n["en"]["label"]},
			{"zh", "remark", seed.i18n["zh"]["remark"]},
			{"en", "remark", seed.i18n["en"]["remark"]},
		} {
			if lf.val != "" {
				saveI18n(db, prefix+"."+lf.field, lf.locale, lf.val)
			}
		}
	}
}

func insertDictDataBatch(db *gorm.DB, entries []Entry) {
	if len(entries) == 0 {
		return
	}
	var typeKeys []string
	seeds := make([]dictDataSeed, 0, len(entries))
	for _, entry := range entries {
		typeKey := strVal(entry.Data, "type_key")
		key := strVal(entry.Data, "key")
		if typeKey == "" || key == "" {
			continue
		}
		seeds = append(seeds, dictDataSeed{
			item: model.DictData{
				TypeKey:   typeKey,
				Key:       key,
				Value:     strVal(entry.Data, "value"),
				Label:     strVal(entry.Data, "label_zh"),
				SortOrder: intVal(entry.Data, "sort_order"),
				IsDefault: boolVal(entry.Data, "is_default"),
				IsActive:  boolVal(entry.Data, "is_active"),
			},
			i18n: map[string]map[string]string{
				"zh": {"label": strVal(entry.Data, "label_zh")},
				"en": {"label": strVal(entry.Data, "label_en")},
			},
		})
		typeKeys = append(typeKeys, typeKey)
	}
	if len(seeds) == 0 {
		return
	}

	typeSet := make(map[string]struct{}, len(typeKeys))
	for _, typeKey := range typeKeys {
		typeSet[typeKey] = struct{}{}
	}
	uniqueTypeKeys := make([]string, 0, len(typeSet))
	for typeKey := range typeSet {
		uniqueTypeKeys = append(uniqueTypeKeys, typeKey)
	}

	existingTypes, err := existingKeys(db, "sys_dict_type", uniqueTypeKeys, "key")
	if err != nil {
		log.Printf("Warning: %v", err)
		return
	}
	existingPairs, err := existingDictDataPairs(db, uniqueTypeKeys)
	if err != nil {
		log.Printf("Warning: %v", err)
		return
	}

	toInsert := make([]model.DictData, 0, len(seeds))
	remaining := make([]dictDataSeed, 0, len(seeds))
	for _, seed := range seeds {
		if _, ok := existingTypes[seed.item.TypeKey]; !ok {
			log.Printf("  DictType '%s' not found, skipping DictData '%s/%s'", seed.item.TypeKey, seed.item.TypeKey, seed.item.Key)
			continue
		}
		pair := seed.item.TypeKey + "\x00" + seed.item.Key
		if _, ok := existingPairs[pair]; ok {
			log.Printf("  DictData '%s/%s' already exists, skipping", seed.item.TypeKey, seed.item.Key)
			continue
		}
		toInsert = append(toInsert, seed.item)
		remaining = append(remaining, seed)
	}
	if len(toInsert) == 0 {
		return
	}
	if err := db.CreateInBatches(&toInsert, seedBatchSize).Error; err != nil {
		log.Printf("Warning: %v", err)
		return
	}
	for _, seed := range remaining {
		prefix := "dict_data." + seed.item.TypeKey + "." + seed.item.Key
		for _, lf := range []struct {
			locale string
			val    string
		}{
			{"zh", seed.i18n["zh"]["label"]},
			{"en", seed.i18n["en"]["label"]},
		} {
			if lf.val != "" {
				saveI18n(db, prefix+".label", lf.locale, lf.val)
			}
		}
	}
}

func insertPermission(db *gorm.DB, data map[string]any) error {
	code := strVal(data, "code")
	if code == "" {
		return nil
	}
	var c int64
	db.Model(&model.Permission{}).Where("code = ?", code).Count(&c)
	if c > 0 {
		log.Printf("  Permission '%s' already exists, skipping", code)
		return nil
	}
	p := model.Permission{
		Code:        code,
		Name:        strVal(data, "name"),
		Group:       strVal(data, "group"),
		Description: strVal(data, "description"),
	}
	return db.Create(&p).Error
}

func insertRole(db *gorm.DB, data map[string]any) error {
	key := strVal(data, "key")
	if key == "" {
		return nil
	}
	var c int64
	db.Model(&model.RoleModel{}).Where("key = ?", key).Count(&c)
	if c > 0 {
		log.Printf("  Role '%s' already exists, skipping", key)
		return nil
	}
	role := model.RoleModel{
		Key:         key,
		DisplayName: strVal(data, "display_name"),
		Description: strVal(data, "description"),
		IsSystem:    boolVal(data, "is_system"),
		SortOrder:   intVal(data, "sort_order"),
	}
	if err := db.Create(&role).Error; err != nil {
		return err
	}

	perms, ok := data["permissions"].([]any)
	if ok && len(perms) > 0 {
		var permIDs []int64
		for _, p := range perms {
			code, _ := p.(string)
			var perm model.Permission
			if err := db.Where("code = ?", code).First(&perm).Error; err == nil {
				permIDs = append(permIDs, perm.ID)
			} else {
				log.Printf("  Permission '%s' not found, skipping", code)
			}
		}
		if len(permIDs) > 0 {
			var perms []model.Permission
			db.Find(&perms, permIDs)
			db.Model(&role).Association("Permissions").Replace(&perms)
		}
	}
	return nil
}

func insertDictType(db *gorm.DB, data map[string]any) error {
	key := strVal(data, "key")
	if key == "" {
		return nil
	}
	var c int64
	db.Model(&model.DictType{}).Where("key = ?", key).Count(&c)
	if c > 0 {
		log.Printf("  DictType '%s' already exists, skipping", key)
		return nil
	}
	d := model.DictType{
		Key:       key,
		Label:     strVal(data, "label_zh"),
		Remark:    strVal(data, "remark_zh"),
		SortOrder: intVal(data, "sort_order"),
		IsSystem:  boolVal(data, "is_system"),
		IsActive:  boolVal(data, "is_active"),
	}
	if err := db.Create(&d).Error; err != nil {
		return err
	}

	prefix := "dict_type." + key
	localeFields := []struct{ locale, field, val string }{
		{"zh", "label", strVal(data, "label_zh")},
		{"en", "label", strVal(data, "label_en")},
		{"zh", "remark", strVal(data, "remark_zh")},
		{"en", "remark", strVal(data, "remark_en")},
	}
	for _, lf := range localeFields {
		if lf.val != "" {
			saveI18n(db, prefix+"."+lf.field, lf.locale, lf.val)
		}
	}
	return nil
}

func insertDictData(db *gorm.DB, data map[string]any) error {
	typeKey := strVal(data, "type_key")
	key := strVal(data, "key")
	if typeKey == "" || key == "" {
		return nil
	}
	dt, err := lookupType(db, typeKey)
	if err != nil {
		return fmt.Errorf("dict type '%s' not found", typeKey)
	}
	var c int64
	db.Model(&model.DictData{}).Where("type_key = ? AND key = ?", dt.Key, key).Count(&c)
	if c > 0 {
		log.Printf("  DictData '%s/%s' already exists, skipping", typeKey, key)
		return nil
	}
	d := model.DictData{
		TypeKey:   dt.Key,
		Key:       key,
		Value:     strVal(data, "value"),
		Label:     strVal(data, "label_zh"),
		SortOrder: intVal(data, "sort_order"),
		IsDefault: boolVal(data, "is_default"),
		IsActive:  boolVal(data, "is_active"),
	}
	if err := db.Create(&d).Error; err != nil {
		return err
	}

	prefix := "dict_data." + typeKey + "." + key
	localeFields := []struct{ locale, field, val string }{
		{"zh", "label", strVal(data, "label_zh")},
		{"en", "label", strVal(data, "label_en")},
	}
	for _, lf := range localeFields {
		if lf.val != "" {
			saveI18n(db, prefix+"."+lf.field, lf.locale, lf.val)
		}
	}
	return nil
}

func insertSiteSetting(db *gorm.DB, data map[string]any) error {
	key := strVal(data, "key")
	if key == "" {
		return nil
	}
	var c int64
	db.Model(&model.SiteSetting{}).Where("key = ?", key).Count(&c)
	if c > 0 {
		log.Printf("  SiteSetting '%s' already exists, skipping", key)
		return nil
	}

	s := model.SiteSetting{
		Key:         key,
		Value:       strVal(data, "value"),
		Type:        strVal(data, "type"),
		Description: strVal(data, "description"),
		IsActive:    boolVal(data, "is_active"),
	}
	if s.Type == "" {
		s.Type = "string"
	}
	if err := db.Create(&s).Error; err != nil {
		return err
	}
	return nil
}

func insertUserLevel(db *gorm.DB, data map[string]any) error {
	if _, ok := data["code"]; !ok {
		return nil
	}
	code := intVal(data, "code")
	if code < 0 {
		return nil
	}
	var c int64
	db.Model(&model.UserLevel{}).Where("code = ?", code).Count(&c)
	if c > 0 {
		log.Printf("  UserLevel '%d' already exists, skipping", code)
		return nil
	}
	l := model.UserLevel{
		Code:         code,
		Label:        strVal(data, "label_zh"),
		MinUpload:    int64Val(data, "min_upload"),
		MinDownload:  int64Val(data, "min_download"),
		MinRatio:     floatVal(data, "min_ratio"),
		MinBonus:     floatVal(data, "min_bonus"),
		MinSeedCount: intVal(data, "min_seed_count"),
		Color:        strVal(data, "color"),
		Icon:         strVal(data, "icon"),
		SortOrder:    intVal(data, "sort_order"),
		IsActive:     boolVal(data, "is_active"),
	}
	if err := db.Create(&l).Error; err != nil {
		return err
	}

	prefix := fmt.Sprintf("user_level.%d", code)
	localeFields := []struct{ locale, field, val string }{
		{"zh", "label", strVal(data, "label_zh")},
		{"en", "label", strVal(data, "label_en")},
	}
	for _, lf := range localeFields {
		if lf.val != "" {
			saveI18n(db, prefix+"."+lf.field, lf.locale, lf.val)
		}
	}
	return nil
}
