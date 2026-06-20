package handler

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	i18n "pt-server/internal/i18n"
	"pt-server/internal/model"
	"pt-server/internal/repository"
	"pt-server/internal/utils"

	"github.com/gin-gonic/gin"
)

// ---- i18n helpers ----

func dictTypeI18nPrefix(key string) string {
	return "dict_type." + key
}

func dictDataI18nPrefix(typeKey, key string) string {
	return "dict_data." + typeKey + "." + key
}

func moveI18nPrefix(repo *repository.I18nRepo, oldPrefix, newPrefix string) error {
	if oldPrefix == newPrefix {
		return nil
	}
	entries, err := repo.LoadByPrefix(oldPrefix)
	if err != nil {
		return err
	}
	for _, entry := range entries {
		newKey := newPrefix + strings.TrimPrefix(entry.Key, oldPrefix)
		if err := repo.Save(newKey, entry.Locale, entry.Value); err != nil {
			return err
		}
	}
	return repo.DeleteByPrefix(oldPrefix)
}

func userLevelI18nPrefix(code int) string {
	return fmt.Sprintf("user_level.%d", code)
}

// ---- Dict Types ----

func (h *Handler) ListDictTypes(c *gin.Context) {
	types, err := h.repo.DictType.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var keys []string
	for _, t := range types {
		prefix := dictTypeI18nPrefix(t.Key)
		keys = append(keys, prefix+".label", prefix+".remark")
	}

	entries, _ := h.repo.I18n.LoadByKeys(keys)
	byKey := repository.GroupByKey(entries)

	for i := range types {
		prefix := dictTypeI18nPrefix(types[i].Key)
		i18nMap := make(map[string]map[string]string)
		for _, field := range []string{"label", "remark"} {
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
		types[i].I18n = i18nMap
	}

	c.JSON(http.StatusOK, gin.H{"types": types})
}

func (h *Handler) CreateDictType(c *gin.Context) {
	var t model.DictType
	if err := c.ShouldBindJSON(&t); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	if t.Key == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "key required"})
		return
	}
	if err := h.repo.DictType.Create(&t); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if t.I18n != nil {
		if err := h.repo.I18n.SaveMap(dictTypeI18nPrefix(t.Key), t.I18n); err != nil {
			log.Printf("Failed to save i18n for dict type %s: %v", t.Key, err)
		}
	}
	c.JSON(http.StatusCreated, t)
}

func (h *Handler) UpdateDictType(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	old, err := h.repo.DictType.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "dict type not found"})
		return
	}

	var t model.DictType
	if err := c.ShouldBindJSON(&t); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	if t.Key == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "key required"})
		return
	}
	t.ID = id
	oldData, _ := h.repo.DictData.ListByTypeKey(old.Key)
	if err := h.repo.DictType.Update(&t); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	oldPrefix := dictTypeI18nPrefix(old.Key)
	newPrefix := dictTypeI18nPrefix(t.Key)
	if err := moveI18nPrefix(h.repo.I18n, oldPrefix, newPrefix); err != nil {
		log.Printf("Failed to move dict type i18n from %s to %s: %v", oldPrefix, newPrefix, err)
	}
	if t.I18n != nil {
		if err := h.repo.I18n.SaveMap(newPrefix, t.I18n); err != nil {
			log.Printf("Failed to save i18n for dict type %s: %v", t.Key, err)
		}
	}
	if old.Key != t.Key {
		if err := h.repo.DictData.UpdateTypeKey(old.Key, t.Key); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		for _, item := range oldData {
			if err := moveI18nPrefix(
				h.repo.I18n,
				dictDataI18nPrefix(old.Key, item.Key),
				dictDataI18nPrefix(t.Key, item.Key),
			); err != nil {
				log.Printf("Failed to move dict data i18n for %s/%s: %v", old.Key, item.Key, err)
			}
		}
	}
	c.JSON(http.StatusOK, t)
}

