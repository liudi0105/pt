package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type I18nRepo struct {
	db *gorm.DB
}

func NewI18nRepo(db *gorm.DB) *I18nRepo {
	return &I18nRepo{db: db}
}

func (r *I18nRepo) Save(key, locale, value string) error {
	return r.db.Where("key = ? AND locale = ?", key, locale).
		Assign(model.I18n{Value: value}).
		FirstOrCreate(&model.I18n{Key: key, Locale: locale}).Error
}

func (r *I18nRepo) SaveMap(keyPrefix string, i18n map[string]map[string]string) error {
	for locale, fields := range i18n {
		for field, value := range fields {
			key := keyPrefix + "." + field
			if err := r.Save(key, locale, value); err != nil {
				return err
			}
		}
	}
	return nil
}

func (r *I18nRepo) LoadByKeys(keys []string) ([]model.I18n, error) {
	if len(keys) == 0 {
		return nil, nil
	}
	var entries []model.I18n
	err := r.db.Where("key IN ?", keys).Find(&entries).Error
	return entries, err
}

func (r *I18nRepo) LoadByPrefix(prefix string) ([]model.I18n, error) {
	var entries []model.I18n
	err := r.db.Where("key LIKE ?", prefix+"%").Find(&entries).Error
	return entries, err
}

func (r *I18nRepo) DeleteByPrefix(prefix string) error {
	return r.db.Where("key LIKE ?", prefix+"%").Delete(&model.I18n{}).Error
}

func GroupByKey(entries []model.I18n) map[string]map[string]string {
	result := make(map[string]map[string]string)
	for _, e := range entries {
		if result[e.Key] == nil {
			result[e.Key] = make(map[string]string)
		}
		result[e.Key][e.Locale] = e.Value
	}
	return result
}
