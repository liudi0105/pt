export const TORRENT_CATEGORIES = [
  'movie',
  'tv',
  'music',
  'game',
  'software',
  'documentary',
  'anime',
  'ebook',
  'unsorted',
] as const

export type TorrentCategory = (typeof TORRENT_CATEGORIES)[number]

const CATEGORY_LABEL_KEYS: Record<TorrentCategory, string> = {
  movie: 'categories.movies',
  tv: 'categories.tv',
  music: 'categories.music',
  game: 'categories.games',
  software: 'categories.software',
  documentary: 'categories.documentary',
  anime: 'categories.anime',
  ebook: 'categories.ebooks',
  unsorted: 'categories.unsorted',
}

export const PUBLISH_DICT_TYPES = ['source', 'codec', 'resolution', 'processing', 'team', 'audio'] as const

export const PUBLISH_META_FIELDS = ['source', 'codec', 'standard', 'processing', 'team', 'audiocodec'] as const

export function getTorrentCategoryOptions(t: (key: string) => string) {
  return TORRENT_CATEGORIES.map((value) => ({
    value,
    label: t(CATEGORY_LABEL_KEYS[value]),
  }))
}

export function getTorrentCategoryLabel(category: string, t: (key: string) => string) {
  const key = CATEGORY_LABEL_KEYS[category as TorrentCategory]
  return key ? t(key) : category
}
