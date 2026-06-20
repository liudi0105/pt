import { Table } from 'antd'
import { Link, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getBookmarks } from '../../api/user'
import type { Bookmark } from '../../types'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next'
import { formatSize } from './utils'

dayjs.extend(relativeTime)

export default function Bookmarks() {
  const { t } = useTranslation('user')
  const { lang } = useParams({ from: '/$lang' })
  const { data, isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => getBookmarks(),
    select: (res) => res.data.bookmarks,
  })

  const columns: ColumnsType<Bookmark> = [
    {
      title: t('bookmarks.torrent'),
      dataIndex: 'torrent_name',
      key: 'torrent_name',
      render: (name: string, r: Bookmark) => (
        <Link to="/$lang/torrents/$id" params={{ lang, id: String(r.torrent_id) }}>{name || `#${r.torrent_id}`}</Link>
      ),
    },
    {
      title: t('bookmarks.size'),
      dataIndex: 'torrent_size',
      key: 'torrent_size',
      render: (v: number) => formatSize(v || 0),
    },
    {
      title: t('bookmarks.seeders'),
      dataIndex: 'seeders',
      key: 'seeders',
      render: (v: number) => <span style={{ color: '#52c41a' }}>{v ?? 0}</span>,
    },
    {
      title: t('bookmarks.leechers'),
      dataIndex: 'leechers',
      key: 'leechers',
      render: (v: number) => <span style={{ color: '#faad14' }}>{v ?? 0}</span>,
    },
    {
      title: t('bookmarks.bookmarked'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v: string) => dayjs(v).fromNow(),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={isLoading}
      size="small"
      pagination={{ pageSize: 20 }}
    />
  )
}
