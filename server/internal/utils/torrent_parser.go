package utils

import (
	"crypto/sha1"
	"fmt"
	"os"
)

type TorrentInfo struct {
	Name      string
	PieceLength int64
	Pieces    []byte
	Length    int64
	Files     []TorrentFile
	InfoHash  [20]byte
	InfoDict  string
}

type TorrentFile struct {
	Length int64
	Path   []string
}

func ParseTorrentFile(path string) (*TorrentInfo, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}
	return ParseTorrent(data)
}

func ParseTorrent(data []byte) (*TorrentInfo, error) {
	raw := string(data)
	root, err := BDecode(raw)
	if err != nil {
		return nil, fmt.Errorf("failed to decode: %w", err)
	}

	dict, ok := root.(map[string]BNode)
	if !ok {
		return nil, fmt.Errorf("root is not a dictionary")
	}

	infoNode, ok := dict["info"]
	if !ok {
		return nil, fmt.Errorf("missing info dict")
	}

	info, ok := infoNode.(map[string]BNode)
	if !ok {
		return nil, fmt.Errorf("info is not a dictionary")
	}

	ti := &TorrentInfo{}

	if name, ok := info["name"].(string); ok {
		ti.Name = name
	}
	if pl, ok := info["piece length"].(int64); ok {
		ti.PieceLength = pl
	}
	if pieces, ok := info["pieces"].(string); ok {
		ti.Pieces = []byte(pieces)
	}

	if length, ok := info["length"].(int64); ok {
		ti.Length = length
	}

	if filesNode, ok := info["files"]; ok {
		if files, ok := filesNode.([]BNode); ok {
			for _, f := range files {
				if fd, ok := f.(map[string]BNode); ok {
					tf := TorrentFile{}
					if l, ok := fd["length"].(int64); ok {
						tf.Length = l
					}
					if pathNode, ok := fd["path"]; ok {
						if path, ok := pathNode.([]BNode); ok {
							for _, p := range path {
								if s, ok := p.(string); ok {
									tf.Path = append(tf.Path, s)
								}
							}
						}
					}
					ti.Files = append(ti.Files, tf)
				}
			}
		}
	}

	infoStart := -1
	depth := 0
	for i := 0; i < len(raw); i++ {
		if raw[i] == 'd' {
			if depth == 0 && raw[i+1:i+5] == "4:inf" || raw[i+1:i+6] == "4:info" {
				// need to find the actual "info" key
			}
			depth++
		} else if raw[i] == 'e' {
			depth--
		}
	}

	// Find the info dict by searching for "4:info"
	infoIdx := indexOf(raw, "4:info")
	if infoIdx >= 0 {
		infoStart = infoIdx + 6 // skip "4:info"
		depth = 1
		end := infoStart
		for end < len(raw) && depth > 0 {
			if raw[end] == 'd' || raw[end] == 'l' {
				depth++
			} else if raw[end] == 'e' {
				depth--
			}
			end++
		}
		ti.InfoDict = raw[infoStart-6 : end]

		hash := sha1.Sum([]byte(ti.InfoDict))
		copy(ti.InfoHash[:], hash[:])
	}

	return ti, nil
}

func indexOf(s, sub string) int {
	for i := 0; i <= len(s)-len(sub); i++ {
		if s[i:i+len(sub)] == sub {
			return i
		}
	}
	return -1
}
