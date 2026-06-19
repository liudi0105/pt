package handler

import (
	"log"
	"net/http"
	"strconv"

	"pt-server/internal/model"
	"pt-server/internal/repository"
	"pt-server/internal/utils"
	i18n "pt-server/internal/i18n"

	"github.com/gin-gonic/gin"
)

// ---- Dict Types ----

func (h *Handler) ListDictTypes(c *gin.Context) {
	types, err := h.repo.DictType.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"types": types})
}

func (h *Handler) CreateDictType(c *gin.Context) {
	var t model.DictType
	if err := c.ShouldBindJSON(&t); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	if err := h.repo.DictType.Create(&t); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, t)
}

func (h *Handler) UpdateDictType(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var t model.DictType
	if err := c.ShouldBindJSON(&t); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	t.ID = id
	if err := h.repo.DictType.Update(&t); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, t)
}

func (h *Handler) DeleteDictType(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	if err := h.repo.DictType.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

// ---- Dict Data ----

func (h *Handler) ListDictData(c *gin.Context) {
	typeID, _ := strconv.ParseInt(c.Query("type_id"), 10, 64)
	typeName := c.Query("type_name")

	log.Printf("[DEBUG] ListDictData: raw_query=%q type_id=%d typeName=%q",
		c.Request.URL.RawQuery, typeID, typeName)

	var data []model.DictData
	var err error
	if typeID > 0 {
		data, err = h.repo.DictData.ListByType(typeID)
		log.Printf("[DEBUG] ListDictData: ListByType(%d) → %d rows", typeID, len(data))
	} else if typeName != "" {
		data, err = h.repo.DictData.ListByTypeName(typeName)
		log.Printf("[DEBUG] ListDictData: ListByTypeName(%s) → %d rows", typeName, len(data))
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "type_id or type_name required"})
		return
	}
	if err != nil {
		log.Printf("[DEBUG] ListDictData: err=%v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}

func (h *Handler) CreateDictData(c *gin.Context) {
	var d model.DictData
	if err := c.ShouldBindJSON(&d); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	if err := h.repo.DictData.Create(&d); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, d)
}

func (h *Handler) UpdateDictData(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var d model.DictData
	if err := c.ShouldBindJSON(&d); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}
	d.ID = id
	if err := h.repo.DictData.Update(&d); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, d)
}

func (h *Handler) DeleteDictData(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
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
		if err := h.repo.User.UpdateBonus(id, *req.Bonus); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
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
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

// ---- Batch Promotion ----

func (h *Handler) AdminBatchUpdatePromotion(c *gin.Context) {
	var req struct {
		Category string          `json:"category"`
		Keyword  string          `json:"keyword"`
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

	filter := repository.TorrentFilter{
		Category: req.Category,
		Keyword:  req.Keyword,
	}
	affected, err := h.repo.Torrent.BatchUpdatePromotion(filter, promo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"affected": affected})
}
