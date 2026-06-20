import { Table } from 'antd'
import { Link, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getSeeding } from '../../api/user'
import type { SeedingInfo } from '../../types'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next'
import { formatSize, calcRatio } from './utils'

dayjs.extend(relativeTime)

export default function Seeding() {
  const { t } = useTranslation('user')
  const { lang } = useParams({ from: '/$lang' })
  const { data, isLoading } = useQuery({
    queryKey: ['seeding'],
    queryFn: () => getSeeding(),
    select: (res) => res.data.seeding,
  })

  const columns: ColumnsType<SeedingInfo> = [
    {
      title: t('seedingTab.torrent'),
      dataIndex: 'torrent_name',
      key: 'torrent_name',
      render: (name: string, r: SeedingInfo) => (
        <Link to="/$lang/torrents/$id" params={{ lang, id: String(r.torrent_id) }}>{name || `#${r.torrent_id}`}</Link>
      ),
    },
    {
      title: t('seedingTab.size'),
      dataIndex: 'torrent_size',
      key: 'torrent_size',
      render: (v: number) => formatSize(v || 0),
    },
    {
      title: t('seedingTab.uploaded'),
      dataIndex: 'uploaded',
      key: 'uploaded',
      render: (v: number) => formatSize(v),
    },
    {
      title: t('seedingTab.downloaded'),
      dataIndex: 'downloaded',
      key: 'downloaded',
      render: (v: number) => formatSize(v),
    },
    {
      title: t('seedingTab.ratio'),
      key: 'ratio',
      render: (_, r: SeedingInfo) => calcRatio(r.uploaded, r.downloaded),
    },
    {
      title: t('seedingTab.lastAnnounce'),
      dataIndex: 'last_announce',
      key: 'last_announce',
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
