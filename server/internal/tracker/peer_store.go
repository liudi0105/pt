package tracker

import (
	"fmt"
	"sync"
	"time"

	"pt-server/internal/model"
)

type PeerStore struct {
	mu       sync.RWMutex
	peers    map[string]map[string]*model.Peer
	complete map[string]int
	peerTTL  time.Duration
}

func NewPeerStore(peerTTL time.Duration) *PeerStore {
	return &PeerStore{
		peers:    make(map[string]map[string]*model.Peer),
		complete: make(map[string]int),
		peerTTL:  peerTTL,
	}
}

func (s *PeerStore) Upsert(infoHash string, peer *model.Peer) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, ok := s.peers[infoHash]; !ok {
		s.peers[infoHash] = make(map[string]*model.Peer)
	}

	key := peerKey(peer.PeerID, peer.IP, peer.Port)
	old, exists := s.peers[infoHash][key]

	if peer.Event == "completed" && (!exists || old.Left > 0) {
		s.complete[infoHash]++
	}

	if peer.Event == "stopped" {
		delete(s.peers[infoHash], key)
		if len(s.peers[infoHash]) == 0 {
			delete(s.peers, infoHash)
		}
		return
	}

	peer.IsSeeder = peer.Left == 0
	peer.LastSeen = time.Now()

	if exists {
		peer.Uploaded += old.Uploaded
		peer.Downloaded += old.Downloaded
	}

	s.peers[infoHash][key] = peer
}

func (s *PeerStore) Remove(infoHash, peerID, ip string, port int) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if peers, ok := s.peers[infoHash]; ok {
		delete(peers, peerKey(peerID, ip, port))
		if len(peers) == 0 {
			delete(s.peers, infoHash)
		}
	}
}

func (s *PeerStore) GetPeers(infoHash string, numWant int, excludePeerID string) []*model.Peer {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if numWant <= 0 {
		return nil
	}

	peers, ok := s.peers[infoHash]
	if !ok {
		return nil
	}

	var result []*model.Peer
	for _, p := range peers {
		if p.PeerID == excludePeerID {
			continue
		}
		result = append(result, p)
		if len(result) >= numWant {
			break
		}
	}
	return result
}

func (s *PeerStore) Stats(infoHash string) (seeders, leechers int) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	peers, ok := s.peers[infoHash]
	if !ok {
		return 0, 0
	}

	for _, p := range peers {
		if p.IsSeeder {
			seeders++
		} else {
			leechers++
		}
	}
	return
}

func (s *PeerStore) GetComplete(infoHash string) int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.complete[infoHash]
}

func (s *PeerStore) CleanupLoop(intervalFn func() time.Duration, ttlFn func() time.Duration) {
	for {
		interval := intervalFn()
		if interval <= 0 {
			interval = 5 * time.Minute
		}
		time.Sleep(interval)
		ttl := ttlFn()
		if ttl <= 0 {
			ttl = s.peerTTL
		}
		s.cleanup(ttl)
	}
}

func (s *PeerStore) cleanup(ttl time.Duration) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if ttl <= 0 {
		ttl = 35 * time.Minute
	}
	threshold := time.Now().Add(-ttl)

	for infoHash, peers := range s.peers {
		for key, p := range peers {
			if p.LastSeen.Before(threshold) {
				delete(peers, key)
			}
		}
		if len(peers) == 0 {
			delete(s.peers, infoHash)
		}
	}
}

func peerKey(peerID, ip string, port int) string {
	return fmt.Sprintf("%s:%s:%d", peerID, ip, port)
}
