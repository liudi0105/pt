import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@tanstack/react-router'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Card, Empty, Input, List, Pagination, Space, Tag, Typography } from 'antd'
import { searchTopics, type Topic } from '../api/forum'
import { formatDistanceToNow } from '../utils/date'

const { Search } = Input

export function ForumSearch() {
  const { t } = useTranslation('forum')
  const navigate = useNavigate()
  const { lang } = useParams({ from: '/$lang/forum/search' })
  const [query, setQuery] = useState('')
  const [topics, setTopics] = useState<Topic[]>([])
  const [total, setTotal] = useState(0)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const pageSize = 20

  const runSearch = async (pageNum = 1) => {
    if (!query.trim()) return
    setSearched(true)
    setLoading(true)
    try {
      const res = await searchTopics({ q: query.trim(), page: pageNum, page_size: pageSize })
      setTopics(res.data.topics)
      setTotal(res.data.total)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setPage(1)
    await runSearch(1)
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Space direction="vertical" size={4}>
            <Typography.Text type="secondary">{t('search')}</Typography.Text>
            <Typography.Title level={2} style={{ margin: 0 }}>{t('search')}</Typography.Title>
          </Space>

          <Search
            allowClear
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            enterButton={<><SearchOutlined /> {t('search')}</>}
            onSearch={handleSearch}
          />

          <Button onClick={() => navigate({ to: '/$lang/forum', params: { lang }, search: { forumId: undefined, page: undefined } })}>
            {t('back')}
          </Button>
        </Space>
      </Card>

      <Card
        title={searched ? `${t('search')} · ${total}` : t('recent')}
        extra={
          total > pageSize ? (
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={async (nextPage) => {
                setPage(nextPage)
                await runSearch(nextPage)
              }}
              showSizeChanger={false}
            />
          ) : null
        }
      >
        {searched && !loading && topics.length === 0 ? (
          <Empty description={t('noResults')} />
        ) : (
          <List
            dataSource={topics}
            loading={loading}
            locale={{ emptyText: <Empty description={searched ? t('noResults') : t('searchPlaceholder')} /> }}
            renderItem={topic => (
              <List.Item
              style={{ cursor: 'pointer' }}
                onClick={() => navigate({ to: '/$lang/forum/topic/$id', params: { lang, id: String(topic.id) } })}
              >
                <List.Item.Meta
                  title={<Space wrap><Typography.Text strong>{topic.title}</Typography.Text>{topic.is_locked && <Tag color="red">{t('locked')}</Tag>}</Space>}
                  description={
                    <Space wrap size={12}>
                      <Typography.Text type="secondary">{topic.username || 'Unknown user'}</Typography.Text>
                      <Typography.Text type="secondary">{topic.forum_name || '-'}</Typography.Text>
                      <Typography.Text type="secondary">{formatDistanceToNow(topic.last_post_at)}</Typography.Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </Space>
  )
}
