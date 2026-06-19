package handler

import (
	"pt-server/internal/config"
	"pt-server/internal/repository"
	"pt-server/internal/tracker"
)

type Handler struct {
	repo      *repository.Repository
	peerStore *tracker.PeerStore
	cfg       *config.Config
}

func New(repo *repository.Repository, ps *tracker.PeerStore, cfg *config.Config) *Handler {
	return &Handler{repo: repo, peerStore: ps, cfg: cfg}
}
