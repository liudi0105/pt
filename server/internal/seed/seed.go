package seed

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"pt-server/internal/model"
	"pt-server/internal/utils"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Entry struct {
	Model string         `json:"model"`
	Data  map[string]any `json:"data"`
}

var silent = logger.Discard

const seedBatchSize = 100

func strVal(m map[string]any, key string) string {
	v, _ := m[key].(string)
	return v
}

func intVal(m map[string]any, key string) int {
	v, _ := m[key].(float64)
	return int(v)
}

func int64Val(m map[string]any, key string) int64 {
	v, _ := m[key].(float64)
	return int64(v)
}

func floatVal(m map[string]any, key string) float64 {
	v, _ := m[key].(float64)
	return v
}

func boolVal(m map[string]any, key string) bool {
	v, _ := m[key].(bool)
	return v
}

func parseTime(s string) time.Time {
	if s == "" {
		return time.Now().Add(24 * time.Hour * 30)
	}
	t, err := time.Parse("2006-01-02T15:04:05Z", s)
	if err != nil {
		t, err = time.Parse("2006-01-02", s)
		if err != nil {
			return time.Now().Add(24 * time.Hour * 30)
		}
	}
	return t
}

func ReadFiles(dirs ...string) ([]Entry, error) {
	var entries []Entry
	for _, dir := range dirs {
		files, err := filepath.Glob(filepath.Join(dir, "*.jsonl"))
		if err != nil {
			return nil, fmt.Errorf("failed to list seed files in %s: %w", dir, err)
		}
		sort.Strings(files)
		if len(files) == 0 {
			return nil, fmt.Errorf("no .jsonl files found in %s", dir)
		}
		for _, f := range files {
			log.Printf("Reading %s", filepath.Base(f))
			fileEntries, err := readFile(f)
			if err != nil {
				return nil, fmt.Errorf("error reading %s: %w", f, err)
			}
			entries = append(entries, fileEntries...)
		}
	}
	return entries, nil
}

func readFile(path string) ([]Entry, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	var entries []Entry
	scanner := bufio.NewScanner(f)
	lineNo := 0
	for scanner.Scan() {
		lineNo++
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		var entry Entry
		if err := json.Unmarshal([]byte(line), &entry); err != nil {
			log.Printf("Warning: %s line %d: invalid JSON: %v", filepath.Base(path), lineNo, err)
			continue
		}
		entries = append(entries, entry)
	}
	return entries, scanner.Err()
}

func InsertAll(db *gorm.DB, entries []Entry) error {
	order := []string{"permission", "dict_type", "dict_data", "site_setting", "role", "user_level", "user", "torrent", "news", "comment", "bookmark", "thanks", "snatch", "offer", "message", "invite", "medal", "user_medal", "announcement", "shop_item", "lucky_draw_prize"}
	modelOrder := make(map[string]int, len(order))
	for i, m := range order {
		modelOrder[m] = i
	}
	sort.SliceStable(entries, func(i, j int) bool {
		return modelOrder[entries[i].Model] < modelOrder[entries[j].Model]
	})

	grouped := make(map[string][]Entry)
	for _, entry := range entries {
		grouped[entry.Model] = append(grouped[entry.Model], entry)
	}

	for _, modelName := range order {
		switch modelName {
		case "permission":
			if err := insertPermissionsBatch(db, grouped[modelName]); err != nil {
				log.Printf("Warning: %v", err)
			}
		case "role":
			if err := insertRolesBatch(db, grouped[modelName]); err != nil {
				log.Printf("Warning: %v", err)
			}
		case "dict_type":
			if err := insertDictTypes(db, grouped[modelName]); err != nil {
				log.Printf("Warning: %v", err)
			}
		case "dict_data":
			if err := insertDictDataBatch(db, grouped[modelName]); err != nil {
				log.Printf("Warning: %v", err)
			}
		case "site_setting":
			if err := insertSiteSettingsBatch(db, grouped[modelName]); err != nil {
				log.Printf("Warning: %v", err)
			}
		case "user_level":
			if err := insertUserLevelsBatch(db, grouped[modelName]); err != nil {
				log.Printf("Warning: %v", err)
			}
		default:
			for _, entry := range grouped[modelName] {
				if err := insertEntry(db, entry); err != nil {
					log.Printf("Warning: %v", err)
				}
			}
		}
	}
	log.Println("Seed data initialized successfully")
	return nil
}