func (h *Handler) DeleteDictType(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	t, err := h.repo.DictType.GetByID(id)
	if err == nil {
		if data, e := h.repo.DictData.ListByTypeKey(t.Key); e == nil {
			for _, item := range data {
				h.repo.I18n.DeleteByPrefix(dictDataI18nPrefix(t.Key, item.Key))
			}
		}
		if err := h.repo.DictData.DeleteByTypeKey(t.Key); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		h.repo.I18n.DeleteByPrefix(dictTypeI18nPrefix(t.Key))
	}
	if err := h.repo.DictType.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

// ---- Dict Data ----

func (h *Handler) ListDictData(c *gin.Context) {
	typeKey := c.Query("type_key")

	log.Printf("[DEBUG] ListDictData: raw_query=%q typeKey=%q",
		c.Request.URL.RawQuery, typeKey)

	var data []model.DictData
	var err error
	if typeKey != "" {
		data, err = h.repo.DictData.ListByTypeKey(typeKey)
		log.Printf("[DEBUG] ListDictData: ListByTypeKey(%s) → %d rows", typeKey, len(data))
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "type_key required"})
		return
	}
	if err != nil {
		log.Printf("[DEBUG] ListDictData: err=%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if typeKey != "" && len(data) > 0 {
		var keys []string
		for _, d := range data {
			keys = append(keys, dictDataI18nPrefix(typeKey, d.Key)+".label")
		}
		entries, _ := h.repo.I18n.LoadByKeys(keys)
		byKey := repository.GroupByKey(entries)
		for i := range data {
			prefix := dictDataI18nPrefix(typeKey, data[i].Key)
			i18nMap := make(map[string]map[string]string)
			key := prefix + ".label"
			if locales, ok := byKey[key]; ok {
				for locale, val := range locales {
					if i18nMap[locale] == nil {
						i18nMap[locale] = make(map[string]string)
					}
					i18nMap[locale]["label"] = val
				}
			}
			data[i].I18n = i18nMap
		}
	}

	c.JSON(http.StatusOK, gin.H{"data": data})
}

func (h *Handler) ListDictDataPublic(c *gin.Context) {
	typeKeys := c.QueryArray("type_key")
	if len(typeKeys) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "at least one type_key required"})
		return
	}

	all, err := h.repo.DictData.ListByTypeKeys(typeKeys)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	grouped := make(map[string][]model.DictData)
	for _, d := range all {
		grouped[d.TypeKey] = append(grouped[d.TypeKey], d)
	}

	for typeKey, items := range grouped {
		var keys []string
		for _, d := range items {
			keys = append(keys, dictDataI18nPrefix(typeKey, d.Key)+".label")
		}
		entries, _ := h.repo.I18n.LoadByKeys(keys)
		byKey := repository.GroupByKey(entries)
		for i := range items {
			prefix := dictDataI18nPrefix(typeKey, items[i].Key)
			i18nMap := make(map[string]map[string]string)
			key := prefix + ".label"
			if locales, ok := byKey[key]; ok {
				for locale, val := range locales {
					if i18nMap[locale] == nil {
						i18nMap[locale] = make(map[string]string)
					}
					i18nMap[locale]["label"] = val
				}
			}
			items[i].I18n = i18nMap
		}
		grouped[typeKey] = items
	}

	c.JSON(http.StatusOK, gin.H{"data": grouped})
}

func (h *Handler) CreateDictData(c *gin.Context) {
	var d model.DictData
	if err := c.ShouldBindJSON(&d); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	if d.TypeKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "type_key required"})
		return
	}
	if _, err := h.repo.DictType.GetByKey(d.TypeKey); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dict type not found"})
		return
	}
	if err := h.repo.DictData.Create(&d); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if d.I18n != nil {
		if d.TypeKey != "" {
			h.repo.I18n.SaveMap(dictDataI18nPrefix(d.TypeKey, d.Key), d.I18n)
		}
	}
	c.JSON(http.StatusCreated, d)
}

func (h *Handler) UpdateDictData(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	old, err := h.repo.DictData.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "dict data not found"})
		return
	}

	var d model.DictData
	if err := c.ShouldBindJSON(&d); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	if d.TypeKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "type_key required"})
		return
	}
	if _, err := h.repo.DictType.GetByKey(d.TypeKey); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dict type not found"})
		return
	}
	d.ID = id
	if err := h.repo.DictData.Update(&d); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	oldPrefix := dictDataI18nPrefix(old.TypeKey, old.Key)
	newPrefix := dictDataI18nPrefix(d.TypeKey, d.Key)
	if oldPrefix != newPrefix {
		h.repo.I18n.DeleteByPrefix(oldPrefix)
	}
	if d.I18n != nil {
		h.repo.I18n.DeleteByPrefix(newPrefix)
		h.repo.I18n.SaveMap(newPrefix, d.I18n)
	}
	c.JSON(http.StatusOK, d)
}

