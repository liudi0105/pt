import { createFileRoute } from '@tanstack/react-router'
import { TorrentDetail } from '../../../pages/TorrentDetail'
import { getTorrent, getPeers, checkBookmark, getThanksCount, checkThanks } from '../../../api/torrent'

export const Route = createFileRoute('/$lang/torrents/$id')({
  staticData: {
    title: 'common:nav.torrentDetail',
    menuCode: 'torrents',
  },
  loader: async ({ context: { queryClient }, params }) => {
    const id = Number(params.id)
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['torrent', id],
        queryFn: () => getTorrent(id),
      }),
      queryClient.ensureQueryData({
        queryKey: ['peers', id],
        queryFn: () => getPeers(id),
      }),
      queryClient.ensureQueryData({
        queryKey: ['bookmark', id],
        queryFn: () => checkBookmark(id),
      }),
      queryClient.ensureQueryData({
        queryKey: ['thanks-count', id],
        queryFn: () => getThanksCount(id),
      }),
      queryClient.ensureQueryData({
        queryKey: ['thanks-check', id],
        queryFn: () => checkThanks(id),
      }),
    ])
  },
  component: TorrentDetail,
})
