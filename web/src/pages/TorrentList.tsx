import { useState } from 'react'
import { Table, Input, Select, Tag, Space, Typography } from 'antd'
import { Link, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { listTorrents } from '../api/torrent'
import { formatSize } from '../utils/format'
import type { Torrent } from '../types'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next'

dayjs.extend(relativeTime)

const { Search } = Input
const { Title } = Typography

const CATEGORY_LABELS: Record<string, string> = {
  movie: 'Movies',
  tv: 'TV Series',
  music: 'Music',
  game: 'Games',
  software: 'Software',
  documentary: 'Documentary',
  anime: 'Anime',
  ebook: 'E-Book',
  unsorted: 'Unsorted',
}

export function TorrentList() {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const { lang } = useParams({ from: '/$lang' })
  const { t: tt } = useTranslation('torrent')
  const { t } = useTranslation()

  const { data, isLoading } = useQuery({
    queryKey: ['torrents', keyword, category, page],
    queryFn: () => listTorrents({ keyword, category, page, page_size: 50 }),
    select: (res) => res.data,
  })

  const columns: ColumnsType<Torrent> = [
    {
      title: tt('name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Torrent) => (
        <Link to="/$lang/torrents/$id" params={{ lang, id: String(record.id) }}>
          {name}
        </Link>
      ),
    },
    {
      title: tt('promotion'),
      dataIndex: 'promotion',
      key: 'promotion',
      width: 100,
      render: (promo?: string) => {
        if (!promo || promo === 'none') return null
        if (promo === 'free') return <Tag color="green">{t('promotions.free')}</Tag>
        if (promo === 'twoup') return <Tag color="blue">{t('promotions.twoup')}</Tag>
        if (promo === 'free_twoup') return <><Tag color="green">{t('promotions.free')}</Tag><Tag color="blue">{t('promotions.twoup')}</Tag></>
        if (promo === 'thirty_percent') return <Tag color="orange">{t('promotions.thirtyPercent')}</Tag>
        return <Tag>{promo}</Tag>
      },
    },
    {
      title: tt('category'),
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (cat: string) => <Tag color="blue">{CATEGORY_LABELS[cat] || cat}</Tag>,
    },
    {
      title: tt('size'),
      dataIndex: 'size',
      key: 'size',
      width: 120,
      render: (size: number) => formatSize(size),
    },
    {
      title: 'SE',
      dataIndex: 'seeders',
      key: 'seeders',
      width: 60,
      render: (n: number) => <span style={{ color: '#52c41a' }}>{n}</span>,
    },
    {
      title: 'LE',
      dataIndex: 'leechers',
      key: 'leechers',
      width: 60,
      render: (n: number) => <span style={{ color: '#faad14' }}>{n}</span>,
    },
    {
      title: tt('completed'),
      dataIndex: 'completed',
      key: 'completed',
      width: 80,
    },
    {
      title: tt('uploader'),
      dataIndex: 'uploader',
      key: 'uploader',
      width: 120,
    },
    {
      title: tt('created'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date: string) => dayjs(date).fromNow(),
    },
  ]

  return (
    <div>
      <Title level={3}>{tt('title')}</Title>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder={tt('searchPlaceholder')}
          onSearch={setKeyword}
          allowClear
          style={{ width: 300 }}
        />
        <Select
          placeholder={tt('categoryPlaceholder')}
          value={category || undefined}
          onChange={setCategory}
          allowClear
          style={{ width: 150 }}
          options={[
            { value: 'movie', label: t('categories.movies') },
            { value: 'tv', label: t('categories.tv') },
            { value: 'music', label: t('categories.music') },
            { value: 'software', label: t('categories.software') },
          ]}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={data?.torrents}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: 50,
          total: data?.total,
          onChange: setPage,
          showTotal: (total) => tt('totalTorrents', { count: total }),
        }}
        size="small"
      />
    </div>
  )
}
