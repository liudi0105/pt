package handler

import (
	"net/http"
	"time"

	"pt-server/internal/model"
	i18n "pt-server/internal/i18n"

	"github.com/gin-gonic/gin"
)

func (h *Handler) Checkin(c *gin.Context) {
	userID, _ := c.Get("user_id")

	checked, err := h.repo.Attendance.HasCheckedToday(userID.(int64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_check_attendance")})
		return
	}
	if checked {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "already_checked_in")})
		return
	}

	now := time.Now()
	bonusReward := 10.0

	record, err := h.repo.Attendance.GetByUser(userID.(int64))
	if err != nil {
		// First checkin
		record = &model.Attendance{
			UserID:          userID.(int64),
			LastCheckin:     now,
			ConsecutiveDays: 1,
			TotalDays:       1,
		}
		h.repo.Attendance.Upsert(record)
	} else {
		yesterday := now.Add(-24 * time.Hour).Truncate(24 * time.Hour)
		if record.LastCheckin.Truncate(24 * time.Hour).Equal(yesterday) || record.LastCheckin.Before(yesterday) {
			record.ConsecutiveDays++
		} else {
			record.ConsecutiveDays = 1
		}
		record.TotalDays++
		record.LastCheckin = now
		h.repo.Attendance.Upsert(record)

		// Consecutive bonus
		if record.ConsecutiveDays >= 7 {
			bonusReward = 30.0
		} else if record.ConsecutiveDays >= 3 {
			bonusReward = 20.0
		}
	}

	h.repo.User.AddBonus(userID.(int64), bonusReward)

	c.JSON(http.StatusOK, gin.H{
		"ok":               true,
		"bonus_earned":     bonusReward,
		"consecutive_days": record.ConsecutiveDays,
		"total_days":       record.TotalDays,
	})
}

func (h *Handler) CheckinStatus(c *gin.Context) {
	userID, _ := c.Get("user_id")

	checked, _ := h.repo.Attendance.HasCheckedToday(userID.(int64))
	record, err := h.repo.Attendance.GetByUser(userID.(int64))

	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"checked":         false,
			"consecutive_days": 0,
			"total_days":      0,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"checked":          checked,
		"consecutive_days": record.ConsecutiveDays,
		"total_days":       record.TotalDays,
	})
}
