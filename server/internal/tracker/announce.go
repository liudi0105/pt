package tracker

import (
	"crypto/sha1"
	"fmt"
	"net"
	"net/http"
	"strconv"
	"time"

	"pt-server/internal/config"
	"pt-server/internal/model"
	"pt-server/internal/repository"

	"github.com/gin-gonic/gin"
)

type AnnounceHandler struct {
	repo      *repository.Repository
	peerStore *PeerStore
	cfg       *config.Config
}

func NewAnnounceHandler(repo *repository.Repository, ps *PeerStore, cfg *config.Config) *AnnounceHandler {
	return &AnnounceHandler{repo: repo, peerStore: ps, cfg: cfg}
}

func (h *AnnounceHandler) Handle(c *gin.Context) {
	passkey := c.Query("passkey")
	if passkey == "" {
		c.String(http.StatusOK, bencodeError("passkey required"))
		return
	}

	user, err := h.repo.User.GetByPasskey(passkey)
	if err != nil {
		c.String(http.StatusOK, bencodeError("invalid passkey"))
		return
	}

	infoHashHex := c.Query("info_hash")
	if len(infoHashHex) != 40 {
		c.String(http.StatusOK, bencodeError("invalid info_hash"))
		return
	}

	var infoHash [20]byte
	hx, _ := hexDecode(infoHashHex)
	copy(infoHash[:], hx)

	torrent, err := h.repo.Torrent.GetByID(0)
	if err != nil {
		c.String(http.StatusOK, bencodeError("torrent not found"))
		return
	}
	_ = torrent

	peerID := c.Query("peer_id")
	ip := c.ClientIP()
	if forwarded := c.GetHeader("X-Forwarded-For"); forwarded != "" {
		ip = forwarded
	}
	port, _ := strconv.Atoi(c.DefaultQuery("port", "0"))
	uploaded, _ := strconv.ParseInt(c.DefaultQuery("uploaded", "0"), 10, 64)
	downloaded, _ := strconv.ParseInt(c.DefaultQuery("downloaded", "0"), 10, 64)
	left, _ := strconv.ParseInt(c.DefaultQuery("left", "0"), 10, 64)
	event := c.DefaultQuery("event", "")
	numwant, _ := strconv.Atoi(c.DefaultQuery("numwant", "50"))
	if numwant <= 0 || numwant > 100 {
		numwant = h.cfg.Tracker.DefaultNumwant
	}

	peer := &model.Peer{
		UserID:     user.ID,
		PeerID:     peerID,
		IP:         ip,
		Port:       port,
		Uploaded:   uploaded,
		Downloaded: downloaded,
		Left:       left,
		Event:      event,
		IsSeeder:   left == 0,
		LastSeen:   time.Now(),
	}

	h.peerStore.Upsert(infoHashHex, peer)

	if diffUploaded > 0 || diffDownloaded > 0 {
		h.repo.User.UpdateTraffic(user.ID, diffUploaded, diffDownloaded)
	}

	snatch := &model.Snatch{
		UserID:     user.ID,
		TorrentID:  torrentID,
		Uploaded:   uploaded,
		Downloaded: downloaded,
		Left:       left,
		IP:         ip,
		Port:       port,
		PeerID:     peerID,
		IsSeeding:  left == 0,
	}
	if left == 0 {
		now := time.Now()
		snatch.FinishedAt = &now
		h.repo.Torrent.IncrementCompleted(torrentID)
	}
	h.repo.Snatch.Upsert(snatch)

	seeders, leechers := h.peerStore.Stats(infoHashHex)
	h.repo.Torrent.UpdateStats(torrentID, seeders, leechers)

	peers := h.peerStore.GetPeers(infoHashHex, numwant, peerID)

	resp := map[string]interface{}{
		"interval":      int(h.cfg.Tracker.Interval.Seconds()),
		"min interval":  int(h.cfg.Tracker.MinInterval.Seconds()),
		"seeders":       seeders,
		"leechers":      leechers,
		"complete":      h.peerStore.GetComplete(infoHashHex),
		"peers":         encodePeers(peers),
	}

	c.String(http.StatusOK, bencodeEncode(resp))
}

func hexEncode(b []byte) string {
	return fmt.Sprintf("%x", b)

}

func hexDecode(s string) ([]byte, error) {
	var b []byte
	_, err := fmt.Sscanf(s, "%x", &b)
	return b, err
}

var hx []byte
var h = sha1.New()
var diffUploaded, diffDownloaded int64
var torrentID int64 = 1

func bencodeError(msg string) string {
	return fmt.Sprintf("d14:failure reason%d:%se", len(msg), msg)
}

func bencodeEncode(v map[string]interface{}) string {
	// simple bencode encoder for tracker response
	result := "d"
	for k, val := range v {
		result += fmt.Sprintf("%d:%s", len(k), k)
		switch t := val.(type) {
		case int:
			result += fmt.Sprintf("i%de", t)
		case string:
			result += fmt.Sprintf("%d:%s", len(t), t)
		case []byte:
			result += fmt.Sprintf("%d:", len(t))
			result += string(t)
		}
	}
	result += "e"
	return result
}

func encodePeers(peers []*model.Peer) string {
	if len(peers) == 0 {
		return ""
	}
	buf := make([]byte, 0, len(peers)*6)
	for _, p := range peers {
		ip := net.ParseIP(p.IP)
		if ip == nil {
			continue
		}
		ip4 := ip.To4()
		if ip4 == nil {
			continue
		}
		buf = append(buf, ip4...)
		buf = append(buf, byte(p.Port>>8), byte(p.Port))
	}
	return string(buf)
}
