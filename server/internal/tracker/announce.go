package tracker

import (
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net"
	"net/http"
	"net/url"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
	"unicode"

	"pt-server/internal/model"
	"pt-server/internal/repository"
	"pt-server/internal/siteconfig"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AnnounceHandler struct {
	repo      *repository.Repository
	peerStore *PeerStore
	siteCfg   *siteconfig.Settings
}

var (
	duplicateMu     sync.Mutex
	duplicateHits   = map[string]time.Time{}
	duplicateWindow = 5 * time.Second
)

func NewAnnounceHandler(repo *repository.Repository, ps *PeerStore, siteCfg *siteconfig.Settings) *AnnounceHandler {
	return &AnnounceHandler{repo: repo, peerStore: ps, siteCfg: siteCfg}
}

func (h *AnnounceHandler) Handle(c *gin.Context) {
	passkey := strings.TrimSpace(c.Query("passkey"))
	if passkey == "" {
		c.String(http.StatusOK, bencodeError("passkey required"))
		return
	}

	user, err := h.repo.User.GetByPasskey(passkey)
	if err != nil {
		c.String(http.StatusOK, bencodeError("invalid passkey"))
		return
	}

	infoHashRaw, infoHashKey, err := parseInfoHash(c.Query("info_hash"))
	if err != nil {
		c.String(http.StatusOK, bencodeError("invalid info_hash"))
		return
	}

	if isDuplicateAnnounce(c.Request.URL.RawQuery) {
		c.String(http.StatusOK, bencodeError("duplicate announce"))
		return
	}

	torrent, err := h.repo.Torrent.GetByInfoHash(infoHashRaw)
	if err != nil {
		c.String(http.StatusOK, bencodeError("torrent not found"))
		return
	}

	peerID := c.Query("peer_id")
	if peerID == "" {
		c.String(http.StatusOK, bencodeError("peer_id required"))
		return
	}

	agent := strings.TrimSpace(c.GetHeader("User-Agent"))
	settings := h.currentSettings()
	if err := validateClient(agent, c.Request.Header, settings.AllowedClients); err != nil {
		c.String(http.StatusOK, bencodeError(err.Error()))
		return
	}

	ip := clientIP(c)
	port, err := strconv.Atoi(c.DefaultQuery("port", "0"))
	if err != nil || port < 1 || port > 65535 {
		c.String(http.StatusOK, bencodeError("invalid port"))
		return
	}
	if isBlacklistedPort(port, settings.BlacklistPorts) {
		c.String(http.StatusOK, bencodeError("port not allowed"))
		return
	}

	uploaded, _ := strconv.ParseInt(c.DefaultQuery("uploaded", "0"), 10, 64)
	downloaded, _ := strconv.ParseInt(c.DefaultQuery("downloaded", "0"), 10, 64)
	left, _ := strconv.ParseInt(c.DefaultQuery("left", "0"), 10, 64)
	event := c.DefaultQuery("event", "")
	numwant, _ := strconv.Atoi(c.DefaultQuery("numwant", "50"))
	if numwant <= 0 || numwant > 100 {
		numwant = settings.DefaultNumwant
	}

	now := time.Now()
	prevSnatch, prevErr := h.repo.Snatch.GetByUserAndTorrent(user.ID, torrent.ID)
	var seedTime int64
	var leechTime int64
	startedAt := now

	if prevErr == nil {
		seedTime = prevSnatch.SeedTime
		leechTime = prevSnatch.LeechTime
		if !prevSnatch.StartedAt.IsZero() {
			startedAt = prevSnatch.StartedAt
		}

		elapsed := now.Sub(prevSnatch.LastAnnounce)
		if elapsed < 0 {
			elapsed = 0
		}
		if prevSnatch.IsSeeding {
			seedTime += int64(elapsed.Seconds())
		} else {
			leechTime += int64(elapsed.Seconds())
		}
	} else if !errors.Is(prevErr, gorm.ErrRecordNotFound) {
		c.String(http.StatusOK, bencodeError("failed to load snatch"))
		return
	}

	isSeeding := left == 0
	var finishedAt *time.Time
	if isSeeding {
		finishedAt = &now
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
		IsSeeder:   isSeeding,
		LastSeen:   now,
	}

	snatch := &model.Snatch{
		UserID:       user.ID,
		TorrentID:    torrent.ID,
		Uploaded:     uploaded,
		Downloaded:   downloaded,
		Left:         left,
		IP:           ip,
		Port:         port,
		PeerID:       peerID,
		SeedTime:     seedTime,
		LeechTime:    leechTime,
		IsSeeding:    isSeeding,
		StartedAt:    startedAt,
		LastAnnounce: now,
		FinishedAt:   finishedAt,
	}

	var deltaUploaded int64 = uploaded
	var deltaDownloaded int64 = downloaded
	if prevErr == nil {
		deltaUploaded = uploaded - prevSnatch.Uploaded
		deltaDownloaded = downloaded - prevSnatch.Downloaded
	}
	if deltaUploaded < 0 {
		deltaUploaded = 0
	}
	if deltaDownloaded < 0 {
		deltaDownloaded = 0
	}

	if event == "completed" {
		snatch.FinishedAt = &now
		snatch.IsSeeding = true
		snatch.Left = 0
		peer.IsSeeder = true
	}

	if event == "stopped" {
		h.peerStore.Remove(infoHashKey, peerID, ip, port)
	} else {
		h.peerStore.Upsert(infoHashKey, peer)
	}

	if err := h.repo.Snatch.Upsert(snatch); err != nil {
		c.String(http.StatusOK, bencodeError("failed to update snatch"))
		return
	}

	if deltaUploaded > 0 || deltaDownloaded > 0 {
		_ = h.repo.User.UpdateTraffic(user.ID, deltaUploaded, deltaDownloaded)
	}

	if event == "completed" && (prevErr != nil || prevSnatch.FinishedAt == nil) {
		_ = h.repo.Torrent.IncrementCompleted(torrent.ID)
	}

	seeders, leechers := h.peerStore.Stats(infoHashKey)
	_ = h.repo.Torrent.UpdateStats(torrent.ID, seeders, leechers)

	peers := h.peerStore.GetPeers(infoHashKey, numwant, peerID)
	resp := map[string]any{
		"interval":     int(settings.Interval.Seconds()),
		"min interval": int(settings.MinInterval.Seconds()),
		"complete":     seeders,
		"incomplete":   leechers,
		"seeders":      seeders,
		"leechers":     leechers,
		"peers":        []byte(encodePeers(peers)),
	}

	c.String(http.StatusOK, bencodeValue(resp))
}

func (h *AnnounceHandler) Scrape(c *gin.Context) {
	hashes := c.QueryArray("info_hash")
	if len(hashes) == 0 {
		if single := c.Query("info_hash"); single != "" {
			hashes = []string{single}
		}
	}

	files := make(map[string]any, len(hashes))
	for _, rawQuery := range hashes {
		infoHashRaw, _, err := parseInfoHash(rawQuery)
		if err != nil {
			c.String(http.StatusOK, bencodeError("invalid info_hash"))
			return
		}

		torrent, err := h.repo.Torrent.GetByInfoHash(infoHashRaw)
		if err != nil {
			continue
		}

		files[string(infoHashRaw)] = map[string]any{
			"complete":   torrent.Seeders,
			"incomplete": torrent.Leechers,
			"downloaded": torrent.Completed,
		}
	}

	c.String(http.StatusOK, bencodeValue(map[string]any{
		"files": files,
	}))
}

func (h *AnnounceHandler) ReloadFromSiteSettings() error {
	if h.siteCfg == nil {
		return nil
	}
	return h.siteCfg.Reload(h.repo)
}

func (h *AnnounceHandler) ApplySiteSetting(key, value string) {
	if h.siteCfg == nil {
		return
	}
	h.siteCfg.ApplySiteSetting(key, value)
}

func (h *AnnounceHandler) currentSettings() siteconfig.TrackerSettings {
	if h.siteCfg == nil {
		return siteconfig.TrackerSettings{}
	}
	return h.siteCfg.TrackerSnapshot()
}

func parseInfoHash(value string) ([]byte, string, error) {
	switch len(value) {
	case 20:
		raw := []byte(value)
		return raw, hex.EncodeToString(raw), nil
	case 40:
		raw, err := hex.DecodeString(value)
		if err != nil {
			return nil, "", err
		}
		return raw, value, nil
	default:
		return nil, "", fmt.Errorf("invalid info hash length")
	}
}

func isDuplicateAnnounce(rawQuery string) bool {
	duplicateMu.Lock()
	defer duplicateMu.Unlock()

	now := time.Now()
	for key, seen := range duplicateHits {
		if now.Sub(seen) > duplicateWindow {
			delete(duplicateHits, key)
		}
	}

	if rawQuery == "" {
		return false
	}

	if seen, ok := duplicateHits[rawQuery]; ok && now.Sub(seen) <= duplicateWindow {
		return true
	}

	duplicateHits[rawQuery] = now
	return false
}

func validateClient(agent string, headers http.Header, allowed []string) error {
	if agent == "" {
		return errors.New("user-agent required")
	}

	if looksLikeBrowser(agent) {
		return errors.New("browser clients are not allowed")
	}

	if headers.Get("Accept-Language") != "" || headers.Get("Referer") != "" || headers.Get("Accept-Charset") != "" || headers.Get("Want-Digest") != "" {
		return errors.New("browser headers are not allowed")
	}

	if len(allowed) == 0 {
		return nil
	}

	for _, item := range allowed {
		item = strings.TrimSpace(item)
		if item == "" {
			continue
		}
		if strings.Contains(strings.ToLower(agent), strings.ToLower(item)) {
			return nil
		}
	}

	return errors.New("client is not allowed")
}

func parseAllowedClients(value string) ([]string, error) {
	value = strings.TrimSpace(value)
	if value == "" {
		return nil, nil
	}

	var clients []string
	if err := json.Unmarshal([]byte(value), &clients); err == nil {
		return normalizeStrings(clients), nil
	}

	parts := strings.Split(value, ",")
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part != "" {
			clients = append(clients, part)
		}
	}
	if len(clients) == 0 {
		return nil, fmt.Errorf("invalid allowed clients format")
	}
	return normalizeStrings(clients), nil
}

