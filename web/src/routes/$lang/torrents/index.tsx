import { createFileRoute } from '@tanstack/react-router'
import { TorrentsPage } from '../../../pages/TorrentsPage'
import { getDictData } from '../../../api/dict'
import { listActiveAnnouncements } from '../../../api/announcements'
import { listTorrents } from '../../../api/torrent'
import { PUBLISH_DICT_TYPES } from '../../../constants/torrent'

export interface TorrentSearchParams {
  keyword?: string
  categories?: string
  incldead?: number
  spstate?: string
  sort?: string
  order?: string
  page?: number
  page_size?: number
  sources?: string
  codecs?: string
  standards?: string
  media?: string
  processings?: string
  teams?: string
  audiocodecs?: string
}

export function buildApiParams(search: TorrentSearchParams) {
  return {
    page: search.page || 1,
    page_size: search.page_size || 50,
    keyword: search.keyword,
    categories: search.categories,
    incldead: search.incldead,
    spstate: search.spstate,
    sort: search.sort || 'created_at',
    order: search.order || 'desc',
    sources: search.sources,
    codecs: search.codecs,
    standards: search.standards,
    media: search.media,
    processings: search.processings,
    teams: search.teams,
    audiocodecs: search.audiocodecs,
  }
}

export const Route = createFileRoute('/$lang/torrents/')({
  validateSearch: (search: Record<string, string>): TorrentSearchParams => ({
    keyword: search.keyword || undefined,
    categories: search.categories || undefined,
    incldead: search.incldead ? Number(search.incldead) : undefined,
    spstate: search.spstate || undefined,
    sort: search.sort || undefined,
    order: search.order || undefined,
    page: search.page ? Number(search.page) : undefined,
    page_size: search.page_size ? Number(search.page_size) : undefined,
    sources: search.sources || undefined,
    codecs: search.codecs || undefined,
    standards: search.standards || undefined,
    media: search.media || undefined,
    processings: search.processings || undefined,
    teams: search.teams || undefined,
    audiocodecs: search.audiocodecs || undefined,
  }),
  loader: async ({ context: { queryClient }, location }) => {
    const usp = new URLSearchParams(location.searchStr)
    const search: TorrentSearchParams = {}
    for (const [k, v] of usp.entries()) {
      ;(search as any)[k] = v
    }
    const apiParams = buildApiParams(search)
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['dict-data', PUBLISH_DICT_TYPES],
        queryFn: () => getDictData([...PUBLISH_DICT_TYPES]),
        staleTime: 5 * 60 * 1000,
      }),
      queryClient.ensureQueryData({
        queryKey: ['torrents', apiParams],
        queryFn: () => listTorrents(apiParams),
      }),
      queryClient.ensureQueryData({
        queryKey: ['active-announcements'],
        queryFn: () => listActiveAnnouncements(),
        staleTime: 5 * 60 * 1000,
      }),
    ])
  },
  component: TorrentsPage,
})
