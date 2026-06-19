package repository

import "gorm.io/gorm"

type Repository struct {
	User        *UserRepo
	Torrent     *TorrentRepo
	Snatch      *SnatchRepo
	Bookmark    *BookmarkRepo
	Comment     *CommentRepo
	Offer       *OfferRepo
	OfferVote   *OfferVoteRepo
	Attendance  *AttendanceRepo
	Thanks      *ThanksRepo
	News        *NewsRepo
	Subtitle    *SubtitleRepo
	Message     *MessageRepo
	Invite      *InviteRepo
	Report      *ReportRepo
	Medal       *MedalRepo
	UserMedal   *UserMedalRepo
	DictType    *DictTypeRepo
	DictData    *DictDataRepo
	Level       *LevelRepo
	Role        *RoleRepo
	Permission  *PermissionRepo
	SiteSetting *SiteSettingRepo
}

func New(db *gorm.DB) *Repository {
	return &Repository{
		User:        NewUserRepo(db),
		Torrent:     NewTorrentRepo(db),
		Snatch:      NewSnatchRepo(db),
		Bookmark:    NewBookmarkRepo(db),
		Comment:     NewCommentRepo(db),
		Offer:       NewOfferRepo(db),
		OfferVote:   NewOfferVoteRepo(db),
		Attendance:  NewAttendanceRepo(db),
		Thanks:      NewThanksRepo(db),
		News:        NewNewsRepo(db),
		Subtitle:    NewSubtitleRepo(db),
		Message:     NewMessageRepo(db),
		Invite:      NewInviteRepo(db),
		Report:      NewReportRepo(db),
		Medal:       NewMedalRepo(db),
		UserMedal:   NewUserMedalRepo(db),
		DictType:    NewDictTypeRepo(db),
		DictData:    NewDictDataRepo(db),
		Level:       NewLevelRepo(db),
		Role:        NewRoleRepo(db),
		Permission:  NewPermissionRepo(db),
		SiteSetting: NewSiteSettingRepo(db),
	}
}
