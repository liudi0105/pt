export interface User {
  id: number
  username: string
  email: string
  passkey?: string
  upload_bytes: number
  download_bytes: number
  bonus: number
  role: string
  status: number
  level_id: number | null
  level_name?: string
  total_snatches?: number
  seeding_count?: number
  created_at: string
}

export interface Torrent {
  id: number
  user_id: number
  info_hash: string
  name: string
  description: string
  size: number
  file_count: number
  category: string
  seeders: number
  leechers: number
  completed: number
  created_at: string
  uploader: string
  promotion?: string
  seed_hours?: number
}

export interface TorrentListResult {
  torrents: Torrent[]
  total: number
}

export interface Snatch {
  id: number
  user_id: number
  torrent_id: number
  torrent_name?: string
  uploaded: number
  downloaded: number
  left: number
  ip: string
  port: number
  peer_id: string
  started_at: string
  last_announce: string
  is_seeding: boolean
  finished_at: string | null
}

export interface SeedingInfo extends Snatch {
  torrent_size?: number
}

export interface Bookmark {
  id: number
  user_id: number
  torrent_id: number
  torrent_name?: string
  torrent_size?: number
  seeders?: number
  leechers?: number
  created_at: string
}

export interface PeerInfo {
  user_id: number
  username: string
  uploaded: number
  downloaded: number
  is_seeding: boolean
  ip: string
  port: number
  last_seen: string
}

export interface LoginResponse {
  token: string
  user_id: number
  username: string
  role: string
}

export interface DictType {
  id: number
  name: string
  label: string
  remark: string
  sort_order: number
  is_system: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DictData {
  id: number
  type_id: number
  key: string
  value: string
  label: string
  sort_order: number
  is_default: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  type_name?: string
}

export interface UserLevel {
  id: number
  name: string
  min_upload: number
  min_download: number
  min_ratio: number
  min_bonus: number
  min_seed_count: number
  color: string
  icon: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Comment {
  id: number
  user_id: number
  torrent_id: number
  content: string
  username: string
  created_at: string
  updated_at: string
}

export interface Offer {
  id: number
  user_id: number
  name: string
  description: string
  category: string
  status: 'pending' | 'allowed' | 'denied'
  vote_yeah: number
  vote_against: number
  username: string
  created_at: string
}

export interface OfferVote {
  id: number
  user_id: number
  offer_id: number
  is_yeah: boolean
  username: string
  created_at: string
}

export interface Attendance {
  checked: boolean
  consecutive_days: number
  total_days: number
}

export interface News {
  id: number
  title: string
  content: string
  user_id: number
  username: string
  created_at: string
}

export interface Subtitle {
  id: number
  torrent_id: number
  user_id: number
  language: string
  title: string
  file_size: number
  hits: number
  username: string
  created_at: string
}

export interface Message {
  id: number
  sender_id: number
  receiver_id: number
  subject: string
  body: string
  is_read: boolean
  sender_username?: string
  receiver_username?: string
  created_at: string
}

export interface Invite {
  id: number
  sender_id: number
  code: string
  is_used: boolean
  used_by_id: number | null
  used_by_username?: string
  expires_at: string
  created_at: string
}

export interface Report {
  id: number
  reporter_id: number
  reporter_username?: string
  target_type: string
  target_id: number
  reason: string
  status: string
  created_at: string
}

export interface Medal {
  id: number
  name: string
  description: string
  image: string
  price: number
  created_at: string
}

export interface UserMedal {
  id: number
  user_id: number
  medal_id: number
  medal_name?: string
  created_at: string
}

export interface HRItem {
  id: number
  torrent_id: number
  torrent_name: string
  uploaded: number
  downloaded: number
  seed_time: number
  is_seeding: boolean
  finished_at: string | null
}

export interface RoleModel {
  id: number
  name: string
  display_name: string
  description: string
  is_system: boolean
  sort_order: number
  permissions: Permission[]
  created_at: string
  updated_at: string
}

export interface Permission {
  id: number
  code: string
  name: string
  group: string
  description: string
  created_at: string
}

export interface SiteSetting {
  id: number
  key: string
  value: string
  type: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}
