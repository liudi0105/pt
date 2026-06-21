import { useMemo, useCallback, useState } from 'react'
import { Table, Input, Tag, Space, Typography, Button, Checkbox, Row, Col, Card, Tooltip, Select } from 'antd'
import { FireOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons'
import { Link, useParams, useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { listTorrents } from '../api/torrent'
import { getDictData } from '../api/dict'
import { formatSize } from '../utils/format'
import type { Torrent, DictData } from '../types'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { SorterResult } from 'antd/es/table/interface'
import type { TorrentSearchParams } from '../routes/$lang/torrents'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next'
import { getTorrentCategoryLabel, TORRENT_CATEGORIES, PUBLISH_DICT_TYPES } from '../constants/torrent'
import { useI18n } from '../hooks/useI18n'

dayjs.extend(relativeTime)

const { Search } = Input
const { Title, Text } = Typography

const DICT_TO_PARAM: Record<string, keyof TorrentSearchParams> = {
  source: 'sources',
  codec: 'codecs',
  resolution: 'standards',
  processing: 'processings',
  team: 'teams',
  audio: 'audiocodecs',
}

export function TorrentList() {
  const navigate = useNavigate()
  const { lang } = useParams({ from: '/$lang' })
  const search = useSearch({ from: '/$lang/torrents/' })
  const { t: tt } = useTranslation('torrent')
  const { t } = useTranslation()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const dictI18n = useI18n('dict_data')

  const { data: dictData } = useQuery({
    queryKey: ['dict-data', PUBLISH_DICT_TYPES],
    queryFn: () => getDictData([...PUBLISH_DICT_TYPES]),
    select: (res) => res.data.data as Record<string, DictData[]>,
    staleTime: 5 * 60 * 1000,
  })

  const apiParams = useMemo(() => ({
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
  }), [search])

  const { data, isLoading } = useQuery({
    queryKey: ['torrents', apiParams],
    queryFn: () => listTorrents(apiParams),
    select: (res) => res.data,
  })

  const updateSearch = useCallback((patch: Partial<TorrentSearchParams>) => {
    navigate({ to: '/$lang/torrents', params: { lang }, search: { ...search, ...patch, page: 1 } } as any)
  }, [navigate, search, lang])

  const toggleQuickFilter = useCallback(<K extends keyof TorrentSearchParams>(key: K, value: NonNullable<TorrentSearchParams[K]>) => {
    updateSearch({ [key]: search[key] === value ? undefined : value })
  }, [search, updateSearch])

  const selectedCategories = search.categories ? search.categories.split(',').filter(Boolean) : []

  const taxonomyOptions = useMemo(() => {
    if (!dictData) return {} as Record<string, { value: string; label: string }[]>
      const result: Record<string, { value: string; label: string }[]> = {}
      for (const [dictType, paramKey] of Object.entries(DICT_TO_PARAM)) {
        const items = dictData[dictType] ?? []
        result[paramKey] = items.map((d: DictData) => ({
          value: d.key,
          label: dictI18n.getLabel(`${dictType}.${d.key}`) || '',
        }))
      }
    return result
  }, [dictData, dictI18n.data])

  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      _filters: any,
      sorter: SorterResult<Torrent> | SorterResult<Torrent>[],
    ) => {
      const s = Array.isArray(sorter) ? sorter[0] : sorter
      const sortMap: Record<string, string> = {
        name: 'name',
        size: 'size',
        seeders: 'seeders',
        leechers: 'leechers',
        completed: 'completed',
        created_at: 'created_at',
      }
      const sortField = sortMap[s.field as string] || 'created_at'
      const sortOrder = s.order === 'ascend' ? 'asc' : 'desc'
      navigate({
        to: '/$lang/torrents',
        params: { lang },
        search: {
          ...search,
          sort: sortField,
          order: sortOrder,
          page: pagination.current || 1,
          page_size: pagination.pageSize || 50,
        } as any,
      })
    },
    [navigate, search],
  )

  const columns: ColumnsType<Torrent> = [
    {
      title: tt('name'),
      dataIndex: 'name',
      key: 'name',
      sorter: { multiple: 1 },
      render: (name: string, record: Torrent) => {
        let promoTag = null
        if (record.promotion && record.promotion !== 'none') {
          if (record.promotion === 'free') promoTag = <Tag color="green">{t('promotions.free')}</Tag>
          else if (record.promotion === 'twoup') promoTag = <Tag color="blue">{t('promotions.twoup')}</Tag>
          else if (record.promotion === 'free_twoup')
            promoTag = <><Tag color="green">{t('promotions.free')}</Tag><Tag color="blue">{t('promotions.twoup')}</Tag></>
          else if (record.promotion === 'thirty_percent')
            promoTag = <Tag color="orange">{t('promotions.thirtyPercent')}</Tag>
        }
        return (
          <div>
            <Space size={4} wrap>
              <Tag color="blue">{getTorrentCategoryLabel(record.category, t)}</Tag>
              {promoTag}
              <Link to="/$lang/torrents/$id" params={{ lang, id: String(record.id) }}>
                {name}
              </Link>
            </Space>
            {record.small_descr && (
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{record.small_descr}</div>
            )}
          </div>
        )
      },
    },
    {
      title: tt('size'),
      dataIndex: 'size',
      key: 'size',
      width: 120,
      sorter: { multiple: 1 },
      render: (size: number) => formatSize(size),
    },
    {
      title: 'SE',
      dataIndex: 'seeders',
      key: 'seeders',
      width: 60,
      sorter: { multiple: 1 },
      render: (n: number) => <Text style={{ color: '#52c41a' }}>{n}</Text>,
    },
    {
      title: 'LE',
      dataIndex: 'leechers',
      key: 'leechers',
      width: 60,
      sorter: { multiple: 1 },
      render: (n: number) => <Text style={{ color: '#faad14' }}>{n}</Text>,
    },
    {
      title: tt('completed'),
      dataIndex: 'completed',
      key: 'completed',
      width: 80,
      sorter: { multiple: 1 },
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
      sorter: { multiple: 1 },
      render: (date: string) => dayjs(date).fromNow(),
    },
  ]

  return (
    <div>
      <Title level={3}>{tt('title')}</Title>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Space wrap align="center" style={{ width: '100%' }}>
          <Search
            placeholder={tt('searchPlaceholder')}
            onSearch={(val) => updateSearch({ keyword: val || undefined })}
            defaultValue={search.keyword}
            allowClear
            style={{ width: 280 }}
          />

          <Tooltip title={tt('filter.activeTooltip')}>
            <Button
              type={search.incldead === 1 ? 'primary' : 'default'}
              icon={<FireOutlined />}
              onClick={() => toggleQuickFilter('incldead', 1)}
            >
              {tt('filter.active')}
            </Button>
          </Tooltip>
          <Select
            mode="multiple"
            value={search.spstate ? String(search.spstate).split(',').filter(Boolean) : []}
            style={{ minWidth: 100 }}
            placeholder={tt('filter.promotion')}
            onChange={(values: string[]) => {
              updateSearch({ spstate: values.length ? values.join(',') : undefined })
            }}
            options={[
              { value: '2', label: tt('filter.free') },
              { value: '3', label: tt('filter.twoup') },
            ]}
          />

          <Select
            value={search.sort === 'seeders' ? 'seeders' : 'created_at'}
            style={{ width: 120 }}
            onChange={(value) => {
              if (value === 'created_at') {
                updateSearch({ sort: 'created_at', order: 'desc' })
              } else {
                updateSearch({ sort: 'seeders', order: 'desc' })
              }
            }}
            options={[
              { value: 'created_at', label: tt('filter.newest') },
              { value: 'seeders', label: tt('filter.mostSeeders') },
            ]}
          />

          <Button
            type={showAdvanced ? 'primary' : 'default'}
            icon={<FilterOutlined />}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {tt('filter.advanced')}
          </Button>
        </Space>
      </Card>

      {showAdvanced && (
        <Card size="small" style={{ marginBottom: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Text strong style={{ marginBottom: 8, display: 'block' }}>{tt('category')}</Text>
              <Checkbox.Group
                value={selectedCategories}
                onChange={(values) =>
                  updateSearch({ categories: values.length ? values.join(',') : undefined })
                }
              >
                <Row gutter={[0, 4]}>
                  {TORRENT_CATEGORIES.map((cat) => (
                    <Col key={cat} span={6}>
                      <Checkbox value={cat}>{getTorrentCategoryLabel(cat, t)}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </div>

            {Object.entries(taxonomyOptions).map(([paramKey, options]) => {
              if (!options.length) return null
              const selected = (search[paramKey as keyof TorrentSearchParams] as string || '').split(',').filter(Boolean)
              const labelKey =
                paramKey === 'standards'
                  ? 'publish.standard'
                  : paramKey === 'audiocodecs'
                    ? 'publish.audiocodec'
                    : `publish.${paramKey.replace(/s$/, '')}`
              return (
                <div key={paramKey}>
                  <Text strong style={{ marginBottom: 8, display: 'block' }}>
                    {tt(labelKey)}
                  </Text>
                  <Checkbox.Group
                    value={selected}
                    onChange={(values) =>
                      updateSearch({ [paramKey]: values.length ? values.join(',') : undefined })
                    }
                  >
                    <Row gutter={[0, 4]}>
                      {options.map((opt) => (
                        <Col key={opt.value} span={6}>
                          <Checkbox value={opt.value}>{opt.label}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </div>
              )
            })}

            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setShowAdvanced(false)
                navigate({ to: '/$lang/torrents', params: { lang }, search: {} as any })
              }}
            >
              {tt('filter.reset')}
            </Button>
          </Space>
        </Card>
      )}

      <Table
        columns={columns}
        dataSource={data?.torrents}
        rowKey="id"
        loading={isLoading}
        onChange={handleTableChange}
        pagination={{
          current: search.page || 1,
          pageSize: search.page_size || 50,
          total: data?.total,
          showTotal: (total) => tt('totalTorrents', { count: total }),
        }}
        size="small"
      />
    </div>
  )
}
