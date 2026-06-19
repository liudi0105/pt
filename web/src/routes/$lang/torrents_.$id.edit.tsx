import { createFileRoute } from '@tanstack/react-router'
import { TorrentEdit } from '../../pages/TorrentEdit'

export const Route = createFileRoute('/$lang/torrents_/$id/edit')({
  component: TorrentEdit,
})
