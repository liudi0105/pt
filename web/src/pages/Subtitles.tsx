import { Card, Table, Typography, Input, Space, Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { listSubtitles, type SubtitleListParams } from '../api/subtitle'
import type { Subtitle } from '../types'
import dayjs from 'dayjs'
import { useState } from 'react'
import { formatSize } from './user-center/utils'

const { Text } = Typography

export function Subtitles() {
  const { t } = useTranslation('torrent')
  const { t: tCommon } = useTranslation()
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)

  const params: SubtitleListParams = {
    page,
    page_size: 50,
    keyword: keyword || undefined,
  }

  const { data, isLoading } = useQuery({
    queryKey: ['subtitles', params],
    queryFn: () => listSubtitles(params),
    select: (res) => res.data,
  })

  const columns = [
    {
      title: t('torrent'),
      dataIndex: 'torrent_name',
      key: 'torrent_name',
      render: (name: string, record: Subtitle) =>
        name ? (
          <Link to="/$lang/torrents/$id" params={{ lang: 'zh', id: String(record.torrent_id) }}>
            {name}
          </Link>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: t('subtitlePage'),
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => title || '-',
    },
    {
      title: t('language'),
      dataIndex: 'language',
      key: 'language',
      render: (lang: string) => <Tag>{lang}</Tag>,
    },
    {
      title: tCommon('name'),
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: t('size'),
      dataIndex: 'file_size',
      key: 'file_size',
      render: (size: number) => formatSize(size),
    },
    {
      title: t('subtitleHits'),
      dataIndex: 'hits',
      key: 'hits',
      render: (hits: number) => hits,
    },
    {
      title: tCommon('created'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: tCommon('actions'),
      key: 'actions',
      render: (_: unknown, record: Subtitle) => (
        <a href={`/api/subtitles/${record.id}/download`} target="_blank" rel="noopener noreferrer">
          {t('download')}
        </a>
      ),
    },
  ]

  return (
    <Card title={t('subtitlePage')}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Input.Search
          placeholder={t('searchSubtitle')}
          allowClear
          onSearch={(val) => { setKeyword(val); setPage(1) }}
          style={{ maxWidth: 400 }}
        />
        <Table
          dataSource={data?.subtitles ?? []}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: 50,
            total: data?.total ?? 0,
            onChange: (p) => setPage(p),
            showTotal: (total) => tCommon('pagination.total', { count: total }),
          }}
        />
      </Space>
    </Card>
  )
}
