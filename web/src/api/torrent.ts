import type { Torrent, TorrentListResult, PeerInfo, Comment, Subtitle } from '../types'
import { api } from './client'

export interface TorrentListParams {
  page?: number
  page_size?: number
  categories?: string
  keyword?: string
  incldead?: number
  spstate?: number
  sources?: string
  codecs?: string
  standards?: string
  media?: string
  processings?: string
  teams?: string
  audiocodecs?: string
  sort?: string
  order?: string
}

export function listTorrents(params: TorrentListParams = {}) {
  return api.get<TorrentListResult>('/torrents', { params })
}



export function getTorrent(id: number) {
  return api.get<Torrent>(`/torrents/${id}`)
}

export function uploadTorrent(formData: FormData) {
  return api.post('/torrents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// Peers
export function getPeers(id: number) {
  return api.get<{ peers: PeerInfo[] }>(`/torrents/${id}/peers`)
}

// Bookmarks on torrent
export function checkBookmark(id: number) {
  return api.get<{ bookmarked: boolean }>(`/torrents/${id}/bookmark`)
}

export function addBookmark(id: number) {
  return api.post(`/torrents/${id}/bookmark`)
}

export function removeBookmark(id: number) {
  return api.delete(`/torrents/${id}/bookmark`)
}

// Comments
export function getComments(id: number, page = 1) {
  return api.get<{ comments: Comment[]; total: number }>(`/torrents/${id}/comments`, {
    params: { page, page_size: 50 },
  })
}

export function createComment(id: number, content: string) {
  return api.post(`/torrents/${id}/comments`, { content })
}

export function deleteComment(commentId: number) {
  return api.delete(`/comments/${commentId}`)
}

// Thanks
export function thankTorrent(id: number) {
  return api.post(`/torrents/${id}/thanks`)
}

export function getThanksCount(id: number) {
  return api.get<{ count: number }>(`/torrents/${id}/thanks`)
}

export function checkThanks(id: number) {
  return api.get<{ thanked: boolean }>(`/torrents/${id}/thanks/check`)
}

// Subtitles
export function getSubtitles(id: number) {
  return api.get<{ subtitles: Subtitle[] }>(`/torrents/${id}/subtitles`)
}

export function uploadSubtitle(id: number, formData: FormData) {
  return api.post(`/torrents/${id}/subtitles`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// Edit / Delete
export function editTorrent(id: number, data: { name: string; description?: string; category: string }) {
  return api.put(`/torrents/${id}`, data)
}

export function deleteTorrent(id: number) {
  return api.delete(`/torrents/${id}`)
}