func (h *Handler) DeleteDictData(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	if d, err := h.repo.DictData.GetByID(id); err == nil {
		h.repo.I18n.DeleteByPrefix(dictDataI18nPrefix(d.TypeKey, d.Key))
	}

	if err := h.repo.DictData.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

// ---- User Management ----

func (h *Handler) AdminListUsers(c *gin.Context) {
	f := repository.UserFilter{
		Role:     c.Query("role"),
		Keyword:  c.Query("keyword"),
		Page:     1,
		PageSize: 20,
	}
	if s, err := strconv.Atoi(c.DefaultQuery("status", "0")); err == nil {
		f.Status = s
	}
	if p, err := strconv.Atoi(c.DefaultQuery("page", "1")); err == nil {
		f.Page = p
	}
	if ps, err := strconv.Atoi(c.DefaultQuery("page_size", "20")); err == nil {
		f.PageSize = ps
	}

	result, err := h.repo.User.List(f)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

type AdminUpdateUserRoleReq struct {
	Role string `json:"role" binding:"required"`
}

func (h *Handler) AdminUpdateUserRole(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var req AdminUpdateUserRoleReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	r := model.Role(req.Role)
	if r != model.RoleUser && r != model.RoleVIP && r != model.RoleAdmin {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_role")})
		return
	}
	if err := h.repo.User.UpdateRole(id, r); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

type AdminUpdateUserStatusReq struct {
	Status int `json:"status" binding:"required"`
}

func (h *Handler) AdminUpdateUserStatus(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var req AdminUpdateUserStatusReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	if err := h.repo.User.UpdateStatus(id, req.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

type AdminUpdateUserTrafficReq struct {
	Uploaded   *int64   `json:"uploaded"`
	Downloaded *int64   `json:"downloaded"`
	Bonus      *float64 `json:"bonus"`
}

func (h *Handler) AdminUpdateUserTraffic(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var req AdminUpdateUserTrafficReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	if req.Uploaded != nil || req.Downloaded != nil {
		u, d := int64(0), int64(0)
		if req.Uploaded != nil {
			u = *req.Uploaded
		}
		if req.Downloaded != nil {
			d = *req.Downloaded
		}
		if err := h.repo.User.UpdateTraffic(id, u, d); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	if req.Bonus != nil {
		user, err := h.repo.User.GetByID(id)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		if err := h.repo.User.UpdateBonus(id, *req.Bonus); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		h.repo.BonusLog.Create(&model.BonusLog{
			UserID:        id,
			BusinessType:  model.BonusTypeAdmin,
			OldTotalValue: user.Bonus,
			Value:         *req.Bonus - user.Bonus,
			NewTotalValue: *req.Bonus,
			Comment:       "管理员调整",
		})
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *Handler) AdminListBonusLogs(c *gin.Context) {
	userID, _ := strconv.ParseInt(c.DefaultQuery("user_id", "0"), 10, 64)
	businessType, _ := strconv.Atoi(c.DefaultQuery("business_type", "0"))
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	result, err := h.repo.BonusLog.List(repository.BonusLogFilter{
		UserID:       userID,
		BusinessType: businessType,
		Page:         page,
		PageSize:     pageSize,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *Handler) AdminResetPasskey(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	pk := utils.GeneratePasskey()
	if err := h.repo.User.ResetPasskey(id, pk); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"passkey": pk})
}

// ---- Levels ----

func (h *Handler) ListLevels(c *gin.Context) {
	levels, err := h.repo.Level.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var keys []string
	for _, l := range levels {
		prefix := userLevelI18nPrefix(l.Code)
		keys = append(keys, prefix+".label")
	}

	entries, _ := h.repo.I18n.LoadByKeys(keys)
	byKey := repository.GroupByKey(entries)

	for i := range levels {
		prefix := userLevelI18nPrefix(levels[i].Code)
		i18nMap := make(map[string]map[string]string)
		key := prefix + ".label"
		if locales, ok := byKey[key]; ok {
			for locale, val := range locales {
				if i18nMap[locale] == nil {
					i18nMap[locale] = make(map[string]string)
				}
				i18nMap[locale]["label"] = val
			}
		}
		levels[i].I18n = i18nMap
	}

	c.JSON(http.StatusOK, gin.H{"levels": levels})
}

func (h *Handler) CreateLevel(c *gin.Context) {
	var l model.UserLevel
	if err := c.ShouldBindJSON(&l); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	if err := h.repo.Level.Create(&l); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if l.I18n != nil {
		if err := h.repo.I18n.SaveMap(userLevelI18nPrefix(l.Code), l.I18n); err != nil {
			log.Printf("Failed to save i18n for user level %d: %v", l.Code, err)
		}
	}
	c.JSON(http.StatusCreated, l)
}

func (h *Handler) UpdateLevel(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var l model.UserLevel
	if err := c.ShouldBindJSON(&l); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	l.ID = id
	if err := h.repo.Level.Update(&l); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if l.I18n != nil {
		prefix := userLevelI18nPrefix(l.Code)
		h.repo.I18n.DeleteByPrefix(prefix)
		h.repo.I18n.SaveMap(prefix, l.I18n)
	}
	c.JSON(http.StatusOK, l)
}

func (h *Handler) DeleteLevel(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	if err := h.repo.Level.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

// ---- Roles & Permissions ----

func (h *Handler) ListRoles(c *gin.Context) {
	roles, err := h.repo.Role.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"roles": roles})
}

func (h *Handler) GetRole(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	role, err := h.repo.Role.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "role_not_found")})
		return
	}
	c.JSON(http.StatusOK, role)
}

func (h *Handler) CreateRole(c *gin.Context) {
	var r model.RoleModel
	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	if err := h.repo.Role.Create(&r); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, r)
}

func (h *Handler) UpdateRole(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var r model.RoleModel
	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	r.ID = id
	if err := h.repo.Role.Update(&r); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, r)
}

