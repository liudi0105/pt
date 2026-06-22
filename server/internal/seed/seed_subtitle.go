package seed

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

func insertSubtitle(db *gorm.DB, data map[string]any) error {
	torrentID := int64Val(data, "torrent_id")
	if torrentID == 0 {
		return nil
	}

	var c int64
	db.Model(&model.Subtitle{}).Where("torrent_id = ? AND title = ?", torrentID, strVal(data, "title")).Count(&c)
	if c > 0 {
		return nil
	}

	userID := resolveUserID(db, data)
	s := model.Subtitle{
		TorrentID: torrentID,
		UserID:    userID,
		Language:  strVal(data, "language"),
		Title:     strVal(data, "title"),
		FileName:  strVal(data, "file_name"),
		FileSize:  int64Val(data, "file_size"),
		Hits:      intVal(data, "hits"),
	}
	return db.Create(&s).Error
}