func insertEntry(db *gorm.DB, entry Entry) error {
	switch entry.Model {
	case "permission":
		return insertPermission(db, entry.Data)
	case "role":
		return insertRole(db, entry.Data)
	case "dict_type":
		return insertDictType(db, entry.Data)
	case "dict_data":
		return insertDictData(db, entry.Data)
	case "site_setting":
		return insertSiteSetting(db, entry.Data)
	case "user_level":
		return insertUserLevel(db, entry.Data)
	case "user":
		return insertUser(db, entry.Data)
	case "torrent":
		return insertTorrent(db, entry.Data)
	case "news":
		return insertNews(db, entry.Data)
	case "comment":
		return insertComment(db, entry.Data)
	case "bookmark":
		return insertBookmark(db, entry.Data)
	case "thanks":
		return insertThanks(db, entry.Data)
	case "snatch":
		return insertSnatch(db, entry.Data)
	case "offer":
		return insertOffer(db, entry.Data)
	case "message":
		return insertMessage(db, entry.Data)
	case "invite":
		return insertInvite(db, entry.Data)
	case "medal":
		return insertMedal(db, entry.Data)
	case "user_medal":
		return insertUserMedal(db, entry.Data)
	case "announcement":
		return insertAnnouncement(db, entry.Data)
	case "shop_item":
		return insertShopItem(db, entry.Data)
	case "lucky_draw_prize":
		return insertLuckyDrawPrize(db, entry.Data)
	default:
		log.Printf("Unknown model: %s", entry.Model)
		return nil
	}
}

func lookupType(db *gorm.DB, key string) (model.DictType, error) {
	var dt model.DictType
	err := db.Session(&gorm.Session{Logger: silent}).
		Where("key = ?", key).Take(&dt).Error
	return dt, err
}

func saveI18n(db *gorm.DB, key, locale, value string) {
	if value == "" {
		return
	}
	db.Where("key = ? AND locale = ?", key, locale).
		Assign(model.I18n{Value: value}).
		FirstOrCreate(&model.I18n{Key: key, Locale: locale})
}

type dictTypeSeed struct {
	item model.DictType
	i18n map[string]map[string]string
}

type dictDataSeed struct {
	item model.DictData
	i18n map[string]map[string]string
}

func existingKeys(db *gorm.DB, table string, keys []string, column string) (map[string]struct{}, error) {
	if len(keys) == 0 {
		return map[string]struct{}{}, nil
	}
	type row struct {
		Value string
	}
	var rows []row
	if err := db.Table(table).Select(column+" AS value").Where(column+" IN ?", keys).Find(&rows).Error; err != nil {
		return nil, err
	}
	out := make(map[string]struct{}, len(rows))
	for _, r := range rows {
		out[r.Value] = struct{}{}
	}
	return out, nil
}

func existingDictDataPairs(db *gorm.DB, typeKeys []string) (map[string]struct{}, error) {
	if len(typeKeys) == 0 {
		return map[string]struct{}{}, nil
	}
	type row struct {
		TypeKey string
		Key     string
	}
	var rows []row
	if err := db.Table("sys_dict_data").Select("type_key, key").Where("type_key IN ?", typeKeys).Find(&rows).Error; err != nil {
		return nil, err
	}
	out := make(map[string]struct{}, len(rows))
	for _, r := range rows {
		out[r.TypeKey+"\x00"+r.Key] = struct{}{}
	}
	return out, nil
}

func existingStrings(db *gorm.DB, table, column string, values []string) (map[string]struct{}, error) {
	if len(values) == 0 {
		return map[string]struct{}{}, nil
	}
	type row struct {
		Value string
	}
	var rows []row
	if err := db.Table(table).Select(column+" AS value").Where(column+" IN ?", values).Find(&rows).Error; err != nil {
		return nil, err
	}
	out := make(map[string]struct{}, len(rows))
	for _, r := range rows {
		out[r.Value] = struct{}{}
	}
	return out, nil
}

func existingUserLevelCodes(db *gorm.DB, codes []int) (map[int]struct{}, error) {
	if len(codes) == 0 {
		return map[int]struct{}{}, nil
	}
	type row struct {
		Code int
	}
	var rows []row
	if err := db.Table("sys_user_level").Select("code").Where("code IN ?", codes).Find(&rows).Error; err != nil {
		return nil, err
	}
	out := make(map[int]struct{}, len(rows))
	for _, r := range rows {
		out[r.Code] = struct{}{}
	}
	return out, nil
}

func insertPermissionsBatch(db *gorm.DB, entries []Entry) error {
	if len(entries) == 0 {
		return nil
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
		return nil
	}
	existing, err := existingStrings(db, "permissions", "code", codes)
	if err != nil {
		return err
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
		return nil
	}
	return db.CreateInBatches(&toInsert, seedBatchSize).Error
}

