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
	order := []string{"permission", "dict_type", "dict_data", "site_setting", "role", "user_level", "user", "forum", "forum_mod", "topic", "post", "read_post", "torrent", "news", "comment", "bookmark", "thanks", "snatch", "offer", "message", "invite", "achievement", "user_achievement", "medal", "user_medal", "announcement", "shop_item", "lucky_draw_prize"}
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
			insertPermissionsBatch(db, grouped[modelName])
		case "role":
			insertRolesBatch(db, grouped[modelName])
		case "dict_type":
			insertDictTypes(db, grouped[modelName])
		case "dict_data":
			insertDictDataBatch(db, grouped[modelName])
		case "site_setting":
			insertSiteSettingsBatch(db, grouped[modelName])
		case "user_level":
			insertUserLevelsBatch(db, grouped[modelName])
		case "forum":
			for _, entry := range grouped[modelName] {
				insertForum(db, entry.Data)
			}
		case "forum_mod":
			for _, entry := range grouped[modelName] {
				insertForumMod(db, entry.Data)
			}
		case "topic":
			for _, entry := range grouped[modelName] {
				insertTopic(db, entry.Data)
			}
		case "post":
			for _, entry := range grouped[modelName] {
				insertPost(db, entry.Data)
			}
		case "read_post":
			for _, entry := range grouped[modelName] {
				insertReadPost(db, entry.Data)
			}
		case "achievement":
			for _, entry := range grouped[modelName] {
				insertEntry(db, entry)
			}
			grantRegistrationAchievement(db)
		default:
			for _, entry := range grouped[modelName] {
				insertEntry(db, entry)
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
	case "forum":
		return insertForum(db, entry.Data)
	case "forum_mod":
		return insertForumMod(db, entry.Data)
	case "topic":
		return insertTopic(db, entry.Data)
	case "post":
		return insertPost(db, entry.Data)
	case "read_post":
		return insertReadPost(db, entry.Data)
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
	case "achievement":
		return insertAchievement(db, entry.Data)
	case "medal":
		return insertMedal(db, entry.Data)
	case "user_medal":
		return insertUserMedal(db, entry.Data)
	case "user_achievement":
		return insertUserAchievement(db, entry.Data)
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

func grantRegistrationAchievement(db *gorm.DB) {
	var achievement model.Achievement
	if err := db.Where("condition LIKE ?", "%registered%").First(&achievement).Error; err != nil {
		log.Println("  Registration achievement not found, skipping batch grant")
		return
	}

	var count int64
	db.Model(&model.UserAchievement{}).Where("achievement_id = ?", achievement.ID).Count(&count)
	if count > 0 {
		log.Println("  Registration achievement already granted, skipping batch grant")
		return
	}

	var userIDs []int64
	if err := db.Model(&model.User{}).Select("id").Not("id IN (?)",
		db.Model(&model.UserAchievement{}).Select("user_id").Where("achievement_id = ?", achievement.ID),
	).Find(&userIDs).Error; err != nil {
		log.Printf("  Failed to query users for registration achievement: %v", err)
		return
	}

	if len(userIDs) == 0 {
		return
	}

	records := make([]model.UserAchievement, len(userIDs))
	now := time.Now()
	for i, uid := range userIDs {
		records[i] = model.UserAchievement{
			UserID:        uid,
			AchievementID: achievement.ID,
			UnlockedAt:    now,
		}
	}

	if err := db.Create(&records).Error; err != nil {
		log.Printf("  Failed to grant registration achievement: %v", err)
	} else {
		log.Printf("  Granted registration achievement to %d users", len(userIDs))
	}
}
