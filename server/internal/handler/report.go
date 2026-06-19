package handler

import (
	"net/http"
	"strconv"

	"pt-server/internal/model"
	i18n "pt-server/internal/i18n"

	"github.com/gin-gonic/gin"
)

type CreateReportRequest struct {
	TargetType string `json:"target_type" binding:"required"`
	TargetID   int64  `json:"target_id" binding:"required"`
	Reason     string `json:"reason" binding:"required"`
}

func (h *Handler) CreateReport(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var req CreateReportRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	report := &model.Report{
		ReporterID: userID.(int64),
		TargetType: req.TargetType,
		TargetID:   req.TargetID,
		Reason:     req.Reason,
	}
	if err := h.repo.Report.Create(report); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_create_report")})
		return
	}
	c.JSON(http.StatusCreated, report)
}

func (h *Handler) ListReports(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	reports, total, err := h.repo.Report.List(page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_reports")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"reports": reports, "total": total})
}

func (h *Handler) ResolveReport(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}
	if err := h.repo.Report.UpdateStatus(id, model.ReportResolved); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_update_report")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
