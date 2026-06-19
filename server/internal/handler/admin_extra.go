package handler

import (
	"net/http"

	"pt-server/internal/model"

	"github.com/gin-gonic/gin"
)

func (h *Handler) AdminDashboard(c *gin.Context) {
	totalUsers, err := h.repo.User.Count()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	activeUsers, err := h.repo.User.CountByStatus(1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	uploadBytes, downloadBytes, err := h.repo.User.TotalTraffic()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	latestUsers, err := h.repo.User.Latest(5)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	latestTorrents, err := h.repo.Torrent.Latest(5)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, model.AdminDashboardStats{
		TotalUsers:         totalUsers,
		ActiveUsers:        activeUsers,
		TotalUploadBytes:   uploadBytes,
		TotalDownloadBytes: downloadBytes,
		LatestUsers:        latestUsers,
		LatestTorrents:     latestTorrents,
	})
}

func (h *Handler) AdminClientRisk(c *gin.Context) {
	c.JSON(http.StatusOK, model.AdminRiskResponse{
		AllowRules: []model.AdminRiskRule{
			{
				Key:      "allow-list",
				Rule:     "Agent Allow 白名单",
				Scope:    "已知可用客户端",
				Endpoint: "resource /api/agent-allows",
				Priority: "最高",
				Outcome:  "allow",
				Notes:    "用于维护允许接入站点的客户端标识。",
			},
			{
				Key:      "allow-query",
				Rule:     "全量白名单读取",
				Scope:    "后台治理 / 排查",
				Endpoint: "GET /api/all-agent-allows",
				Priority: "高",
				Outcome:  "allow",
				Notes:    "用于后台查看完整规则集合。",
			},
			{
				Key:      "allow-exception",
				Rule:     "例外放行",
				Scope:    "单次校验",
				Endpoint: "POST /api/agent-check",
				Priority: "按规则",
				Outcome:  "exception",
				Notes:    "命中例外规则时覆盖默认拒绝结果。",
			},
		},
		DenyRules: []model.AdminRiskRule{
			{
				Key:      "deny-list",
				Rule:     "Agent Deny 黑名单",
				Scope:    "已确认风险客户端",
				Endpoint: "resource /api/agent-denies",
				Priority: "最高",
				Outcome:  "deny",
				Notes:    "用于拒绝接入和风险治理。",
			},
			{
				Key:      "deny-check",
				Rule:     "接入校验结果",
				Scope:    "Tracker / 下载入口",
				Endpoint: "POST /api/agent-check",
				Priority: "执行时",
				Outcome:  "deny",
				Notes:    "风控结果会影响客户端是否允许继续连接。",
			},
		},
		CheckEndpoint: "POST /api/agent-check",
	})
}

func (h *Handler) AdminResources(c *gin.Context) {
	c.JSON(http.StatusOK, model.AdminResourcesResponse{
		Resources: []model.AdminResourceItem{
			{
				Key:        "tags",
				Resource:   "标签",
				Page:       "标签管理页",
				API:        "resource /api/tags",
				Consumers:  "种子分类、推荐位",
				StateModel: "资源可用 / 停用",
				Status:     "todo",
			},
			{
				Key:        "medals",
				Resource:   "勋章",
				Page:       "勋章管理页",
				API:        "resource /api/medals",
				Consumers:  "用户中心、商城",
				StateModel: "资源可用 / 停用",
				Status:     "implemented",
			},
			{
				Key:        "user-medals",
				Resource:   "用户勋章",
				Page:       "用户勋章管理页",
				API:        "resource /api/user-medals",
				Consumers:  "用户中心、审计",
				StateModel: "已持有 / 已回收",
				Status:     "todo",
			},
			{
				Key:        "exams",
				Resource:   "考核",
				Page:       "考核管理页",
				API:        "resource /api/exams",
				Consumers:  "新用户、晋级流程",
				StateModel: "考核生效 / 失效",
				Status:     "todo",
			},
			{
				Key:        "exam-users",
				Resource:   "考核用户",
				Page:       "考核用户管理页",
				API:        "resource /api/exam-users",
				Consumers:  "管理审核、记录回溯",
				StateModel: "待处理 / 已处理",
				Status:     "todo",
			},
			{
				Key:        "hr",
				Resource:   "H&R",
				Page:       "H&R 管理页",
				API:        "resource /api/hr",
				Consumers:  "风控、用户治理",
				StateModel: "待处理 / 已处理",
				Status:     "implemented",
			},
		},
	})
}
