package seed

import (
	"log"

	"pt-server/internal/model"

	"gorm.io/gorm"
)

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
