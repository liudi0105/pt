package i18n

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

const LangContextKey = "lang"

func LangMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		lang := ""

		if q := c.Query("lang"); q != "" {
			lang = q
		}

		if lang == "" {
			if cookie, err := c.Cookie("lang"); err == nil && cookie != "" {
				lang = cookie
			}
		}

		if lang == "" {
			lang = detectLang(c.GetHeader("Accept-Language"))
		}

		if lang == "" {
			lang = "zh"
		}

		if lang != "zh" && lang != "en" {
			lang = "zh"
		}

		c.Set(LangContextKey, lang)
		c.Next()
	}
}

func GetLang(c *gin.Context) string {
	if lang, exists := c.Get(LangContextKey); exists {
		return lang.(string)
	}
	return "zh"
}

func T(c *gin.Context, msgID string) string {
	return Localize(GetLang(c), msgID)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept-Language")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}
