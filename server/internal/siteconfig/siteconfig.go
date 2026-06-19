package siteconfig

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"sync"
	"time"

	"pt-server/internal/model"
	"pt-server/internal/repository"
)

const (
	KeySiteName           = "site_name"
	KeyTrackerInterval    = "tracker.interval"
	KeyTrackerMinInterval = "tracker.min_interval"
	KeyTrackerCleanup     = "tracker.cleanup_interval"
	KeyTrackerPeerTTL     = "tracker.peer_ttl"
	KeyTrackerDefaultNum  = "tracker.default_numwant"
	KeyTrackerAllowed     = "tracker.allowed_clients"
	KeyTrackerBlacklist   = "tracker.blacklist_ports"
	KeyBonusPerHour       = "bonus.per_hour"
	KeyBonusSeedBonus     = "bonus.seed_bonus"
	KeyBonusSizeBonus     = "bonus.size_bonus"
	KeyHREnabled          = "hr.enabled"
	KeyHRSeedHours        = "hr.seed_hours"
	KeyHRCheckInterval    = "hr.check_interval"
)

type Settings struct {
	mu       sync.RWMutex
	SiteName string
	Tracker  TrackerSettings
	Bonus    BonusSettings
	HR       HRSettings
}

type TrackerSettings struct {
	Interval        time.Duration
	MinInterval     time.Duration
	CleanupInterval time.Duration
	PeerTTL         time.Duration
	DefaultNumwant  int
	AllowedClients  []string
	BlacklistPorts  []int
}

type BonusSettings struct {
	PerHour   float64
	SeedBonus float64
	SizeBonus float64
}

type HRSettings struct {
	Enabled       bool
	SeedHours     int
	CheckInterval time.Duration
}

func NewDefault() *Settings {
	return &Settings{
		SiteName: "My PT Site",
		Tracker: TrackerSettings{
			Interval:        30 * time.Minute,
			MinInterval:     15 * time.Minute,
			CleanupInterval: 5 * time.Minute,
			PeerTTL:         35 * time.Minute,
			DefaultNumwant:  50,
			AllowedClients: []string{
				"qBittorrent",
				"Transmission",
				"Deluge",
				"BiglyBT",
				"rTorrent",
				"libtorrent",
				"aria2",
			},
			BlacklistPorts: []int{22, 53, 80, 81, 443},
		},
		Bonus: BonusSettings{
			PerHour:   1.0,
			SeedBonus: 0.5,
			SizeBonus: 0.1,
		},
		HR: HRSettings{
			Enabled:       true,
			SeedHours:     72,
			CheckInterval: 1 * time.Hour,
		},
	}
}

func Bootstrap(repo *repository.Repository, defaults *Settings) error {
	if defaults == nil {
		defaults = NewDefault()
	}

	for _, setting := range defaultSiteSettings(defaults) {
		if _, err := repo.SiteSetting.GetByKey(setting.Key); err != nil {
			if err := repo.SiteSetting.Upsert(&setting); err != nil {
				return err
			}
		}
	}
	return nil
}

