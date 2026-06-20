package bonus

import (
	"log"
	"math"
	"time"

	"pt-server/internal/model"
	"pt-server/internal/repository"
	"pt-server/internal/siteconfig"

	"gorm.io/gorm"
)

type SeedBonusResult struct {
	SeedBonus    float64
	SeedPoints   float64
	TorrentCount int
	TotalSize    int64
}

func CalculateSeedBonusForUser(db *gorm.DB, userID int64, cfg siteconfig.BonusSettings) (*SeedBonusResult, error) {
	var seeding []struct {
		TorrentID int64
		Size      int64
		Seeders   int
		CreatedAt time.Time
	}
	err := db.Table("snatches").
		Select("snatches.torrent_id, torrents.size, torrents.seeders, torrents.created_at").
		Joins("JOIN torrents ON torrents.id = snatches.torrent_id").
		Where("snatches.user_id = ? AND snatches.is_seeding = ? AND torrents.is_deleted = ?", userID, true, false).
		Find(&seeding).Error
	if err != nil {
		return nil, err
	}

	if len(seeding) == 0 {
		return &SeedBonusResult{}, nil
	}

	now := time.Now()
	secToWeek := float64(7 * 24 * 60 * 60)

	sqrtof2 := math.Sqrt(2)
	logOfPoint1 := math.Log(0.1)
	valueOne := logOfPoint1 / cfg.TZero
	valueTwo := cfg.BZero * (2 / math.Pi)
	valueThree := logOfPoint1 / (cfg.NZero - 1)

	var A float64
	var totalSize int64
	count := 0

	for _, s := range seeding {
		totalSize += s.Size
		weeksAlive := now.Sub(s.CreatedAt).Seconds() / secToWeek
		if weeksAlive < 0 {
			weeksAlive = 0
		}
		gbSize := float64(s.Size) / (1024 * 1024 * 1024)

		temp := (1 - math.Exp(valueOne*weeksAlive)) * gbSize *
			(1 + sqrtof2*math.Exp(valueThree*float64(s.Seeders-1)))
		A += temp
		count++
	}

	if count > cfg.MaxSeeding {
		count = cfg.MaxSeeding
	}

	seedBonus := valueTwo*math.Atan(A/cfg.L) + cfg.PerSeeding*float64(count)
	if seedBonus < 0 {
		seedBonus = 0
	}

	notOfficialSize := float64(totalSize)
	notOfficialSeedPoints := (notOfficialSize / (1024 * 1024 * 1024)) * 0.01
	if notOfficialSeedPoints > 50 {
		notOfficialSeedPoints = 50
	}
	seedPoints := notOfficialSeedPoints

	return &SeedBonusResult{
		SeedBonus:    seedBonus,
		SeedPoints:   seedPoints,
		TorrentCount: count,
		TotalSize:    totalSize,
	}, nil
}

func HarvestUser(repo *repository.Repository, userID int64, cfg siteconfig.BonusSettings) error {
	user, err := repo.User.GetByID(userID)
	if err != nil {
		return err
	}
	if user == nil {
		return nil
	}

	result, err := CalculateSeedBonusForUser(repo.DB(), userID, cfg)
	if err != nil {
		return err
	}

	if result.SeedBonus <= 0 && result.TorrentCount == 0 {
		return nil
	}

	oldBonus := user.Bonus
	earned := result.SeedBonus

	if err := repo.User.AddBonus(user.ID, earned); err != nil {
		return err
	}

	comment := "做种收获"
	repo.BonusLog.Create(&model.BonusLog{
		UserID:        user.ID,
		BusinessType:  model.BonusTypeHarvest,
		OldTotalValue: oldBonus,
		Value:         earned,
		NewTotalValue: oldBonus + earned,
		Comment:       comment,
	})

	return nil
}

func HarvestAll(repo *repository.Repository, cfg siteconfig.BonusSettings) {
	log.Printf("[bonus] Starting harvest cycle")

	var userIDs []int64
	repo.DB().Model(&model.Snatch{}).
		Where("is_seeding = ?", true).
		Distinct("user_id").
		Pluck("user_id", &userIDs)

	log.Printf("[bonus] Found %d users with active seeding", len(userIDs))

	for _, uid := range userIDs {
		if err := HarvestUser(repo, uid, cfg); err != nil {
			log.Printf("[bonus] Error harvesting user %d: %v", uid, err)
		}
	}

	log.Printf("[bonus] Harvest cycle completed")
}

func HarvestLoop(repo *repository.Repository, siteCfg *siteconfig.Settings) {
	HarvestAll(repo, siteCfg.BonusSnapshot())

	for {
		interval := siteCfg.BonusSnapshot().HarvestInterval
		time.Sleep(interval)
		HarvestAll(repo, siteCfg.BonusSnapshot())
	}
}
