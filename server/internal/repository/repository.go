package repository

import "gorm.io/gorm"

type Repository struct {
	db              *gorm.DB
	User            *UserRepo
	Torrent         *TorrentRepo
	Snatch          *SnatchRepo
	Bookmark        *BookmarkRepo
	Comment         *CommentRepo
	Offer           *OfferRepo
	OfferVote       *OfferVoteRepo
	Attendance      *AttendanceRepo
	Thanks          *ThanksRepo
	News            *NewsRepo
	Subtitle        *SubtitleRepo
	Message         *MessageRepo
	Invite          *InviteRepo
	Report          *ReportRepo
	Achievement     *AchievementRepo
	UserAchievement *UserAchievementRepo
	Medal           *MedalRepo
	UserMedal       *UserMedalRepo
	DictType        *DictTypeRepo
	DictData        *DictDataRepo
	I18n            *I18nRepo
	Level           *LevelRepo
	Role            *RoleRepo
	Permission      *PermissionRepo
	SiteSetting     *SiteSettingRepo
	Announcement    *AnnouncementRepo
	BonusLog        *BonusLogRepo
	Forum           *ForumRepo
	Topic           *TopicRepo
	Post            *PostRepo
	ReadPost        *ReadPostRepo
	ShopItem        *ShopItemRepo
	UserItem        *UserItemRepo
	LuckyDrawPrize  *LuckyDrawPrizeRepo
	LuckyDrawRecord *LuckyDrawRecordRepo
	GameBet         *GameBetRepo
}

func (r *Repository) DB() *gorm.DB {
	return r.db
}

func New(db *gorm.DB) *Repository {
	return &Repository{db: db,
		User:            NewUserRepo(db),
		Torrent:         NewTorrentRepo(db),
		Snatch:          NewSnatchRepo(db),
		Bookmark:        NewBookmarkRepo(db),
		Comment:         NewCommentRepo(db),
		Offer:           NewOfferRepo(db),
		OfferVote:       NewOfferVoteRepo(db),
		Attendance:      NewAttendanceRepo(db),
		Thanks:          NewThanksRepo(db),
		News:            NewNewsRepo(db),
		Subtitle:        NewSubtitleRepo(db),
		Message:         NewMessageRepo(db),
		Invite:          NewInviteRepo(db),
		Report:          NewReportRepo(db),
		Achievement:     NewAchievementRepo(db),
		UserAchievement: NewUserAchievementRepo(db),
		Medal:           NewMedalRepo(db),
		UserMedal:       NewUserMedalRepo(db),
		DictType:        NewDictTypeRepo(db),
		DictData:        NewDictDataRepo(db),
		I18n:            NewI18nRepo(db),
		Level:           NewLevelRepo(db),
		Role:            NewRoleRepo(db),
		Permission:      NewPermissionRepo(db),
		SiteSetting:     NewSiteSettingRepo(db),
		Announcement:    NewAnnouncementRepo(db),
		BonusLog:        NewBonusLogRepo(db),
		Forum:           NewForumRepo(db),
		Topic:           NewTopicRepo(db),
		Post:            NewPostRepo(db),
		ReadPost:        NewReadPostRepo(db),
		ShopItem:        NewShopItemRepo(db),
		UserItem:        NewUserItemRepo(db),
		LuckyDrawPrize:  NewLuckyDrawPrizeRepo(db),
		LuckyDrawRecord: NewLuckyDrawRecordRepo(db),
		GameBet:         NewGameBetRepo(db),
	}
}