func Load(repo *repository.Repository) (*Settings, error) {
	settings := NewDefault()

	if s, err := repo.SiteSetting.GetByKey(KeySiteName); err == nil && s.Value != "" {
		settings.SiteName = s.Value
	}

	if s, err := repo.SiteSetting.GetByKey(KeyTrackerInterval); err == nil {
		if d, parseErr := time.ParseDuration(s.Value); parseErr == nil {
			settings.Tracker.Interval = d
		}
	}
	if s, err := repo.SiteSetting.GetByKey(KeyTrackerMinInterval); err == nil {
		if d, parseErr := time.ParseDuration(s.Value); parseErr == nil {
			settings.Tracker.MinInterval = d
		}
	}
	if s, err := repo.SiteSetting.GetByKey(KeyTrackerCleanup); err == nil {
		if d, parseErr := time.ParseDuration(s.Value); parseErr == nil {
			settings.Tracker.CleanupInterval = d
		}
	}
	if s, err := repo.SiteSetting.GetByKey(KeyTrackerPeerTTL); err == nil {
		if d, parseErr := time.ParseDuration(s.Value); parseErr == nil {
			settings.Tracker.PeerTTL = d
		}
	}
	if s, err := repo.SiteSetting.GetByKey(KeyTrackerDefaultNum); err == nil {
		if n, parseErr := strconv.Atoi(s.Value); parseErr == nil && n > 0 {
			settings.Tracker.DefaultNumwant = n
		}
	}
	if s, err := repo.SiteSetting.GetByKey(KeyTrackerAllowed); err == nil {
		if parsed, parseErr := parseAllowedClients(s.Value); parseErr == nil && len(parsed) > 0 {
			settings.Tracker.AllowedClients = parsed
		}
	}
	if s, err := repo.SiteSetting.GetByKey(KeyTrackerBlacklist); err == nil {
		if parsed, parseErr := parseBlacklistPorts(s.Value); parseErr == nil && len(parsed) > 0 {
			settings.Tracker.BlacklistPorts = parsed
		}
	}

	if s, err := repo.SiteSetting.GetByKey(KeyBonusPerHour); err == nil {
		if v, parseErr := strconv.ParseFloat(s.Value, 64); parseErr == nil {
			settings.Bonus.PerHour = v
		}
	}
	if s, err := repo.SiteSetting.GetByKey(KeyBonusSeedBonus); err == nil {
		if v, parseErr := strconv.ParseFloat(s.Value, 64); parseErr == nil {
			settings.Bonus.SeedBonus = v
		}
	}
	if s, err := repo.SiteSetting.GetByKey(KeyBonusSizeBonus); err == nil {
		if v, parseErr := strconv.ParseFloat(s.Value, 64); parseErr == nil {
			settings.Bonus.SizeBonus = v
		}
	}

	if s, err := repo.SiteSetting.GetByKey(KeyHREnabled); err == nil {
		if v, parseErr := strconv.ParseBool(s.Value); parseErr == nil {
			settings.HR.Enabled = v
		}
	}
	if s, err := repo.SiteSetting.GetByKey(KeyHRSeedHours); err == nil {
		if v, parseErr := strconv.Atoi(s.Value); parseErr == nil {
			settings.HR.SeedHours = v
		}
	}
	if s, err := repo.SiteSetting.GetByKey(KeyHRCheckInterval); err == nil {
		if d, parseErr := time.ParseDuration(s.Value); parseErr == nil {
			settings.HR.CheckInterval = d
		}
	}

	return settings, nil
}

func (s *Settings) Reload(repo *repository.Repository) error {
	loaded, err := Load(repo)
	if err != nil {
		return err
	}

	s.mu.Lock()
	s.SiteName = loaded.SiteName
	s.Tracker = loaded.Tracker
	s.Bonus = loaded.Bonus
	s.HR = loaded.HR
	s.mu.Unlock()
	return nil
}

func (s *Settings) ApplySiteSetting(key, value string) {
	s.mu.Lock()
	defer s.mu.Unlock()

	switch key {
	case KeySiteName:
		if strings.TrimSpace(value) != "" {
			s.SiteName = value
		}
	case KeyTrackerInterval:
		if d, err := time.ParseDuration(value); err == nil {
			s.Tracker.Interval = d
		}
	case KeyTrackerMinInterval:
		if d, err := time.ParseDuration(value); err == nil {
			s.Tracker.MinInterval = d
		}
	case KeyTrackerCleanup:
		if d, err := time.ParseDuration(value); err == nil {
			s.Tracker.CleanupInterval = d
		}
	case KeyTrackerPeerTTL:
		if d, err := time.ParseDuration(value); err == nil {
			s.Tracker.PeerTTL = d
		}
	case KeyTrackerDefaultNum:
		if n, err := strconv.Atoi(value); err == nil && n > 0 {
			s.Tracker.DefaultNumwant = n
		}
	case KeyTrackerAllowed:
		if parsed, err := parseAllowedClients(value); err == nil && len(parsed) > 0 {
			s.Tracker.AllowedClients = parsed
		}
	case KeyTrackerBlacklist:
		if parsed, err := parseBlacklistPorts(value); err == nil && len(parsed) > 0 {
			s.Tracker.BlacklistPorts = parsed
		}
	case KeyBonusPerHour:
		if v, err := strconv.ParseFloat(value, 64); err == nil {
			s.Bonus.PerHour = v
		}
	case KeyBonusSeedBonus:
		if v, err := strconv.ParseFloat(value, 64); err == nil {
			s.Bonus.SeedBonus = v
		}
	case KeyBonusSizeBonus:
		if v, err := strconv.ParseFloat(value, 64); err == nil {
			s.Bonus.SizeBonus = v
		}
	case KeyHREnabled:
		if v, err := strconv.ParseBool(value); err == nil {
			s.HR.Enabled = v
		}
	case KeyHRSeedHours:
		if n, err := strconv.Atoi(value); err == nil {
			s.HR.SeedHours = n
		}
	case KeyHRCheckInterval:
		if d, err := time.ParseDuration(value); err == nil {
			s.HR.CheckInterval = d
		}
	}
}

