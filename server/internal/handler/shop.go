package handler

import (
	"math"
	"math/rand"
	"net/http"
	"strconv"

	i18n "pt-server/internal/i18n"
	"pt-server/internal/model"

	"github.com/gin-gonic/gin"
)

// ---- Shop Items ----

func (h *Handler) ListShopItems(c *gin.Context) {
	items, err := h.repo.ShopItem.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "server_error")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items})
}

func (h *Handler) BuyShopItem(c *gin.Context) {
	userID, _ := c.Get("user_id")
	itemID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_id")})
		return
	}

	item, err := h.repo.ShopItem.GetByID(itemID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": i18n.T(c, "item_not_found")})
		return
	}

	if item.Stock == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "item_out_of_stock")})
		return
	}

	user, err := h.repo.User.GetByID(userID.(int64))
	if err != nil || user.Bonus < item.Price {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "insufficient_bonus")})
		return
	}

	oldBonus := user.Bonus
	if err := h.repo.User.AddBonus(user.ID, -item.Price); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "transaction_failed")})
		return
	}

	if item.Stock > 0 {
		h.repo.ShopItem.DecrementStock(item.ID)
	}

	h.repo.UserItem.Add(user.ID, item.ID, 1)
	h.repo.BonusLog.Create(&model.BonusLog{
		UserID:        user.ID,
		BusinessType:  model.BonusTypeExchange,
		OldTotalValue: oldBonus,
		Value:         -item.Price,
		NewTotalValue: oldBonus - item.Price,
		Comment:       "购买商品: " + item.Name,
	})

	c.JSON(http.StatusOK, gin.H{"ok": true, "name": item.Name})
}

func (h *Handler) ListMyItems(c *gin.Context) {
	userID, _ := c.Get("user_id")
	items, err := h.repo.UserItem.ListByUser(userID.(int64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "server_error")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items})
}

// ---- Lucky Draw ----

func (h *Handler) ListLuckyDrawPrizes(c *gin.Context) {
	prizes, err := h.repo.LuckyDrawPrize.ListActive()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "server_error")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"prizes": prizes})
}

func (h *Handler) LuckyDraw(c *gin.Context) {
	userID, _ := c.Get("user_id")

	prizes, err := h.repo.LuckyDrawPrize.ListActive()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "server_error")})
		return
	}
	if len(prizes) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "no_prizes")})
		return
	}

	price := prizes[0].Price

	user, err := h.repo.User.GetByID(userID.(int64))
	if err != nil || user.Bonus < price {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "insufficient_bonus")})
		return
	}

	roll := rand.Float64() * 100
	var wonPrize *model.LuckyDrawPrize
	cumulative := 0.0
	for i := range prizes {
		if prizes[i].Stock == 0 {
			continue
		}
		cumulative += prizes[i].Probability
		if roll < cumulative {
			wonPrize = &prizes[i]
			break
		}
	}

	oldBonus := user.Bonus
	if err := h.repo.User.AddBonus(user.ID, -price); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "transaction_failed")})
		return
	}

	prizeName := ""
	var prizeID *int64
	if wonPrize != nil {
		prizeName = wonPrize.Name
		prizeID = &wonPrize.ID
		if wonPrize.Stock > 0 {
			h.repo.LuckyDrawPrize.DecrementStock(wonPrize.ID)
		}
		h.repo.UserItem.Add(user.ID, wonPrize.ID, 1)
	} else {
		prizeName = i18n.T(c, "lucky_draw_none")
	}

	h.repo.LuckyDrawRecord.Create(&model.LuckyDrawRecord{
		UserID:    user.ID,
		PrizeID:   prizeID,
		PrizeName: prizeName,
		Cost:      price,
	})
	h.repo.BonusLog.Create(&model.BonusLog{
		UserID:        user.ID,
		BusinessType:  model.BonusTypeExchange,
		OldTotalValue: oldBonus,
		Value:         -price,
		NewTotalValue: oldBonus - price,
		Comment:       "抽奖: " + prizeName,
	})

	c.JSON(http.StatusOK, gin.H{
		"ok":        true,
		"prize":     prizeName,
		"won":       wonPrize != nil,
		"cost":      price,
		"remaining": user.Bonus - price,
	})
}

func (h *Handler) ListMyDrawRecords(c *gin.Context) {
	userID, _ := c.Get("user_id")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	recs, total, err := h.repo.LuckyDrawRecord.ListByUser(userID.(int64), page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "server_error")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"records": recs, "total": total})
}

// ---- Big/Small Gambling ----

type PlaceBetRequest struct {
	BetAmount float64 `json:"bet_amount" binding:"required,min=1"`
	BetChoice string  `json:"bet_choice" binding:"required,oneof=big small"`
}

func (h *Handler) PlaceBet(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req PlaceBetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "invalid_request_body")})
		return
	}

	user, err := h.repo.User.GetByID(userID.(int64))
	if err != nil || user.Bonus < req.BetAmount {
		c.JSON(http.StatusBadRequest, gin.H{"error": i18n.T(c, "insufficient_bonus")})
		return
	}

	dice1 := rand.Intn(6) + 1
	dice2 := rand.Intn(6) + 1
	dice3 := rand.Intn(6) + 1
	total := dice1 + dice2 + dice3

	isBig := total >= 11 && total <= 18
	isSmall := total >= 3 && total <= 10

	playerWon := (req.BetChoice == "big" && isBig) || (req.BetChoice == "small" && isSmall)

	var payout float64
	var result string
	if playerWon {
		payout = math.Round(req.BetAmount*1.96*100) / 100
		result = "win"
	} else {
		payout = 0
		result = "lose"
	}

	oldBonus := user.Bonus
	if err := h.repo.User.AddBonus(user.ID, payout-req.BetAmount); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "transaction_failed")})
		return
	}

	h.repo.GameBet.Create(&model.GameBet{
		UserID:     user.ID,
		BetAmount:  req.BetAmount,
		BetChoice:  req.BetChoice,
		DiceResult: total,
		Result:     result,
		Payout:     payout,
	})

	comment := "博彩" + req.BetChoice + ": " + result
	h.repo.BonusLog.Create(&model.BonusLog{
		UserID:        user.ID,
		BusinessType:  model.BonusTypeExchange,
		OldTotalValue: oldBonus,
		Value:         payout - req.BetAmount,
		NewTotalValue: oldBonus + payout - req.BetAmount,
		Comment:       comment,
	})

	c.JSON(http.StatusOK, gin.H{
		"ok":         true,
		"dice":       []int{dice1, dice2, dice3},
		"total":      total,
		"result":     result,
		"payout":     payout,
		"bet_amount": req.BetAmount,
		"remaining":  user.Bonus + payout - req.BetAmount,
	})
}

func (h *Handler) ListMyBets(c *gin.Context) {
	userID, _ := c.Get("user_id")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	bets, total, err := h.repo.GameBet.ListByUser(userID.(int64), page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": i18n.T(c, "server_error")})
		return
	}
	c.JSON(http.StatusOK, gin.H{"bets": bets, "total": total})
}
