package i18n

import (
	"encoding/json"
	"fmt"
	"os"
	"sync"

	"github.com/nicksnyder/go-i18n/v2/i18n"
	"golang.org/x/text/language"
)

var (
	bundle    *i18n.Bundle
	initOnce  sync.Once
	initError error
)

func Init(localesDir string) error {
	initOnce.Do(func() {
		bundle = i18n.NewBundle(language.Chinese)
		bundle.RegisterUnmarshalFunc("json", json.Unmarshal)

		if _, err := bundle.LoadMessageFile(localesDir + "/zh.json"); err != nil {
			initError = fmt.Errorf("failed to load zh.json: %w", err)
			return
		}
		if _, err := bundle.LoadMessageFile(localesDir + "/en.json"); err != nil {
			initError = fmt.Errorf("failed to load en.json: %w", err)
			return
		}
	})
	return initError
}

func Localize(lang string, msgID string) string {
	if bundle == nil {
		return msgID
	}
	localizer := i18n.NewLocalizer(bundle, lang)
	msg, err := localizer.Localize(&i18n.LocalizeConfig{MessageID: msgID})
	if err != nil {
		return msgID
	}
	return msg
}

func detectLang(acceptLang string) string {
	if acceptLang == "" {
		return "zh"
	}
	for _, part := range splitAcceptLang(acceptLang) {
		if len(part) >= 2 {
			switch part[:2] {
			case "zh":
				return "zh"
			case "en":
				return "en"
			}
		}
	}
	return "zh"
}

func splitAcceptLang(s string) []string {
	var result []string
	current := ""
	for _, c := range s {
		if c == ',' || c == ';' {
			if current != "" {
				result = append(result, current)
			}
			current = ""
		} else if c != ' ' && c != '\t' {
			current += string(c)
		}
	}
	if current != "" {
		result = append(result, current)
	}
	return result
}

func init() {
	if os.Getenv("I18N_DIR") != "" {
		_ = Init(os.Getenv("I18N_DIR"))
	} else {
		_ = Init("locales")
	}
}