func (h *Handler) DeleteRole(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	if err := h.repo.Role.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *Handler) SetRolePermissions(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var req struct {
		PermissionIDs []int64 `json:"permission_ids"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	if err := h.repo.Role.SetPermissions(id, req.PermissionIDs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *Handler) ListPermissions(c *gin.Context) {
	perms, err := h.repo.Permission.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"permissions": perms})
}

// ---- Site Settings ----

func (h *Handler) ListSiteSettings(c *gin.Context) {
	settings, err := h.repo.SiteSetting.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"settings": settings})
}

func (h *Handler) UpdateSiteSetting(c *gin.Context) {
	key := c.Param("key")
	var req struct {
		Value string `json:"value"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	if err := h.repo.SiteSetting.Upsert(&model.SiteSetting{Key: key, Value: req.Value}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if h.siteCfg != nil {
		h.siteCfg.ApplySiteSetting(key, req.Value)
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

// ---- Batch Promotion ----

func (h *Handler) AdminBatchUpdatePromotion(c *gin.Context) {
	var req struct {
		Category  string          `json:"category"`
		Keyword   string          `json:"keyword"`
		Promotion model.Promotion `json:"promotion" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	promo := req.Promotion
	switch promo {
	case model.PromoNone, model.PromoFree, model.PromoTwoUp, model.PromoFreeTwoUp, model.PromoThirtyPct:
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_promotion_type")})
		return
	}

	cats := []string{}
	if req.Category != "" {
		cats = append(cats, req.Category)
	}
	filter := repository.TorrentFilter{
		Categories: cats,
		Keyword:    req.Keyword,
	}
	affected, err := h.repo.Torrent.BatchUpdatePromotion(filter, promo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"affected": affected})
}

// ---- i18n API ----

func (h *Handler) QueryI18n(c *gin.Context) {
	prefix := c.Query("prefix")

	var entries []model.I18n
	var err error
	if prefix != "" {
		entries, err = h.repo.I18n.LoadByPrefix(prefix)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "prefix is required"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	result := make(map[string]map[string]string)
	for _, e := range entries {
		if result[e.Key] == nil {
			result[e.Key] = make(map[string]string)
		}
		result[e.Key][e.Locale] = e.Value
	}
	c.JSON(http.StatusOK, gin.H{"entries": result})
}

// ---- Announcements ----

func (h *Handler) ListAnnouncements(c *gin.Context) {
	announcements, err := h.repo.Announcement.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"announcements": announcements})
}

func (h *Handler) ListActiveAnnouncements(c *gin.Context) {
	announcements, err := h.repo.Announcement.ListActive()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"announcements": announcements})
}

func (h *Handler) CreateAnnouncement(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var a model.Announcement
	if err := c.ShouldBindJSON(&a); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	a.CreatedBy = userID.(int64)
	if err := h.repo.Announcement.Create(&a); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, a)
}

func (h *Handler) UpdateAnnouncement(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var a model.Announcement
	if err := c.ShouldBindJSON(&a); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	a.ID = id
	if err := h.repo.Announcement.Update(&a); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, a)
}

func (h *Handler) DeleteAnnouncement(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	if err := h.repo.Announcement.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
