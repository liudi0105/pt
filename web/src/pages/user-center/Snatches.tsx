import { Table, Tag } from 'antd'
import { Link, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getSnatches } from '../../api/user'
import type { Snatch } from '../../types'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next'
import { formatSize, calcRatio } from './utils'

dayjs.extend(relativeTime)

export default function Snatches() {
  const { t } = useTranslation('user')
  const { lang } = useParams({ from: '/$lang' })
  const { data, isLoading } = useQuery({
    queryKey: ['snatches'],
    queryFn: () => getSnatches(),
    select: (res) => res.data.snatches,
  })

  const columns: ColumnsType<Snatch> = [
    {
      title: t('snatches.torrent'),
      dataIndex: 'torrent_name',
      key: 'torrent_name',
      render: (name: string, r: Snatch) => (
        <Link to="/$lang/torrents/$id" params={{ lang, id: String(r.torrent_id) }}>{name || `#${r.torrent_id}`}</Link>
      ),
    },
    {
      title: t('snatches.uploaded'),
      dataIndex: 'uploaded',
      key: 'uploaded',
      render: (v: number) => formatSize(v),
    },
    {
      title: t('snatches.downloaded'),
      dataIndex: 'downloaded',
      key: 'downloaded',
      render: (v: number) => formatSize(v),
    },
    {
      title: t('snatches.ratio'),
      key: 'ratio',
      render: (_, r: Snatch) => calcRatio(r.uploaded, r.downloaded),
    },
    {
      title: t('snatches.status'),
      dataIndex: 'is_seeding',
      key: 'is_seeding',
      render: (v: boolean) =>
        v ? <Tag color="green">Seeding</Tag> : <Tag color="default">Finished</Tag>,
    },
    {
      title: t('snatches.lastAnnounce'),
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