func (s *Settings) TrackerSnapshot() TrackerSettings {
	s.mu.RLock()
	defer s.mu.RUnlock()

	out := s.Tracker
	out.AllowedClients = append([]string{}, s.Tracker.AllowedClients...)
	out.BlacklistPorts = append([]int{}, s.Tracker.BlacklistPorts...)
	return out
}

func (s *Settings) BonusSnapshot() BonusSettings {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.Bonus
}

func (s *Settings) HRSnapshot() HRSettings {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.HR
}

func defaultSiteSettings(s *Settings) []model.SiteSetting {
	allowedClients := append([]string{}, s.Tracker.AllowedClients...)
	blacklistPorts := make([]string, 0, len(s.Tracker.BlacklistPorts))
	for _, port := range s.Tracker.BlacklistPorts {
		blacklistPorts = append(blacklistPorts, strconv.Itoa(port))
	}

	return []model.SiteSetting{
		{Key: KeySiteName, Value: s.SiteName, Type: "string", Description: "站点名称", IsActive: true},
		{Key: KeyTrackerInterval, Value: s.Tracker.Interval.String(), Type: "duration", Description: "Tracker announce 间隔", IsActive: true},
		{Key: KeyTrackerMinInterval, Value: s.Tracker.MinInterval.String(), Type: "duration", Description: "Tracker 最小 announce 间隔", IsActive: true},
		{Key: KeyTrackerCleanup, Value: s.Tracker.CleanupInterval.String(), Type: "duration", Description: "Tracker 运行态清理间隔", IsActive: true},
		{Key: KeyTrackerPeerTTL, Value: s.Tracker.PeerTTL.String(), Type: "duration", Description: "Tracker Peer TTL", IsActive: true},
		{Key: KeyTrackerDefaultNum, Value: strconv.Itoa(s.Tracker.DefaultNumwant), Type: "int", Description: "Tracker 默认返回 Peer 数量", IsActive: true},
		{Key: KeyTrackerAllowed, Value: toJSONArray(allowedClients), Type: "json", Description: "Tracker 允许的客户端白名单", IsActive: true},
		{Key: KeyTrackerBlacklist, Value: toJSONArray(blacklistPorts), Type: "json", Description: "Tracker 拒绝的端口列表", IsActive: true},
		{Key: KeyBonusPerHour, Value: strconv.FormatFloat(s.Bonus.PerHour, 'f', -1, 64), Type: "float", Description: "每小时基础魔力值", IsActive: true},
		{Key: KeyBonusSeedBonus, Value: strconv.FormatFloat(s.Bonus.SeedBonus, 'f', -1, 64), Type: "float", Description: "做种加成魔力值", IsActive: true},
		{Key: KeyBonusSizeBonus, Value: strconv.FormatFloat(s.Bonus.SizeBonus, 'f', -1, 64), Type: "float", Description: "体积加成魔力值", IsActive: true},
		{Key: KeyHREnabled, Value: strconv.FormatBool(s.HR.Enabled), Type: "bool", Description: "是否启用 H&R", IsActive: true},
		{Key: KeyHRSeedHours, Value: strconv.Itoa(s.HR.SeedHours), Type: "int", Description: "H&R 需要的最短做种小时数", IsActive: true},
		{Key: KeyHRCheckInterval, Value: s.HR.CheckInterval.String(), Type: "duration", Description: "H&R 检查间隔", IsActive: true},
	}
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

func toJSONArray[T any](values []T) string {
	data, _ := json.Marshal(values)
	return string(data)
}
