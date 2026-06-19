import { Table, Tag, Typography, Space, Progress } from 'antd'
import { Link, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { listHR } from '../api/hr'
import type { HRItem } from '../types'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const { Title } = Typography
const REQUIRED_SEED_HOURS = 72

function formatSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function HR() {
  const { t } = useTranslation('hr')
  const { lang } = useParams({ from: '/$lang' })
  const { data, isLoading } = useQuery({
    queryKey: ['hr'],
    queryFn: () => listHR(),
    select: (res) => res.data,
  })

  const columns: ColumnsType<HRItem> = [
    {
      title: t('torrent'),
      dataIndex: 'torrent_name',
      key: 'torrent_name',
      render: (name: string, r: HRItem) => (
        <Link to="/$lang/torrents/$id" params={{ lang, id: String(r.torrent_id) }}>{name || `#${r.torrent_id}`}</Link>
      ),
    },
    {
      title: t('uploaded'),
      dataIndex: 'uploaded',
      key: 'uploaded',
      width: 100,
      render: (v: number) => formatSize(v),
    },
    {
      title: t('downloaded'),
      dataIndex: 'downloaded',
      key: 'downloaded',
      width: 100,
      render: (v: number) => formatSize(v),
    },
    {
      title: t('seedTime'),
      dataIndex: 'seed_time',
      key: 'seed_time',
      width: 100,
      render: (v: number) => formatDuration(v),
    },
    {
      title: t('progress'),
      key: 'progress',
      width: 160,
      render: (_, r: HRItem) => {
        const pct = Math.min(100, Math.round((r.seed_time / (REQUIRED_SEED_HOURS * 3600)) * 100))
        const satisfied = r.seed_time >= REQUIRED_SEED_HOURS * 3600
        return (
          <Space>
            <Progress percent={pct} size="small" style={{ width: 100 }} status={satisfied ? 'success' : 'active'} />
            {satisfied && <Tag color="green">{t('ok')}</Tag>}
          </Space>
        )
      },
    },
    {
      title: t('status'),
      dataIndex: 'is_seeding',
      key: 'is_seeding',
      width: 80,
      render: (v: boolean) =>
        v ? <Tag color="green">{t('seeding')}</Tag> : <Tag color="default">{t('stopped')}</Tag>,
    },
    {
      title: t('finished'),
      dataIndex: 'finished_at',
      key: 'finished_at',
      width: 120,
      render: (v: string | null) => v ? dayjs(v).format('YYYY-MM-DD') : '-',
    },
  ]

  return (
    <div>
      <Title level={3}>{t('title')}</Title>
      <Table columns={columns} dataSource={data?.hr_list} rowKey="id" loading={isLoading} size="small"
        pagination={{ pageSize: 20, total: data?.total }}
      />
    </div>
  )
}
