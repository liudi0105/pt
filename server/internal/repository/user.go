package repository

import (
	"pt-server/internal/model"

	"gorm.io/gorm"
)

type UserRepo struct {
	db *gorm.DB
}

func NewUserRepo(db *gorm.DB) *UserRepo {
	return &UserRepo{db: db}
}

func (r *UserRepo) Create(u *model.User) error {
	return r.db.Create(u).Error
}

func (r *UserRepo) GetByID(id int64) (*model.User, error) {
	var u model.User
	err := r.db.First(&u, id).Error
	return &u, err
}

func (r *UserRepo) GetByUsername(username string) (*model.User, error) {
	var u model.User
	err := r.db.Where("username = ?", username).First(&u).Error
	return &u, err
}

func (r *UserRepo) GetByPasskey(passkey string) (*model.User, error) {
	var u model.User
	err := r.db.Where("passkey = ?", passkey).First(&u).Error
	return &u, err
}

type UserFilter struct {
	Role     string
	Status   int
	Keyword  string
	Page     int
	PageSize int
}

type UserListResult struct {
	Users []model.User `json:"users"`
	Total int          `json:"total"`
}

func (r *UserRepo) List(f UserFilter) (*UserListResult, error) {
	if f.Page < 1 {
		f.Page = 1
	}
	if f.PageSize < 1 || f.PageSize > 100 {
		f.PageSize = 20
	}

	query := r.db.Model(&model.User{})
	if f.Role != "" {
		query = query.Where("role = ?", f.Role)
	}
	if f.Status != 0 {
		query = query.Where("status = ?", f.Status)
	}
	if f.Keyword != "" {
		query = query.Where("username LIKE ? OR email LIKE ?", "%"+f.Keyword+"%", "%"+f.Keyword+"%")
	}

	var total int64
	query.Count(&total)

	var users []model.User
	err := query.Order("id DESC").
		Limit(f.PageSize).
		Offset((f.Page-1)*f.PageSize).
		Find(&users).Error
	if err != nil {
		return nil, err
	}

	return &UserListResult{Users: users, Total: int(total)}, nil
}

func (r *UserRepo) UpdateRole(id int64, role model.Role) error {
	return r.db.Model(&model.User{}).Where("id = ?", id).Update("role", role).Error
}

func (r *UserRepo) UpdateStatus(id int64, status int) error {
	return r.db.Model(&model.User{}).Where("id = ?", id).Update("status", status).Error
}

func (r *UserRepo) UpdateTraffic(id int64, uploaded, downloaded int64) error {
	return r.db.Model(&model.User{}).Where("id = ?", id).Updates(map[string]interface{}{
		"upload_bytes":   gorm.Expr("upload_bytes + ?", uploaded),
		"download_bytes": gorm.Expr("download_bytes + ?", downloaded),
	}).Error
}

func (r *UserRepo) UpdateBonus(id int64, bonus float64) error {
	return r.db.Model(&model.User{}).Where("id = ?", id).Update("bonus", bonus).Error
}

func (r *UserRepo) ResetPasskey(id int64, passkey string) error {
	return r.db.Model(&model.User{}).Where("id = ?", id).Update("passkey", passkey).Error
}

func (r *UserRepo) UpdatePassword(id int64, hash string) error {
	return r.db.Model(&model.User{}).Where("id = ?", id).Update("password_hash", hash).Error
}

func (r *UserRepo) AddBonus(id int64, delta float64) error {
	return r.db.Model(&model.User{}).Where("id = ?", id).
		UpdateColumn("bonus", gorm.Expr("bonus + ?", delta)).Error
}

func (r *UserRepo) UpdateRoleID(id int64, roleID int64) error {
	return r.db.Model(&model.User{}).Where("id = ?", id).Update("role_id", roleID).Error
}

func (r *UserRepo) AddUpload(id int64, bytes int64) error {
	return r.db.Model(&model.User{}).Where("id = ?", id).
		UpdateColumn("upload_bytes", gorm.Expr("upload_bytes + ?", bytes)).Error
}
