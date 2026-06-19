package handler

import (
	"pt-server/internal/config"
	"pt-server/internal/repository"
	"pt-server/internal/siteconfig"
	"pt-server/internal/tracker"
)

type Handler struct {
	repo      *repository.Repository
	peerStore *tracker.PeerStore
	cfg       *config.Config
	siteCfg   *siteconfig.Settings
	tracker   *tracker.AnnounceHandler
}

func New(repo *repository.Repository, ps *tracker.PeerStore, cfg *config.Config, siteCfg *siteconfig.Settings) *Handler {
	return &Handler{
		repo:      repo,
		peerStore: ps,
		cfg:       cfg,
		siteCfg:   siteCfg,
		tracker:   tracker.NewAnnounceHandler(repo, ps, siteCfg),
	}
}

func (h *Handler) ReloadTrackerSettings() error {
	if h.siteCfg == nil {
		return nil
	}
	return h.siteCfg.Reload(h.repo)
}
