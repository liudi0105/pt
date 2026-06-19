package config

import (
	"github.com/spf13/viper"
)

type Config struct {
	Driver     string `mapstructure:"driver"`
	DSN        string `mapstructure:"dsn"`
	ListenAddr string `mapstructure:"listen_addr"`
	JWTSecret  string `mapstructure:"jwt_secret"`
	UploadDir  string `mapstructure:"upload_dir"`
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
	v.SetDefault("upload_dir", "./uploads/torrents")

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
