package config

import (
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	Driver     string `mapstructure:"driver"`
	DSN        string `mapstructure:"dsn"`
	ListenAddr string `mapstructure:"listen_addr"`
	JWTSecret  string `mapstructure:"jwt_secret"`
	SiteName   string `mapstructure:"site_name"`
	UploadDir  string `mapstructure:"upload_dir"`
	Tracker    TrackerConfig
	Bonus      BonusConfig
	HR         HRConfig
}

type TrackerConfig struct {
	Interval         time.Duration `mapstructure:"interval"`
	MinInterval      time.Duration `mapstructure:"min_interval"`
	CleanupInterval  time.Duration `mapstructure:"cleanup_interval"`
	PeerTTL          time.Duration `mapstructure:"peer_ttl"`
	DefaultNumwant   int           `mapstructure:"default_numwant"`
}

type BonusConfig struct {
	PerHour     float64 `mapstructure:"per_hour"`
	SeedBonus   float64 `mapstructure:"seed_bonus"`
	SizeBonus   float64 `mapstructure:"size_bonus"`
}

type HRConfig struct {
	Enabled         bool          `mapstructure:"enabled"`
	SeedHours       int           `mapstructure:"seed_hours"`
	CheckInterval   time.Duration `mapstructure:"check_interval"`
}

func Load() (*Config, error) {
	v := viper.New()
	v.SetConfigName("config")
	v.SetConfigType("yaml")
	v.AddConfigPath(".")
	v.AddConfigPath("/etc/pt-server")

	v.SetDefault("driver", "sqlite3")
	v.SetDefault("dsn", "pt.db")
	v.SetDefault("listen_addr", ":8080")
	v.SetDefault("tracker.interval", 30*time.Minute)
	v.SetDefault("tracker.min_interval", 15*time.Minute)
	v.SetDefault("tracker.cleanup_interval", 5*time.Minute)
	v.SetDefault("tracker.peer_ttl", 35*time.Minute)
	v.SetDefault("tracker.default_numwant", 50)
	v.SetDefault("upload_dir", "./uploads/torrents")
	v.SetDefault("bonus.per_hour", 1.0)
	v.SetDefault("bonus.seed_bonus", 0.5)
	v.SetDefault("bonus.size_bonus", 0.1)
	v.SetDefault("hr.enabled", true)
	v.SetDefault("hr.seed_hours", 72)
	v.SetDefault("hr.check_interval", 1*time.Hour)

	v.AutomaticEnv()

	if err := v.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, err
		}
	}

	var cfg Config
	if err := v.Unmarshal(&cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}
