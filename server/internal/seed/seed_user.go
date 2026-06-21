package seed

import (
	"fmt"
	"log"

	"pt-server/internal/model"
	"pt-server/internal/utils"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

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
		Username:      username,
		Email:         strVal(data, "email"),
		PasswordHash:  string(hash),
		Passkey:       utils.GeneratePasskey(),
		Role:          model.Role(strVal(data, "role")),
		Status:        intVal(data, "status"),
		UploadBytes:   int64Val(data, "upload_bytes"),
		DownloadBytes: int64Val(data, "download_bytes"),
		Bonus:         floatVal(data, "bonus"),
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
