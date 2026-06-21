package achievement

import (
	"encoding/json"
	"fmt"
	"time"

	"pt-server/internal/model"
	"pt-server/internal/repository"

	"gorm.io/gorm"
)

type Checker struct {
	db              *gorm.DB
	achievementRepo *repository.AchievementRepo
	userAchievement *repository.UserAchievementRepo
}

func NewChecker(db *gorm.DB, achievementRepo *repository.AchievementRepo, uaRepo *repository.UserAchievementRepo) *Checker {
	return &Checker{
		db:              db,
		achievementRepo: achievementRepo,
		userAchievement: uaRepo,
	}
}

type condition struct {
	Type string  `json:"type"`
	Gte  float64 `json:"gte"`
}

func (c *Checker) CheckUser(userID int64) ([]int64, error) {
	achievements, err := c.achievementRepo.ListActive()
	if err != nil {
		return nil, err
	}

	userStats, err := c.gatherStats(userID)
	if err != nil {
		return nil, err
	}

	var unlocked []int64
	for _, a := range achievements {
		exists, _ := c.userAchievement.Exists(userID, a.ID)
		if exists {
			continue
		}
		ok, err := c.evaluate(a.Condition, userStats)
		if err != nil || !ok {
			continue
		}
		if err := c.userAchievement.Grant(userID, a.ID); err != nil {
			return nil, err
		}
		unlocked = append(unlocked, a.ID)
	}
	return unlocked, nil
}

type userStats struct {
	UploadBytes    int64
	DownloadBytes  int64
	SeedHours      float64
	ThanksReceived int64
	UploadCount    int64
	PostCount      int64
	DaysSinceJoin  float64
}

func (c *Checker) gatherStats(userID int64) (*userStats, error) {
	var user model.User
	if err := c.db.First(&user, userID).Error; err != nil {
		return nil, err
	}

	stats := &userStats{
		UploadBytes:   user.UploadBytes,
		DownloadBytes: user.DownloadBytes,
		DaysSinceJoin: time.Since(user.CreatedAt).Hours() / 24,
	}

	c.db.Raw("SELECT COALESCE(SUM(seed_hours), 0) FROM snatches WHERE user_id = ? AND is_seeding = ?", userID, true).Scan(&stats.SeedHours)
	c.db.Raw("SELECT COUNT(*) FROM torrents WHERE user_id = ? AND is_deleted = ?", userID, false).Scan(&stats.UploadCount)
	c.db.Raw("SELECT COUNT(*) FROM thanks WHERE receiver_id = ?", userID).Scan(&stats.ThanksReceived)
	c.db.Raw("SELECT COUNT(*) FROM posts WHERE user_id = ?", userID).Scan(&stats.PostCount)

	return stats, nil
}

func (c *Checker) evaluate(condStr string, stats *userStats) (bool, error) {
	var cond condition
	if err := json.Unmarshal([]byte(condStr), &cond); err != nil {
		return false, fmt.Errorf("invalid condition: %w", err)
	}
	var value float64
	switch cond.Type {
	case "upload_bytes":
		value = float64(stats.UploadBytes)
	case "download_bytes":
		value = float64(stats.DownloadBytes)
	case "seed_hours":
		value = stats.SeedHours
	case "thanks_received":
		value = float64(stats.ThanksReceived)
	case "upload_count":
		value = float64(stats.UploadCount)
	case "post_count":
		value = float64(stats.PostCount)
	case "days_since_join":
		value = stats.DaysSinceJoin
	case "registered":
		value = 1
	default:
		return false, nil
	}
	return value >= cond.Gte, nil
}
