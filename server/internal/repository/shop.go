package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type ShopItemRepo struct {
	db *gorm.DB
}

func NewShopItemRepo(db *gorm.DB) *ShopItemRepo {
	return &ShopItemRepo{db: db}
}

func (r *ShopItemRepo) List() ([]model.ShopItem, error) {
	var items []model.ShopItem
	err := r.db.Where("is_active = ?", true).Order("sort_order ASC, id ASC").Find(&items).Error
	return items, err
}

func (r *ShopItemRepo) GetByID(id int64) (*model.ShopItem, error) {
	var item model.ShopItem
	err := r.db.First(&item, id).Error
	return &item, err
}

func (r *ShopItemRepo) DecrementStock(id int64) error {
	return r.db.Model(&model.ShopItem{}).Where("id = ? AND stock > 0", id).
		UpdateColumn("stock", gorm.Expr("stock - 1")).Error
}

// Admin
func (r *ShopItemRepo) AdminList() ([]model.ShopItem, error) {
	var items []model.ShopItem
	err := r.db.Order("sort_order ASC, id ASC").Find(&items).Error
	return items, err
}

func (r *ShopItemRepo) Create(item *model.ShopItem) error {
	return r.db.Create(item).Error
}

func (r *ShopItemRepo) Update(item *model.ShopItem) error {
	return r.db.Save(item).Error
}

func (r *ShopItemRepo) Delete(id int64) error {
	return r.db.Delete(&model.ShopItem{}, id).Error
}

type UserItemRepo struct {
	db *gorm.DB
}

func NewUserItemRepo(db *gorm.DB) *UserItemRepo {
	return &UserItemRepo{db: db}
}

func (r *UserItemRepo) Add(userID, itemID int64, quantity int) error {
	var existing model.UserItem
	err := r.db.Where("user_id = ? AND item_id = ?", userID, itemID).First(&existing).Error
	if err == nil {
		return r.db.Model(&existing).UpdateColumn("quantity", gorm.Expr("quantity + ?", quantity)).Error
	}
	return r.db.Create(&model.UserItem{UserID: userID, ItemID: itemID, Quantity: quantity}).Error
}

func (r *UserItemRepo) ListByUser(userID int64) ([]model.UserItem, error) {
	var items []model.UserItem
	err := r.db.Where("user_id = ?", userID).Order("id DESC").Find(&items).Error
	return items, err
}
