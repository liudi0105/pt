package middleware

import (
	"net/http"
	"strings"

	"pt-server/internal/config"
	i18n "pt-server/internal/i18n"
	"pt-server/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type Middleware struct {
	cfg  *config.Config
	repo *repository.Repository
}

func New(cfg *config.Config, repo *repository.Repository) *Middleware {
	return &Middleware{cfg: cfg, repo: repo}
}

func (m *Middleware) CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

func (m *Middleware) Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		if auth == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": i18n.T(c, "missing_authorization")})
			return
		}

		tokenStr := strings.TrimPrefix(auth, "Bearer ")
		if tokenStr == auth {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": i18n.T(c, "invalid_authorization_format")})
			return
		}

		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			return []byte(m.cfg.JWTSecret), nil
		})
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": i18n.T(c, "invalid_token")})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": i18n.T(c, "invalid_token_claims")})
			return
		}

		userID, _ := claims["user_id"].(float64)
		role, _ := claims["role"].(string)
		c.Set("user_id", int64(userID))
		c.Set("role", role)

		if roleID, ok := claims["role_id"].(float64); ok {
			c.Set("role_id", int64(roleID))
		} else if m.repo != nil && m.repo.Role != nil {
			roleObj, err := m.repo.Role.GetByKey(role)
			if err == nil {
				c.Set("role_id", roleObj.ID)
			}
		}

		c.Next()
	}
}

func (m *Middleware) Admin() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, _ := c.Get("role")
		if role != "admin" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": i18n.T(c, "admin_required")})
			return
		}
		c.Next()
	}
}

func (m *Middleware) RequirePermission(permCode string) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleID, exists := c.Get("role_id")
		if !exists {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": i18n.T(c, "permission_denied")})
			return
		}

		role, err := m.repo.Role.GetByID(roleID.(int64))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": i18n.T(c, "permission_denied")})
			return
		}

		hasPerm := false
		for _, p := range role.Permissions {
			if p.Code == permCode {
				hasPerm = true
				break
			}
		}
		if !hasPerm {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": i18n.T(c, "permission_denied")})
			return
		}
		c.Next()
	}
}
