import { createFileRoute } from '@tanstack/react-router'
import { TorrentEdit } from '../../pages/TorrentEdit'

export const Route = createFileRoute('/$lang/torrents_/$id/edit')({
  staticData: {
    title: 'common:nav.torrentEdit',
    menuCode: 'torrents',
  },
  component: TorrentEdit,
})
