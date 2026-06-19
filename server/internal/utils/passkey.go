package utils

import (
	"crypto/rand"
	"encoding/hex"
)

func GeneratePasskey() string {
	b := make([]byte, 20)
	rand.Read(b)
	return hex.EncodeToString(b)
}
