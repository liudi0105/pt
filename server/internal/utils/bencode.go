package utils

import (
	"fmt"
	"strconv"
	"strings"
)

type BNode interface{}

func BDecode(data string) (BNode, error) {
	val, _, err := bdecode(data, 0)
	return val, err
}

func bdecode(data string, pos int) (BNode, int, error) {
	if pos >= len(data) {
		return nil, pos, fmt.Errorf("unexpected end of data")
	}

	switch {
	case data[pos] == 'i':
		end := strings.IndexByte(data[pos:], 'e')
		if end == -1 {
			return nil, pos, fmt.Errorf("invalid integer")
		}
		n, err := strconv.ParseInt(data[pos+1:pos+end], 10, 64)
		if err != nil {
			return nil, pos, err
		}
		return n, pos + end + 1, nil

	case data[pos] >= '0' && data[pos] <= '9':
		colon := strings.IndexByte(data[pos:], ':')
		if colon == -1 {
			return nil, pos, fmt.Errorf("invalid string")
		}
		length, err := strconv.Atoi(data[pos : pos+colon])
		if err != nil {
			return nil, pos, err
		}
		start := pos + colon + 1
		if start+length > len(data) {
			return nil, pos, fmt.Errorf("string too short")
		}
		return data[start : start+length], start + length, nil

	case data[pos] == 'l':
		pos++
		var list []BNode
		for pos < len(data) && data[pos] != 'e' {
			var item BNode
			var err error
			item, pos, err = bdecode(data, pos)
			if err != nil {
				return nil, pos, err
			}
			list = append(list, item)
		}
		if pos >= len(data) {
			return nil, pos, fmt.Errorf("unexpected end of list")
		}
		return list, pos + 1, nil

	case data[pos] == 'd':
		pos++
		dict := make(map[string]BNode)
		for pos < len(data) && data[pos] != 'e' {
			var key BNode
			var val BNode
			var err error
			key, pos, err = bdecode(data, pos)
			if err != nil {
				return nil, pos, err
			}
			keyStr, ok := key.(string)
			if !ok {
				return nil, pos, fmt.Errorf("dictionary key must be string")
			}
			val, pos, err = bdecode(data, pos)
			if err != nil {
				return nil, pos, err
			}
			dict[keyStr] = val
		}
		return dict, pos + 1, nil
	}

	return nil, pos, fmt.Errorf("unexpected character: %c", data[pos])
}