func insertSiteSettingsBatch(db *gorm.DB, entries []Entry) error {
	if len(entries) == 0 {
		return nil
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
		return nil
	}
	existing, err := existingStrings(db, "site_settings", "key", keys)
	if err != nil {
		return err
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
		return nil
	}
	return db.CreateInBatches(&toInsert, seedBatchSize).Error
}

func insertUserLevelsBatch(db *gorm.DB, entries []Entry) error {
	if len(entries) == 0 {
		return nil
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
			Label:        strVal(entry.Data, "label"),
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
		return nil
	}
	existing, err := existingUserLevelCodes(db, codes)
	if err != nil {
		return err
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
		return nil
	}
	return db.CreateInBatches(&toInsert, seedBatchSize).Error
}

func insertRolesBatch(db *gorm.DB, entries []Entry) error {
	if len(entries) == 0 {
		return nil
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
		return nil
	}
	existing, err := existingStrings(db, "role_models", "key", names)
	if err != nil {
		return err
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
		return nil
	}
	if err := db.CreateInBatches(&toInsert, seedBatchSize).Error; err != nil {
		return err
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
			return err
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
				return err
			}
		}
	}
	return nil
}

func insertDictTypes(db *gorm.DB, entries []Entry) error {
	if len(entries) == 0 {
		return nil
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
				Label:     strVal(entry.Data, "label"),
				Remark:    strVal(entry.Data, "remark"),
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
		return nil
	}

	existing, err := existingKeys(db, "sys_dict_type", keys, "key")
	if err != nil {
		return err
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
		return nil
	}
	if err := db.CreateInBatches(&toInsert, seedBatchSize).Error; err != nil {
		return err
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
	return nil
}

func insertDictDataBatch(db *gorm.DB, entries []Entry) error {
	if len(entries) == 0 {
		return nil
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
				Label:     strVal(entry.Data, "label"),
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
		return nil
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
		return err
	}
	existingPairs, err := existingDictDataPairs(db, uniqueTypeKeys)
	if err != nil {
		return err
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
		return nil
	}
	if err := db.CreateInBatches(&toInsert, seedBatchSize).Error; err != nil {
		return err
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
	return nil
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
		Label:     strVal(data, "label"),
		Remark:    strVal(data, "remark"),
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
		Label:     strVal(data, "label"),
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
		Label:        strVal(data, "label"),
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

func insertUser(db *gorm.DB, data map[string]any) error {
	username := strVal(data, "username")
	if username == "" {
		return nil
	}
	var c int64
	db.Model(&model.User{}).Where("username = ?", username).Count(&c)
	if c > 0 {
		log.Printf("  User '%s' already exists, skipping", username)
		return nil
	}
	password := strVal(data, "password")
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}
	user := model.User{
		Username:     username,
		Email:        strVal(data, "email"),
		PasswordHash: string(hash),
		Passkey:      utils.GeneratePasskey(),
		Role:         model.Role(strVal(data, "role")),
		Status:       intVal(data, "status"),
	}

	roleName := strVal(data, "role")
	if roleName != "" {
		var role model.RoleModel
		if err := db.Where("key = ?", roleName).First(&role).Error; err == nil {
			user.RoleID = &role.ID
		}
	}

	if lvlCode, ok := data["level_code"]; ok {
		if f, ok := lvlCode.(float64); ok {
			var level model.UserLevel
			if err := db.Where("code = ?", int(f)).First(&level).Error; err == nil {
				user.LevelID = &level.ID
			}
		}
	}

	if lvlID, ok := data["level_id"]; ok {
		if f, ok := lvlID.(float64); ok {
			id := int64(f)
			user.LevelID = &id
		}
	}
	return db.Create(&user).Error
}

func resolveUserByEmail(db *gorm.DB, email string) int64 {
	if email == "" {
		return 0
	}
	var user model.User
	if err := db.Where("email = ?", email).First(&user).Error; err == nil {
		return user.ID
	}
	return 0
}

func resolveUserID(db *gorm.DB, data map[string]any) int64 {
	if email := strVal(data, "email"); email != "" {
		if id := resolveUserByEmail(db, email); id != 0 {
			return id
		}
	}
	if id := int64Val(data, "user_id"); id != 0 {
		return id
	}
	return 1
}

func insertTorrent(db *gorm.DB, data map[string]any) error {
	name := strVal(data, "name")
	if name == "" {
		return nil
	}
	var c int64
	db.Model(&model.Torrent{}).Where("name = ?", name).Count(&c)
	if c > 0 {
		log.Printf("  Torrent '%s' already exists, skipping", name)
		return nil
	}

	userID := resolveUserID(db, data)

	t := model.Torrent{
		UserID:      userID,
		InfoHash:    []byte(strVal(data, "info_hash")),
		Name:        name,
		Description: strVal(data, "description"),
		FileName:    strVal(data, "file_name"),
		Size:        int64Val(data, "size"),
		FileCount:   intVal(data, "file_count"),
		Category:    strVal(data, "category"),
		Promotion:   model.Promotion(strVal(data, "promotion")),
		SeedHours:   intVal(data, "seed_hours"),
		Seeders:     intVal(data, "seeders"),
		Leechers:    intVal(data, "leechers"),
		Completed:   intVal(data, "completed"),
	}
	return db.Create(&t).Error
}

func insertNews(db *gorm.DB, data map[string]any) error {
	title := strVal(data, "title")
	if title == "" {
		return nil
	}
	var c int64
	db.Model(&model.News{}).Where("title = ?", title).Count(&c)
	if c > 0 {
		log.Printf("  News '%s' already exists, skipping", title)
		return nil
	}

	userID := resolveUserID(db, data)

	n := model.News{
		Title:   title,
		Content: strVal(data, "content"),
		UserID:  userID,
	}
	return db.Create(&n).Error
}

func insertComment(db *gorm.DB, data map[string]any) error {
	content := strVal(data, "content")
	if content == "" {
		return nil
	}

	userID := resolveUserID(db, data)
	torrentID := int64Val(data, "torrent_id")
	if userID == 0 || torrentID == 0 {
		return nil
	}

	var c int64
	db.Model(&model.Comment{}).Where("user_id = ? AND torrent_id = ? AND content = ?", userID, torrentID, content).Count(&c)
	if c > 0 {
		log.Printf("  Comment from user %d on torrent %d already exists, skipping", userID, torrentID)
		return nil
	}

	comment := model.Comment{
		UserID:    userID,
		TorrentID: torrentID,
		Content:   content,
	}
	return db.Create(&comment).Error
}

func insertBookmark(db *gorm.DB, data map[string]any) error {
	userID := resolveUserID(db, data)
	torrentID := int64Val(data, "torrent_id")
	if userID == 0 || torrentID == 0 {
		return nil
	}

	var c int64
	db.Model(&model.Bookmark{}).Where("user_id = ? AND torrent_id = ?", userID, torrentID).Count(&c)
	if c > 0 {
		log.Printf("  Bookmark from user %d on torrent %d already exists, skipping", userID, torrentID)
		return nil
	}

	b := model.Bookmark{
		UserID:    userID,
		TorrentID: torrentID,
	}
	return db.Create(&b).Error
}

func insertThanks(db *gorm.DB, data map[string]any) error {
	userID := resolveUserID(db, data)
	torrentID := int64Val(data, "torrent_id")
	if userID == 0 || torrentID == 0 {
		return nil
	}

	var c int64
	db.Model(&model.Thanks{}).Where("user_id = ? AND torrent_id = ?", userID, torrentID).Count(&c)
	if c > 0 {
		log.Printf("  Thanks from user %d on torrent %d already exists, skipping", userID, torrentID)
		return nil
	}

	t := model.Thanks{
		UserID:    userID,
		TorrentID: torrentID,
	}
	return db.Create(&t).Error
}

func insertSnatch(db *gorm.DB, data map[string]any) error {
	userID := resolveUserID(db, data)
	torrentID := int64Val(data, "torrent_id")
	if userID == 0 || torrentID == 0 {
		return nil
	}

	var c int64
	db.Model(&model.Snatch{}).Where("user_id = ? AND torrent_id = ?", userID, torrentID).Count(&c)
	if c > 0 {
		log.Printf("  Snatch for user %d torrent %d already exists, skipping", userID, torrentID)
		return nil
	}

	s := model.Snatch{
		UserID:     userID,
		TorrentID:  torrentID,
		Uploaded:   int64Val(data, "uploaded"),
		Downloaded: int64Val(data, "downloaded"),
		Left:       int64Val(data, "left"),
		IP:         strVal(data, "ip"),
		Port:       intVal(data, "port"),
		PeerID:     strVal(data, "peer_id"),
		SeedTime:   int64Val(data, "seed_time"),
		LeechTime:  int64Val(data, "leech_time"),
		IsSeeding:  boolVal(data, "is_seeding"),
		IsHR:       boolVal(data, "is_hr"),
	}
	return db.Create(&s).Error
}

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

func insertMessage(db *gorm.DB, data map[string]any) error {
	subject := strVal(data, "subject")
	if subject == "" {
		return nil
	}

	senderID := int64Val(data, "sender_id")
	if email := strVal(data, "sender_email"); email != "" {
		if id := resolveUserByEmail(db, email); id != 0 {
			senderID = id
		}
	}
	receiverID := int64Val(data, "receiver_id")
	if email := strVal(data, "receiver_email"); email != "" {
		if id := resolveUserByEmail(db, email); id != 0 {
			receiverID = id
		}
	}
	if senderID == 0 || receiverID == 0 {
		return nil
	}

	var c int64
	db.Model(&model.Message{}).Where("sender_id = ? AND receiver_id = ? AND subject = ?", senderID, receiverID, subject).Count(&c)
	if c > 0 {
		log.Printf("  Message from user %d to user %d already exists, skipping", senderID, receiverID)
		return nil
	}

	m := model.Message{
		SenderID:   senderID,
		ReceiverID: receiverID,
		Subject:    subject,
		Body:       strVal(data, "body"),
		IsRead:     boolVal(data, "is_read"),
	}
	return db.Create(&m).Error
}

func insertInvite(db *gorm.DB, data map[string]any) error {
	code := strVal(data, "code")
	if code == "" {
		return nil
	}
	var c int64
	db.Model(&model.Invite{}).Where("code = ?", code).Count(&c)
	if c > 0 {
		log.Printf("  Invite '%s' already exists, skipping", code)
		return nil
	}

	userID := int64Val(data, "user_id")
	if email := strVal(data, "sender_email"); email != "" {
		if id := resolveUserByEmail(db, email); id != 0 {
			userID = id
		}
	}
	if userID == 0 {
		userID = 1
	}

	i := model.Invite{
		SenderID:  userID,
		Code:      code,
		Email:     strVal(data, "email"),
		IsUsed:    boolVal(data, "is_used"),
		ExpiresAt: parseTime(strVal(data, "expires_at")),
	}
	return db.Create(&i).Error
}

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
	return db.Create(&m).Error
}

func insertAnnouncement(db *gorm.DB, data map[string]any) error {
	title := strVal(data, "title")
	if title == "" {
		return nil
	}
	var c int64
	db.Model(&model.Announcement{}).Where("title = ?", title).Count(&c)
	if c > 0 {
		log.Printf("  Announcement '%s' already exists, skipping", title)
		return nil
	}

	expiresAt := parseTimePtr(strVal(data, "expires_at"))
	a := model.Announcement{
		Title:     title,
		Content:   strVal(data, "content"),
		IsSticky:  boolVal(data, "is_sticky"),
		ExpiresAt: expiresAt,
		IsActive:  boolVal(data, "is_active"),
		CreatedBy: resolveUserID(db, data),
	}
	return db.Create(&a).Error
}

func parseTimePtr(s string) *time.Time {
	if s == "" {
		return nil
	}
	t, err := time.Parse("2006-01-02T15:04:05Z", s)
	if err != nil {
		t, err = time.Parse("2006-01-02", s)
		if err != nil {
			return nil
		}
	}
	return &t
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

func insertShopItem(db *gorm.DB, data map[string]any) error {
	name := strVal(data, "name")
	if name == "" {
		return nil
	}
	var c int64
	db.Model(&model.ShopItem{}).Where("name = ?", name).Count(&c)
	if c > 0 {
		log.Printf("  ShopItem '%s' already exists, skipping", name)
		return nil
	}
	item := model.ShopItem{
		Name:        name,
		Description: strVal(data, "description"),
		Price:       floatVal(data, "price"),
		Stock:       intVal(data, "stock"),
		Type:        strVal(data, "type"),
		Metadata:    strVal(data, "metadata"),
		SortOrder:   intVal(data, "sort_order"),
		IsActive:    boolVal(data, "is_active"),
	}
	return db.Create(&item).Error
}

func insertLuckyDrawPrize(db *gorm.DB, data map[string]any) error {
	name := strVal(data, "name")
	if name == "" {
		return nil
	}
	var c int64
	db.Model(&model.LuckyDrawPrize{}).Where("name = ?", name).Count(&c)
	if c > 0 {
		log.Printf("  LuckyDrawPrize '%s' already exists, skipping", name)
		return nil
	}
	p := model.LuckyDrawPrize{
		Name:        name,
		Description: strVal(data, "description"),
		Price:       floatVal(data, "price"),
		Probability: floatVal(data, "probability"),
		Stock:       intVal(data, "stock"),
		Image:       strVal(data, "image"),
		IsActive:    boolVal(data, "is_active"),
		SortOrder:   intVal(data, "sort_order"),
	}
	return db.Create(&p).Error
}