func parseBlacklistPorts(value string) ([]int, error) {
	value = strings.TrimSpace(value)
	if value == "" {
		return nil, nil
	}

	var ports []int
	if err := json.Unmarshal([]byte(value), &ports); err == nil {
		return normalizePorts(ports), nil
	}

	parts := strings.Split(value, ",")
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part == "" {
			continue
		}
		port, err := strconv.Atoi(part)
		if err != nil {
			return nil, err
		}
		ports = append(ports, port)
	}
	if len(ports) == 0 {
		return nil, fmt.Errorf("invalid blacklist ports format")
	}
	return normalizePorts(ports), nil
}

func normalizeStrings(values []string) []string {
	out := make([]string, 0, len(values))
	seen := make(map[string]struct{}, len(values))
	for _, v := range values {
		v = strings.TrimSpace(v)
		if v == "" {
			continue
		}
		key := strings.ToLower(v)
		if _, ok := seen[key]; ok {
			continue
		}
		seen[key] = struct{}{}
		out = append(out, v)
	}
	return out
}

func normalizePorts(values []int) []int {
	out := make([]int, 0, len(values))
	seen := make(map[int]struct{}, len(values))
	for _, v := range values {
		if v <= 0 || v > 65535 {
			continue
		}
		if _, ok := seen[v]; ok {
			continue
		}
		seen[v] = struct{}{}
		out = append(out, v)
	}
	return out
}

