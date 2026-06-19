package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type OfferRepo struct {
	db *gorm.DB
}

func NewOfferRepo(db *gorm.DB) *OfferRepo {
	return &OfferRepo{db: db}
}

func (r *OfferRepo) Create(o *model.Offer) error {
	return r.db.Create(o).Error
}

func (r *OfferRepo) GetByID(id int64) (*model.Offer, error) {
	var o model.Offer
	err := r.db.First(&o, id).Error
	if err != nil {
		return nil, err
	}
	var u model.User
	if err := r.db.Select("username").First(&u, o.UserID).Error; err == nil {
		o.Username = u.Username
	}
	return &o, nil
}

type OfferFilter struct {
	Category string
	Keyword  string
	Status   string
	UserID   int64
	Page     int
	PageSize int
}

func (r *OfferRepo) List(f OfferFilter) ([]model.Offer, int64, error) {
	if f.Page < 1 {
		f.Page = 1
	}
	if f.PageSize < 1 || f.PageSize > 100 {
		f.PageSize = 20
	}

	query := r.db.Model(&model.Offer{})
	if f.Category != "" {
		query = query.Where("category = ?", f.Category)
	}
	if f.Keyword != "" {
		query = query.Where("name LIKE ?", "%"+f.Keyword+"%")
	}
	if f.Status != "" {
		query = query.Where("status = ?", f.Status)
	}
	if f.UserID > 0 {
		query = query.Where("user_id = ?", f.UserID)
	}

	var total int64
	query.Count(&total)

	var offers []model.Offer
	err := query.Order("created_at DESC").
		Limit(f.PageSize).
		Offset((f.Page - 1) * f.PageSize).
		Find(&offers).Error
	if err != nil {
		return nil, 0, err
	}

	for i := range offers {
		var u model.User
		if err := r.db.Select("username").First(&u, offers[i].UserID).Error; err == nil {
			offers[i].Username = u.Username
		}
	}

	return offers, total, nil
}

func (r *OfferRepo) UpdateStatus(id int64, status model.OfferStatus) error {
	return r.db.Model(&model.Offer{}).Where("id = ?", id).Update("status", status).Error
}

func (r *OfferRepo) AddVote(offerID int64, isYEAH bool) error {
	field := "vote_yeah"
	if !isYEAH {
		field = "vote_against"
	}
	return r.db.Model(&model.Offer{}).Where("id = ?", offerID).
		UpdateColumn(field, gorm.Expr(field+" + 1")).Error
}

func (r *OfferRepo) Delete(id int64) error {
	return r.db.Delete(&model.Offer{}, id).Error
}

// ---- OfferVote ----

type OfferVoteRepo struct {
	db *gorm.DB
}

func NewOfferVoteRepo(db *gorm.DB) *OfferVoteRepo {
	return &OfferVoteRepo{db: db}
}

func (r *OfferVoteRepo) Create(v *model.OfferVote) error {
	return r.db.Create(v).Error
}

func (r *OfferVoteRepo) GetByUserAndOffer(userID, offerID int64) (*model.OfferVote, error) {
	var v model.OfferVote
	err := r.db.Where("user_id = ? AND offer_id = ?", userID, offerID).First(&v).Error
	return &v, err
}

func (r *OfferVoteRepo) ListByOffer(offerID int64) ([]model.OfferVote, error) {
	var votes []model.OfferVote
	err := r.db.Where("offer_id = ?", offerID).Find(&votes).Error
	return votes, err
}
