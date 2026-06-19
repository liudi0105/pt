package handler

import (
	"net/http"
	"strconv"

	"pt-server/internal/model"
	"pt-server/internal/repository"
	i18n "pt-server/internal/i18n"

	"github.com/gin-gonic/gin"
)

const minOfferVotes = 5

func (h *Handler) ListOffers(c *gin.Context) {
	filter := repository.OfferFilter{
		Category: c.Query("category"),
		Keyword:  c.Query("keyword"),
		Status:   c.Query("status"),
		Page:     1,
		PageSize: 20,
	}
	if p, err := strconv.Atoi(c.DefaultQuery("page", "1")); err == nil {
		filter.Page = p
	}
	if ps, err := strconv.Atoi(c.DefaultQuery("page_size", "20")); err == nil {
		filter.PageSize = ps
	}

	offers, total, err := h.repo.Offer.List(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_offers")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"offers": offers, "total": total})
}

type CreateOfferRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	Category    string `json:"category"`
}

func (h *Handler) CreateOffer(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req CreateOfferRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	offer := &model.Offer{
		UserID:      userID.(int64),
		Name:        req.Name,
		Description: req.Description,
		Category:    req.Category,
		Status:      model.OfferPending,
	}

	if err := h.repo.Offer.Create(offer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_create_offer")})
		return
	}

	c.JSON(http.StatusCreated, offer)
}

func (h *Handler) GetOffer(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	offer, err := h.repo.Offer.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "offer_not_found")})
		return
	}

	c.JSON(http.StatusOK, offer)
}

func (h *Handler) DeleteOffer(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")

	offer, err := h.repo.Offer.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "offer_not_found")})
		return
	}

	if role != "admin" && offer.UserID != userID.(int64) {
		c.JSON(http.StatusForbidden, gin.H{"error": i18n.T(c, "not_authorized")})
		return
	}

	if err := h.repo.Offer.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_delete_offer")})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

type VoteOfferRequest struct {
	IsYEAH bool `json:"is_yeah"`
}

func (h *Handler) VoteOffer(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	userID, _ := c.Get("user_id")

	offer, err := h.repo.Offer.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "offer_not_found")})
		return
	}

	if offer.UserID == userID.(int64) {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "cannot_vote_own_offer")})
		return
	}

	if offer.Status != model.OfferPending {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "offer_already_decided")})
		return
	}

	existing, err := h.repo.OfferVote.GetByUserAndOffer(userID.(int64), id)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": i18n.T(c, "already_voted")})
		return
	}
	_ = existing

	var req VoteOfferRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	vote := &model.OfferVote{
		UserID:  userID.(int64),
		OfferID: id,
		IsYEAH:  req.IsYEAH,
	}

	if err := h.repo.OfferVote.Create(vote); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_record_vote")})
		return
	}

	if err := h.repo.Offer.AddVote(id, req.IsYEAH); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_update_vote_count")})
		return
	}

	// Re-check thresholds
	current, _ := h.repo.Offer.GetByID(id)
	if current.VoteYEAH-current.VoteAgainst >= minOfferVotes {
		h.repo.Offer.UpdateStatus(id, model.OfferAllowed)
	} else if current.VoteAgainst-current.VoteYEAH >= minOfferVotes {
		h.repo.Offer.UpdateStatus(id, model.OfferDenied)
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *Handler) ListOfferVotes(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	votes, err := h.repo.OfferVote.ListByOffer(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_list_votes")})
		return
	}

	type VoteWithUser struct {
		model.OfferVote
		Username string `json:"username"`
	}
	result := make([]VoteWithUser, 0, len(votes))
	for _, v := range votes {
		vwu := VoteWithUser{OfferVote: v}
		u, err := h.repo.User.GetByID(v.UserID)
		if err == nil {
			vwu.Username = u.Username
		}
		result = append(result, vwu)
	}

	c.JSON(http.StatusOK, gin.H{"votes": result})
}

func (h *Handler) AdminAllowOffer(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}
	if err := h.repo.Offer.UpdateStatus(id, model.OfferAllowed); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_update_offer")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *Handler) AdminDenyOffer(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}
	if err := h.repo.Offer.UpdateStatus(id, model.OfferDenied); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "failed_to_update_offer")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
