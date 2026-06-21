import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { CommentOutlined, FireOutlined, FolderOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Badge, Button, Card, Col, Empty, List, Pagination, Row, Space, Tag, Typography, theme } from 'antd'
import { listForums, listForumTopics, listRecentTopics } from '../api/forum'
import { formatDistanceToNow } from '../utils/date'

export function Forum() {
  const { t } = useTranslation('forum')
  const navigate = useNavigate()
  const { lang } = useParams({ from: '/$lang' })
  const { token } = theme.useToken()
  const search = useSearch({ from: '/$lang/forum/' })
  const page = search.page ?? 1
  const pageSize = 20

  const validForumId = search.forumId && !isNaN(Number(search.forumId)) ? search.forumId : null

  const { data: forumsData } = useSuspenseQuery({
    queryKey: ['forums'],
    queryFn: () => listForums(),
    staleTime: 5 * 60 * 1000,
  })
  const forums = forumsData?.data.forums ?? []

  const activeForum = useMemo(() => {
    if (!validForumId) return null
    return forums.find(f => String(f.id) === validForumId) ?? null
  }, [forums, validForumId])

  const { data: topicsData } = useSuspenseQuery({
    queryKey: validForumId ? ['forum-topics', validForumId, page] : ['forum-recent', page],
    queryFn: () => {
      if (validForumId) {
        return listForumTopics(Number(validForumId), { page, page_size: pageSize })
      }
      return listRecentTopics({ page, page_size: pageSize })
    },
  })
  const topics = topicsData?.data.topics ?? []
  const total = topicsData?.data.total ?? 0
  const forumName = validForumId ? activeForum?.name || '' : t('recent')

  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card style={{ borderRadius: 12 }}>
        <Row gutter={[24, 24]} align="middle" justify="space-between">
          <Col xs={24} lg={15}>
            <Space direction="vertical" size={10} style={{ width: '100%' }}>
              <Typography.Text type="secondary" style={{ letterSpacing: 2, textTransform: 'uppercase', fontSize: 12 }}>
                {t('title')}
              </Typography.Text>
              <Typography.Title level={2} style={{ margin: 0 }}>
                {validForumId ? forumName || activeForum?.name || t('title') : t('recent')}
              </Typography.Title>
              <Typography.Paragraph type="secondary" style={{ marginBottom: 0, maxWidth: 760 }}>
                {validForumId
                  ? activeForum?.description || 'Browse this board and join the discussion.'
                  : 'Browse the latest active topics across the community.'}
              </Typography.Paragraph>
            </Space>
          </Col>
          <Col xs={24} lg={9}>
            <Space wrap>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate({ to: '/$lang/forum/new', params: { lang }, search: { forumId: search.forumId } })}>
                {t('newTopic')}
              </Button>
              <Button icon={<SearchOutlined />} onClick={() => navigate({ to: '/$lang/forum/search', params: { lang } })}>
                {t('search')}
              </Button>
              <Button onClick={() => navigate({ to: '/$lang/forum', params: { lang }, search: { forumId: undefined, page: undefined } })}>
                {t('recent')}
              </Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col xs={24} md={8}>
            <Card size="small">
              <Typography.Text type="secondary">{t('categories')}</Typography.Text>
              <Typography.Title level={3} style={{ margin: '8px 0 0' }}>{forums.length}</Typography.Title>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small">
              <Typography.Text type="secondary">{t('topic')}</Typography.Text>
              <Typography.Title level={3} style={{ margin: '8px 0 0' }}>{topics.length}</Typography.Title>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small">
              <Typography.Text type="secondary">{t('recent')}</Typography.Text>
              <Typography.Title level={3} style={{ margin: '8px 0 0' }}>{page} / {pageCount}</Typography.Title>
            </Card>
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        <Col xs={24} lg={7}>
          <Card title={t('categories')} extra={<Badge count={forums.length} />}>
            <List
              dataSource={forums}
              locale={{ emptyText: <Empty description={t('noCategories')} /> }}
              renderItem={f => (
                <List.Item
                  style={{
                    cursor: 'pointer',
                    paddingInline: 12,
                    borderRadius: 8,
                    background: search.forumId === String(f.id) ? token.colorFillAlter : 'transparent',
                  }}
                  onClick={() => navigate({ to: '/$lang/forum', params: { lang }, search: { forumId: String(f.id), page: undefined } })}
                >
                  <List.Item.Meta
                    avatar={<FolderOutlined style={{ fontSize: 18 }} />}
                    title={<Typography.Text strong>{f.name}</Typography.Text>}
                    description={f.description || t('recent')}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={17}>
          <Card
            title={validForumId ? forumName || t('categories') : t('recent')}
            extra={(
              <Space>
                <Button disabled={page <= 1} onClick={() => navigate({ to: '/$lang/forum', params: { lang }, search: { forumId: search.forumId, page: page - 1 } })}>
                  {t('common:prev')}
                </Button>
                <Typography.Text>{page} / {pageCount}</Typography.Text>
                <Button disabled={page >= pageCount} onClick={() => navigate({ to: '/$lang/forum', params: { lang }, search: { forumId: search.forumId, page: page + 1 } })}>
                  {t('common:next')}
                </Button>
              </Space>
            )}
          >
            {topics.length === 0 ? (
              <Empty
                description={t('noTopics')}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={() => navigate({ to: '/$lang/forum/new', params: { lang }, search: { forumId: search.forumId } })}>
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
                      borderRadius: 8,
                      paddingInline: 16,
                      background: token.colorFillAlter,
                      marginBottom: 12,
                    }}
                    onClick={() => navigate({ to: '/$lang/forum/topic/$id', params: { lang, id: String(topic.id) } })}
                  >
                    <Space direction="vertical" size={6} style={{ width: '100%' }}>
                      <Space wrap>
                        {topic.is_sticky && <Tag icon={<FireOutlined />}>{t('sticky')}</Tag>}
                        {topic.is_locked && <Tag color="red">{t('locked')}</Tag>}
                        <Tag>{topic.forum_name || forumName || t('categories')}</Tag>
                      </Space>
                      <Typography.Title level={5} style={{ margin: 0 }}>{topic.title}</Typography.Title>
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
                <Pagination current={page} pageSize={pageSize} total={total} onChange={(p) => navigate({ to: '/$lang/forum', params: { lang }, search: { forumId: search.forumId, page: p } })} showSizeChanger={false} />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Space>
  )
}
