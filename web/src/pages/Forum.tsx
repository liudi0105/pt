import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { CommentOutlined, FireOutlined, FolderOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Badge, Button, Card, Col, Empty, List, Pagination, Row, Space, Tag, Typography } from 'antd'
import { listForums, listForumTopics, listRecentTopics, type Forum, type Topic } from '../api/forum'
import { formatDistanceToNow } from '../utils/date'

const heroStyle: React.CSSProperties = {
  borderRadius: 24,
  border: '1px solid rgba(255,255,255,0.08)',
  background:
    'radial-gradient(circle at top right, rgba(34,197,94,0.18), transparent 28%), radial-gradient(circle at bottom left, rgba(14,165,233,0.22), transparent 32%), linear-gradient(135deg, #0f172a 0%, #111827 55%, #020617 100%)',
  color: '#e2e8f0',
  boxShadow: '0 24px 80px rgba(2, 6, 23, 0.45)',
}

export function Forum() {
  const { t } = useTranslation('forum')
  const navigate = useNavigate()
  const search = useSearch({ from: '/$lang/forum' }) as { forumId?: string }
  const [forums, setForums] = useState<Forum[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [forumName, setForumName] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    listForums().then(res => setForums(res.data.forums))
  }, [])

  useEffect(() => {
    setPage(1)
  }, [search.forumId])

  const activeForum = useMemo(() => {
    if (!search.forumId) return null
    return forums.find(f => String(f.id) === search.forumId) ?? null
  }, [forums, search.forumId])

  const loadTopics = useCallback((forumId: number, pageNum = page) => {
    setLoading(true)
    return listForumTopics(forumId, { page: pageNum, page_size: pageSize })
      .then(res => {
        setTopics(res.data.topics)
        setTotal(res.data.total)
        setForumName(res.data.forum?.name || '')
      })
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => {
    if (search.forumId) {
      void loadTopics(Number(search.forumId), page)
      return
    }

    setLoading(true)
    listRecentTopics({ page, page_size: pageSize })
      .then(res => {
        setTopics(res.data.topics)
        setTotal(res.data.total)
        setForumName(t('recent'))
      })
      .finally(() => setLoading(false))
  }, [search.forumId, page, t, loadTopics])

  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card styles={{ body: { ...heroStyle, padding: 28 } }}>
        <Row gutter={[24, 24]} align="middle" justify="space-between">
          <Col xs={24} lg={15}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Typography.Text style={{ color: '#7dd3fc', letterSpacing: 3, textTransform: 'uppercase', fontSize: 12 }}>
                {t('title')}
              </Typography.Text>
              <Typography.Title level={2} style={{ color: '#fff', margin: 0 }}>
                {search.forumId ? forumName || activeForum?.name || t('title') : t('recent')}
              </Typography.Title>
              <Typography.Paragraph style={{ color: '#cbd5e1', marginBottom: 0, maxWidth: 760 }}>
                {search.forumId
                  ? activeForum?.description || 'Browse this board, follow active topics, and jump into the discussion.'
                  : 'Browse the newest topics across the community or jump into a category from the sidebar.'}
              </Typography.Paragraph>
            </Space>
          </Col>
          <Col xs={24} lg={9}>
            <Space wrap>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate({ to: '/$lang/forum/new', params: { lang: '' }, search: { forumId: search.forumId } })}>
                {t('newTopic')}
              </Button>
              <Button icon={<SearchOutlined />} onClick={() => navigate({ to: '/$lang/forum/search', params: { lang: '' } })}>
                {t('search')}
              </Button>
              <Button onClick={() => navigate({ to: '/$lang/forum', params: { lang: '' }, search: { forumId: undefined } })}>
                {t('recent')}
              </Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col xs={24} md={8}>
            <Card size="small" styles={{ body: { background: 'rgba(255,255,255,0.04)' } }}>
              <Typography.Text type="secondary">{t('categories')}</Typography.Text>
              <Typography.Title level={3} style={{ margin: '8px 0 0', color: '#fff' }}>
                {forums.length}
              </Typography.Title>
              <Typography.Text style={{ color: '#cbd5e1' }}>Available boards</Typography.Text>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" styles={{ body: { background: 'rgba(255,255,255,0.04)' } }}>
              <Typography.Text type="secondary">{t('topic')}</Typography.Text>
              <Typography.Title level={3} style={{ margin: '8px 0 0', color: '#fff' }}>
                {topics.length}
              </Typography.Title>
              <Typography.Text style={{ color: '#cbd5e1' }}>Topics on this page</Typography.Text>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" styles={{ body: { background: 'rgba(255,255,255,0.04)' } }}>
              <Typography.Text type="secondary">{t('recent')}</Typography.Text>
              <Typography.Title level={3} style={{ margin: '8px 0 0', color: '#fff' }}>
                {page} / {pageCount}
              </Typography.Title>
              <Typography.Text style={{ color: '#cbd5e1' }}>Page view</Typography.Text>
            </Card>
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        <Col xs={24} lg={7}>
          <Card
            title={t('categories')}
            extra={<Badge count={forums.length} />}
            styles={{ body: { paddingTop: 12 } }}
          >
            <List
              dataSource={forums}
              locale={{ emptyText: <Empty description={t('noTopics')} /> }}
              renderItem={f => (
                <List.Item
                  style={{
                    cursor: 'pointer',
                    paddingInline: 12,
                    borderRadius: 16,
                    background: search.forumId === String(f.id) ? 'rgba(14,165,233,0.08)' : undefined,
                  }}
                  onClick={() => navigate({ to: '/$lang/forum', params: { lang: '' }, search: { forumId: String(f.id) } })}
                >
                  <List.Item.Meta
                    avatar={<FolderOutlined style={{ fontSize: 20, color: '#0ea5e9' }} />}
                    title={<Typography.Text strong>{f.name}</Typography.Text>}
                    description={f.description || t('recent')}
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card style={{ marginTop: 16 }} styles={{ body: { background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(59,130,246,0.08))' } }}>
            <Space direction="vertical" size={8}>
              <Typography.Text type="secondary">Quick actions</Typography.Text>
              <Typography.Paragraph style={{ marginBottom: 0 }}>
                Create a topic, search threads, or return to the latest activity feed.
              </Typography.Paragraph>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={17}>
          <Card
            title={search.forumId ? forumName || t('categories') : t('recent')}
            extra={(
              <Space>
                <Button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  {t('common:prev')}
                </Button>
                <Typography.Text>{page} / {pageCount}</Typography.Text>
                <Button disabled={page >= pageCount} onClick={() => setPage(p => p + 1)}>
                  {t('common:next')}
                </Button>
              </Space>
            )}
          >
            {loading ? (
              <Typography.Text>{t('common:loading')}</Typography.Text>
            ) : topics.length === 0 ? (
              <Empty
                description={t('noTopics')}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={() => navigate({ to: '/$lang/forum/new', params: { lang: '' }, search: { forumId: search.forumId } })}>
                  {t('newTopic')}
                </Button>
              </Empty>
            ) : (
              <List
                itemLayout="vertical"
                dataSource={topics}
                renderItem={topic => (
                  <List.Item
                    key={topic.id}
                    style={{
                      cursor: 'pointer',
                      borderRadius: 18,
                      paddingInline: 16,
                      background: 'rgba(2,6,23,0.02)',
                      marginBottom: 12,
                    }}
                    onClick={() => navigate({ to: '/$lang/forum/topic/$id', params: { lang: '', id: String(topic.id) } })}
                  >
                    <Space direction="vertical" size={6} style={{ width: '100%' }}>
                      <Space wrap>
                        {topic.is_sticky && <Tag color="gold" icon={<FireOutlined />}>{t('sticky')}</Tag>}
                        {topic.is_locked && <Tag color="red">{t('locked')}</Tag>}
                        <Tag color="geekblue">{topic.forum_name || forumName || t('categories')}</Tag>
                      </Space>
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        {topic.title}
                      </Typography.Title>
                      <Space wrap size={16}>
                        <Typography.Text type="secondary">{topic.username || 'Unknown user'}</Typography.Text>
                        <Typography.Text type="secondary">{formatDistanceToNow(topic.created_at)}</Typography.Text>
                        <Typography.Text type="secondary">Last active {formatDistanceToNow(topic.last_post_at)}</Typography.Text>
                      </Space>
                      <Space wrap size={8}>
                        <Tag icon={<CommentOutlined />}>{t('replies')}: {topic.post_count}</Tag>
                        <Tag>{t('views')}: {topic.views}</Tag>
                      </Space>
                    </Space>
                  </List.Item>
                )}
              />
            )}

            {total > pageSize && (
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
                <Pagination current={page} pageSize={pageSize} total={total} onChange={setPage} showSizeChanger={false} />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Space>
  )
}
