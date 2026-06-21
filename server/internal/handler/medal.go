package handler

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	i18n "pt-server/internal/i18n"
	"pt-server/internal/model"
	"pt-server/internal/repository"

	"github.com/gin-gonic/gin"
)

func medalI18nPrefix(code int) string {
	return fmt.Sprintf("medal.%d", code)
}

func (h *Handler) ListMedals(c *gin.Context) {
	medals, err := h.repo.Medal.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_medals")})
		return
	}

	var keys []string
	for _, m := range medals {
		prefix := medalI18nPrefix(m.Code)
		keys = append(keys, prefix+".label", prefix+".description")
	}

	entries, _ := h.repo.I18n.LoadByKeys(keys)
	byKey := repository.GroupByKey(entries)

	for i := range medals {
		prefix := medalI18nPrefix(medals[i].Code)
		i18nMap := make(map[string]map[string]string)
		for _, field := range []string{"label", "description"} {
			key := prefix + "." + field
			if locales, ok := byKey[key]; ok {
				for locale, val := range locales {
					if i18nMap[locale] == nil {
						i18nMap[locale] = make(map[string]string)
					}
					i18nMap[locale][field] = val
				}
			}
		}
		medals[i].I18n = i18nMap
	}

	c.JSON(http.StatusOK, gin.H{"medals": medals})
}

func (h *Handler) CreateMedal(c *gin.Context) {
	var m model.Medal
	if err := c.ShouldBindJSON(&m); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	if err := h.repo.Medal.Create(&m); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_create_medal")})
		return
	}
	if m.I18n != nil {
		if err := h.repo.I18n.SaveMap(medalI18nPrefix(m.Code), m.I18n); err != nil {
			log.Printf("Failed to save i18n for medal %d: %v", m.Code, err)
		}
	}
	c.JSON(http.StatusCreated, m)
}

func (h *Handler) UpdateMedal(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}
	var m model.Medal
	if err := c.ShouldBindJSON(&m); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	m.ID = id
	if err := h.repo.Medal.Update(&m); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_update_medal")})
		return
	}
	if m.I18n != nil {
		prefix := medalI18nPrefix(m.Code)
		h.repo.I18n.DeleteByPrefix(prefix)
		if err := h.repo.I18n.SaveMap(prefix, m.I18n); err != nil {
			log.Printf("Failed to save i18n for medal %d: %v", m.Code, err)
		}
	}
	c.JSON(http.StatusOK, m)
}

func (h *Handler) DeleteMedal(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}
	medal, err := h.repo.Medal.GetByID(id)
	if err == nil {
		h.repo.I18n.DeleteByPrefix(medalI18nPrefix(medal.Code))
	}
	if err := h.repo.Medal.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_delete_medal")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *Handler) BuyMedal(c *gin.Context) {
	userID, _ := c.Get("user_id")
	medalID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	medal, err := h.repo.Medal.GetByID(medalID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "medal_not_found")})
		return
	}

	exists, _ := h.repo.UserMedal.Exists(userID.(int64), medalID)
	if exists {
		c.JSON(http.StatusConflict, gin.H{"error": i18n.T(c, "already_own_medal")})
		return
	}

	user, _ := h.repo.User.GetByID(userID.(int64))
	if user.Bonus < medal.Price {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "insufficient_bonus")})
		return
	}

	if err := h.repo.User.AddBonus(userID.(int64), -medal.Price); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "transaction_failed")})
		return
	}
	if err := h.repo.UserMedal.Buy(userID.(int64), medalID); err != nil {
		h.repo.User.AddBonus(userID.(int64), medal.Price)
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "transaction_failed")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *Handler) ListUserMedals(c *gin.Context) {
	userID, _ := c.Get("user_id")
	ums, err := h.repo.UserMedal.ListByUser(userID.(int64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_medals")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"medals": ums})
}

func (h *Handler) WearMedal(c *gin.Context) {
	userID, _ := c.Get("user_id")
	medalID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	exists, _ := h.repo.UserMedal.Exists(userID.(int64), medalID)
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "medal_not_owned")})
		return
	}

	if err := h.repo.UserMedal.SetWearing(userID.(int64), medalID, true); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "transaction_failed")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *Handler) UnwearMedal(c *gin.Context) {
	userID, _ := c.Get("user_id")
	medalID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	if err := h.repo.UserMedal.SetWearing(userID.(int64), medalID, false); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "transaction_failed")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}
