package main

import (
	"log"
	"time"

	"pt-server/internal/bonus"
	"pt-server/internal/config"
	"pt-server/internal/handler"
	i18n "pt-server/internal/i18n"
	"pt-server/internal/middleware"
	"pt-server/internal/repository"
	"pt-server/internal/siteconfig"
	"pt-server/internal/tracker"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	db, err := repository.NewDB(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	if err := repository.ValidateSchema(db); err != nil {
		log.Fatalf("Database schema validation failed: %v", err)
	}

	repo := repository.New(db)
	siteCfg := siteconfig.NewDefault()
	if err := siteconfig.Bootstrap(repo, siteCfg); err != nil {
		log.Fatalf("Failed to bootstrap site settings: %v", err)
	}
	if err := siteCfg.Reload(repo); err != nil {
		log.Fatalf("Failed to load site settings: %v", err)
	}

	peerStore := tracker.NewPeerStore(siteCfg.Tracker.PeerTTL)
	go peerStore.CleanupLoop(
		func() time.Duration { return siteCfg.TrackerSnapshot().CleanupInterval },
		func() time.Duration { return siteCfg.TrackerSnapshot().PeerTTL },
	)
	go bonus.HarvestLoop(repo, siteCfg)

	h := handler.New(repo, peerStore, cfg, siteCfg)
	mw := middleware.New(cfg, repo)

	r := gin.Default()
	r.Use(i18n.CORSMiddleware())
	r.Use(i18n.LangMiddleware())

	api := r.Group("/api")
	api.Use(middleware.NoCache())
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", h.Register)
			auth.POST("/login", h.Login)
		}

		torrents := api.Group("/torrents")
		torrents.Use(mw.Auth())
		{
			torrents.GET("", h.ListTorrents)
			torrents.GET("/:id", h.GetTorrent)
			torrents.POST("", h.UploadTorrent)
			torrents.GET("/:id/download", h.DownloadTorrent)
			torrents.GET("/:id/peers", h.ListPeers)
			torrents.GET("/:id/bookmark", h.CheckBookmark)
			torrents.POST("/:id/bookmark", h.AddBookmark)
			torrents.DELETE("/:id/bookmark", h.RemoveBookmark)

			// Comments
			torrents.GET("/:id/comments", h.ListComments)
			torrents.POST("/:id/comments", h.CreateComment)

			// Thanks
			torrents.POST("/:id/thanks", h.ThankTorrent)
			torrents.GET("/:id/thanks", h.ThanksCount)
			torrents.GET("/:id/thanks/check", h.CheckThanks)

			// Subtitles
			torrents.GET("/:id/subtitles", h.ListSubtitles)
			torrents.POST("/:id/subtitles", h.UploadSubtitle)

			torrents.PUT("/:id", h.EditTorrent)
			torrents.DELETE("/:id", h.DeleteTorrent)
		}
		api.DELETE("/comments/:commentId", h.DeleteComment)
		api.GET("/subtitles/:subId/download", h.DownloadSubtitle)
		api.DELETE("/subtitles/:subId", h.DeleteSubtitle)

		user := api.Group("/user")
		user.Use(mw.Auth())
		{
			user.GET("/profile", h.GetProfile)
			user.GET("/snatches", h.GetSnatches)
			user.GET("/seeding", h.GetSeeding)
			user.PUT("/password", h.UpdatePassword)
			user.GET("/bookmarks", h.ListBookmarks)
			user.POST("/buy-upload", h.BuyUpload)
			user.GET("/checkin", h.CheckinStatus)
			user.POST("/checkin", h.Checkin)
			user.GET("/bonus-logs", h.ListUserBonusLogs)
			user.GET("/seed-bonus-rate", h.GetSeedBonusRate)
			user.POST("/buy-download", h.BuyDownload)
			user.GET("/items", h.ListMyItems)
			user.GET("/lucky-draw-records", h.ListMyDrawRecords)
			user.GET("/bets", h.ListMyBets)
		}

		shop := api.Group("/shop")
		shop.Use(mw.Auth())
		{
			shop.GET("/items", h.ListShopItems)
			shop.POST("/items/:id/buy", h.BuyShopItem)
		}

		// Lucky Draw & Games
		api.GET("/lucky-draw/prizes", mw.Auth(), h.ListLuckyDrawPrizes)
		api.POST("/lucky-draw/draw", mw.Auth(), h.LuckyDraw)

		api.POST("/games/bet", mw.Auth(), h.PlaceBet)

		offers := api.Group("/offers")
		offers.Use(mw.Auth())
		{
			offers.GET("", h.ListOffers)
			offers.POST("", h.CreateOffer)
			offers.GET("/:id", h.GetOffer)
			offers.DELETE("/:id", h.DeleteOffer)
			offers.POST("/:id/vote", h.VoteOffer)
			offers.GET("/:id/votes", h.ListOfferVotes)
		}

		api.GET("/news", h.ListNews)

		// Messages
		messages := api.Group("/messages")
		messages.Use(mw.Auth())
		{
			messages.GET("/inbox", h.ListInbox)
			messages.GET("/outbox", h.ListOutbox)
			messages.POST("", h.SendMessage)
			messages.GET("/:id", h.ReadMessage)
			messages.DELETE("/:id", h.DeleteMessage)
		}

		// Invites
		invites := api.Group("/invites")
		invites.Use(mw.Auth())
		{
			invites.GET("", h.ListInvites)
			invites.POST("", h.CreateInvite)
		}
		api.POST("/auth/register-with-invite", h.RegisterWithInvite)

		// Public dict data (no auth required)
		api.GET("/dict-data", h.ListDictDataPublic)

		// Reports
		api.POST("/reports", mw.Auth(), h.CreateReport)

		// Medals
		api.GET("/medals", h.ListMedals)
		api.POST("/medals/:id/buy", mw.Auth(), h.BuyMedal)
		api.GET("/user/medals", mw.Auth(), h.ListUserMedals)

		// H&R
		api.GET("/user/hr", mw.Auth(), h.ListHR)

		// Forums
		forum := api.Group("/forums")
		forum.Use(mw.Auth())
		{
			forum.GET("", h.ListForums)
			forum.GET("/recent", h.ListRecentTopics)
			forum.GET("/search", h.SearchTopics)
			forum.GET("/unread", h.ListUnreadTopics)
			forum.GET("/:id/topics", h.ListForumTopics)
			forum.POST("/topics", h.CreateTopic)
			forum.GET("/topics/:id", h.GetTopic)
			forum.GET("/topics/:id/posts", h.ListTopicPosts)
			forum.POST("/topics/:id/posts", h.CreatePost)
			forum.PUT("/topics/:id", h.UpdateTopic)
			forum.DELETE("/topics/:id", h.DeleteTopic)
			forum.PUT("/posts/:id", h.UpdatePost)
			forum.DELETE("/posts/:id", h.DeletePost)
		}

		admin := api.Group("/admin")
		admin.Use(mw.Auth(), mw.Admin())
		{
			admin.GET("/dashboard", h.AdminDashboard)
			admin.GET("/client-risk", h.AdminClientRisk)
			admin.GET("/resources", h.AdminResources)

			admin.GET("/users", h.AdminListUsers)
			admin.PUT("/users/:id/role", h.AdminUpdateUserRole)
			admin.PUT("/users/:id/status", h.AdminUpdateUserStatus)
			admin.PUT("/users/:id/traffic", h.AdminUpdateUserTraffic)
			admin.POST("/users/:id/reset-passkey", h.AdminResetPasskey)

			admin.GET("/dict-types", h.ListDictTypes)
			admin.POST("/dict-types", h.CreateDictType)
			admin.PUT("/dict-types/:id", h.UpdateDictType)
			admin.DELETE("/dict-types/:id", h.DeleteDictType)

			admin.GET("/dict-data", h.ListDictData)
			admin.POST("/dict-data", h.CreateDictData)
			admin.PUT("/dict-data/:id", h.UpdateDictData)
			admin.DELETE("/dict-data/:id", h.DeleteDictData)

			admin.GET("/levels", h.ListLevels)
			admin.POST("/levels", h.CreateLevel)
			admin.PUT("/levels/:id", h.UpdateLevel)
			admin.DELETE("/levels/:id", h.DeleteLevel)

			admin.POST("/offers/:id/allow", h.AdminAllowOffer)
			admin.POST("/offers/:id/deny", h.AdminDenyOffer)

			admin.POST("/news", h.CreateNews)
			admin.DELETE("/news/:id", h.DeleteNews)

			admin.PUT("/torrents/:id/promotion", h.AdminUpdatePromotion)
			admin.POST("/torrents/promotion/batch", h.AdminBatchUpdatePromotion)
			admin.GET("/reports", h.ListReports)
			admin.POST("/reports/:id/resolve", h.ResolveReport)
			admin.POST("/medals", h.CreateMedal)
			admin.DELETE("/medals/:id", h.DeleteMedal)

			// Roles & Permissions
			admin.GET("/roles", h.ListRoles)
			admin.GET("/roles/:id", h.GetRole)
			admin.POST("/roles", h.CreateRole)
			admin.PUT("/roles/:id", h.UpdateRole)
			admin.DELETE("/roles/:id", h.DeleteRole)
			admin.PUT("/roles/:id/permissions", h.SetRolePermissions)
			admin.GET("/permissions", h.ListPermissions)

			// Site Settings
			admin.GET("/settings", h.ListSiteSettings)
			admin.PUT("/settings/:key", h.UpdateSiteSetting)

			// Announcements
			admin.GET("/announcements", h.ListAnnouncements)
			admin.POST("/announcements", h.CreateAnnouncement)
			admin.PUT("/announcements/:id", h.UpdateAnnouncement)
			admin.DELETE("/announcements/:id", h.DeleteAnnouncement)

			// Bonus Logs
			admin.GET("/bonus-logs", h.AdminListBonusLogs)

			// Forum Management
			admin.GET("/forums", h.AdminListForums)
			admin.POST("/forums", h.AdminCreateForum)
			admin.PUT("/forums/:id", h.AdminUpdateForum)
			admin.DELETE("/forums/:id", h.AdminDeleteForum)
		}
	}

	api.GET("/announcements", h.ListActiveAnnouncements)
	api.GET("/i18n", h.QueryI18n)

	r.GET("/announce", h.Announce)
	r.GET("/scrape", h.Scrape)

	r.Run(cfg.ListenAddr)
}