func looksLikeBrowser(agent string) bool {
	lower := strings.ToLower(agent)
	return strings.Contains(lower, "mozilla/") ||
		strings.Contains(lower, "chrome/") ||
		strings.Contains(lower, "safari/") ||
		strings.Contains(lower, "firefox/") ||
		strings.Contains(lower, "edge/") ||
		strings.Contains(lower, "opera")
}

func isBlacklistedPort(port int, blacklist []int) bool {
	for _, denied := range blacklist {
		if port == denied {
			return true
		}
	}
	return false
}

func clientIP(c *gin.Context) string {
	if forwarded := c.GetHeader("X-Forwarded-For"); forwarded != "" {
		parts := strings.Split(forwarded, ",")
		if len(parts) > 0 {
			ip := strings.TrimSpace(parts[0])
			if ip != "" {
				return ip
			}
		}
	}
	if ip := strings.TrimSpace(c.ClientIP()); ip != "" {
		return ip
	}
	return "0.0.0.0"
}

func bencodeError(msg string) string {
	return bencodeValue(map[string]any{
		"failure reason": msg,
	})
}

func bencodeValue(v any) string {
	switch t := v.(type) {
	case nil:
		return "0:"
	case string:
		return fmt.Sprintf("%d:%s", len(t), t)
	case []byte:
		return fmt.Sprintf("%d:%s", len(t), string(t))
	case int:
		return fmt.Sprintf("i%de", t)
	case int64:
		return fmt.Sprintf("i%de", t)
	case uint:
		return fmt.Sprintf("i%de", t)
	case uint64:
		return fmt.Sprintf("i%de", t)
	case bool:
		if t {
			return "i1e"
		}
		return "i0e"
	case map[string]any:
		keys := make([]string, 0, len(t))
		for k := range t {
			keys = append(keys, k)
		}
		sort.Strings(keys)

		var b strings.Builder
		b.WriteByte('d')
		for _, k := range keys {
			b.WriteString(bencodeValue(k))
			b.WriteString(bencodeValue(t[k]))
		}
		b.WriteByte('e')
		return b.String()
	case []any:
		var b strings.Builder
		b.WriteByte('l')
		for _, item := range t {
			b.WriteString(bencodeValue(item))
		}
		b.WriteByte('e')
		return b.String()
	default:
		if stringer, ok := any(v).(fmt.Stringer); ok {
			return bencodeValue(stringer.String())
		}
	}
	return ""
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

func decodeInfoHashQuery(value string) (string, error) {
	if value == "" {
		return "", errors.New("empty")
	}
	if len(value) == 20 {
		return value, nil
	}
	if len(value) == 40 {
		if _, err := hex.DecodeString(value); err != nil {
			return "", err
		}
		return value, nil
	}
	if decoded, err := url.QueryUnescape(value); err == nil && len(decoded) == 20 {
		return decoded, nil
	}
	return "", errors.New("invalid")
}

func sanitizeAgent(agent string) string {
	if agent == "" {
		return ""
	}
	var b strings.Builder
	for _, r := range agent {
		if r == '\n' || r == '\r' || unicode.IsControl(r) {
			continue
		}
		b.WriteRune(r)
	}
	return strings.TrimSpace(b.String())
}
