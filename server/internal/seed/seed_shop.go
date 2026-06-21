package seed

import (
	"log"

	"pt-server/internal/model"

	"gorm.io/gorm"
)

func insertShopItem(db *gorm.DB, data map[string]any) error {
	name := strVal(data, "name")
	if name == "" {
		return nil
	}
	var c int64
	db.Model(&model.ShopItem{}).Where("name = ?", name).Count(&c)
	if c > 0 {
		log.Printf("  ShopItem '%s' already exists, skipping", name)
		return nil
	}
	item := model.ShopItem{
		Name:        name,
		Description: strVal(data, "description"),
		Price:       floatVal(data, "price"),
		Stock:       intVal(data, "stock"),
		Type:        strVal(data, "type"),
		Metadata:    strVal(data, "metadata"),
		SortOrder:   intVal(data, "sort_order"),
		IsActive:    boolVal(data, "is_active"),
	}
	return db.Create(&item).Error
}

func insertLuckyDrawPrize(db *gorm.DB, data map[string]any) error {
	name := strVal(data, "name")
	if name == "" {
		return nil
	}
	var c int64
	db.Model(&model.LuckyDrawPrize{}).Where("name = ?", name).Count(&c)
	if c > 0 {
		log.Printf("  LuckyDrawPrize '%s' already exists, skipping", name)
		return nil
	}
	p := model.LuckyDrawPrize{
		Name:        name,
		Description: strVal(data, "description"),
		Price:       floatVal(data, "price"),
		Probability: floatVal(data, "probability"),
		Stock:       intVal(data, "stock"),
		Image:       strVal(data, "image"),
		IsActive:    boolVal(data, "is_active"),
		SortOrder:   intVal(data, "sort_order"),
	}
	return db.Create(&p).Error
}
