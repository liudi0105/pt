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
	order := []string{"permission", "dict_type", "dict_data", "role", "user_level", "user", "torrent", "news", "comment", "bookmark", "thanks", "snatch", "offer", "message", "invite", "medal", "user_medal", "announcement"}
	modelOrder := make(map[string]int, len(order))
	for i, m := range order {
		modelOrder[m] = i
	}
	sort.SliceStable(entries, func(i, j int) bool {
		return modelOrder[entries[i].Model] < modelOrder[entries[j].Model]
	})

	for _, entry := range entries {
		if err := insertEntry(db, entry); err != nil {
			log.Printf("Warning: %v", err)
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
	default:
		log.Printf("Unknown model: %s", entry.Model)
		return nil
	}
}

func lookupType(db *gorm.DB, name string) (model.DictType, error) {
	var dt model.DictType
	err := db.Session(&gorm.Session{Logger: silent}).
		Where("name = ?", name).Take(&dt).Error
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
	name := strVal(data, "name")
	if name == "" {
		return nil
	}
	var c int64
	db.Model(&model.RoleModel{}).Where("name = ?", name).Count(&c)
	if c > 0 {
		log.Printf("  Role '%s' already exists, skipping", name)
		return nil
	}
	role := model.RoleModel{
		Name:        name,
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
	name := strVal(data, "name")
	if name == "" {
		return nil
	}
	var c int64
	db.Model(&model.DictType{}).Where("name = ?", name).Count(&c)
	if c > 0 {
		log.Printf("  DictType '%s' already exists, skipping", name)
		return nil
	}
	d := model.DictType{
		Name:      name,
		Label:     strVal(data, "label"),
		Remark:    strVal(data, "remark"),
		SortOrder: intVal(data, "sort_order"),
		IsSystem:  boolVal(data, "is_system"),
		IsActive:  boolVal(data, "is_active"),
	}
	if err := db.Create(&d).Error; err != nil {
		return err
	}

	prefix := "dict_type." + name
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
	typeName := strVal(data, "type_name")
	key := strVal(data, "key")
	if typeName == "" || key == "" {
		return nil
	}
	dt, err := lookupType(db, typeName)
	if err != nil {
		return fmt.Errorf("dict type '%s' not found", typeName)
	}
	var c int64
	db.Model(&model.DictData{}).Where("type_id = ? AND key = ?", dt.ID, key).Count(&c)
	if c > 0 {
		log.Printf("  DictData '%s/%s' already exists, skipping", typeName, key)
		return nil
	}
	d := model.DictData{
		TypeID:    dt.ID,
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

	prefix := "dict_data." + typeName + "." + key
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
		if err := db.Where("name = ?", roleName).First(&role).Error; err == nil {
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

	userID := int64Val(data, "user_id")
	if userID == 0 {
		userID = 1
	}

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

	userID := int64Val(data, "user_id")
	if userID == 0 {
		userID = 1
	}

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

	userID := int64Val(data, "user_id")
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
	userID := int64Val(data, "user_id")
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
	userID := int64Val(data, "user_id")
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
	userID := int64Val(data, "user_id")
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

	userID := int64Val(data, "user_id")
	if userID == 0 {
		userID = 1
	}

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
	receiverID := int64Val(data, "receiver_id")
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
		CreatedBy: int64Val(data, "created_by"),
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
	userID := int64Val(data, "user_id")
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
