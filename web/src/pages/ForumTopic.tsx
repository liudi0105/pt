import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { Avatar, Button, Card, Col, Empty, Input, List, Pagination, Row, Space, Tag, Typography } from 'antd'
import { createPost, getTopic, listTopicPosts } from '../api/forum'
import { formatDistanceToNow } from '../utils/date'
import { theme } from 'antd'

const { TextArea } = Input

function initials(name?: string) {
  const value = (name || '?').trim()
  return value.slice(0, 2).toUpperCase()
}

export function ForumTopic() {
  const { t } = useTranslation('forum')
  const navigate = useNavigate()
  const { id, lang } = useParams({ from: '/$lang/forum/topic/$id' })
  const { token } = theme.useToken()
  const queryClient = useQueryClient()
  const [reply, setReply] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data: topicData, isLoading: topicLoading } = useQuery({
    queryKey: ['forum-topic', id],
    queryFn: () => getTopic(Number(id)),
  })
  const topic = topicData?.data.topic ?? null

  const { data: postsData } = useQuery({
    queryKey: ['forum-topic-posts', id, page],
    queryFn: () => listTopicPosts(Number(id), { page, page_size: pageSize }),
  })
  const posts = postsData?.data.posts ?? []
  const total = postsData?.data.total ?? 0

  const handleReply = async () => {
    if (!reply.trim()) return
    setSubmitting(true)
    try {
      await createPost(Number(id), { content: reply.trim() })
      setReply('')
      const lastPage = Math.ceil((total + 1) / pageSize)
      if (lastPage === page) {
        queryClient.invalidateQueries({ queryKey: ['forum-topic-posts', id, page] })
      } else {
        setPage(lastPage)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  if (topicLoading) {
    return <Card><Typography.Text>{t('common:loading')}</Typography.Text></Card>
  }

  if (!topic) {
    return <Card><Empty description={t('topicNotFound')} /></Card>
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Button onClick={() => navigate({ to: '/$lang/forum', params: { lang }, search: { forumId: String(topic.forum_id), page: undefined } })}>
        {t('back')}
      </Button>

      <Card>
        <Row gutter={[24, 24]} align="top">
          <Col xs={24} lg={18}>
            <Space direction="vertical" size={10} style={{ width: '100%' }}>
              <Space wrap>
                {topic.is_sticky && <Tag>{t('sticky')}</Tag>}
                {topic.is_locked && <Tag color="red">{t('locked')}</Tag>}
                <Tag>{topic.forum_name || t('categories')}</Tag>
              </Space>
              <Typography.Title level={2} style={{ margin: 0 }}>{topic.title}</Typography.Title>
              <Space wrap size={12}>
                <Typography.Text type="secondary">{topic.username || 'Unknown user'}</Typography.Text>
                <Typography.Text type="secondary">{formatDistanceToNow(topic.created_at)}</Typography.Text>
                <Typography.Text type="secondary">{t('views')}: {topic.views}</Typography.Text>
                <Typography.Text type="secondary">{t('replies')}: {topic.post_count}</Typography.Text>
              </Space>
            </Space>
          </Col>
          <Col xs={24} lg={6}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Card size="small">
                <Typography.Text type="secondary">{t('recent')}</Typography.Text>
                <Typography.Title level={4} style={{ margin: '8px 0 0' }}>{page} / {pageCount}</Typography.Title>
              </Card>
              <Card size="small">
                <Typography.Text type="secondary">Last post</Typography.Text>
                <Typography.Title level={4} style={{ margin: '8px 0 0' }}>{formatDistanceToNow(topic.last_post_at)}</Typography.Title>
              </Card>
            </Space>
          </Col>
        </Row>
      </Card>

      {total > pageSize && (
        <Card size="small">
          <Pagination current={page} pageSize={pageSize} total={total} onChange={setPage} showSizeChanger={false} />
        </Card>
      )}

      <List
        dataSource={posts}
        locale={{ emptyText: <Empty description={t('noPosts')} /> }}
        renderItem={post => (
          <List.Item style={{ padding: 0, border: 'none', marginBottom: 12 }}>
            <Card style={{ width: '100%', background: token.colorBgContainer }}>
              <Space align="start" size={16} style={{ width: '100%' }}>
                <Avatar size={40}>{initials(post.username)}</Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Space wrap size={8}>
                    <Typography.Text strong>{post.username || 'Unknown user'}</Typography.Text>
                    <Typography.Text type="secondary">{formatDistanceToNow(post.created_at)}</Typography.Text>
                    {post.is_first && <Tag>{t('authorPost')}</Tag>}
                  </Space>
                  <div
                    style={{ marginTop: 12, whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content).replace(/\n/g, '<br>') }}
                  />
                </div>
              </Space>
            </Card>
          </List.Item>
        )}
      />

      {topic.is_locked ? (
        <Card>
          <Empty description={t('locked')} />
        </Card>
      ) : (
        <Card title={t('reply')}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <TextArea rows={6} value={reply} onChange={e => setReply(e.target.value)} placeholder={t('replyPlaceholder')} />
            <Space style={{ justifyContent: 'space-between', width: '100%' }} wrap>
              <Typography.Text type="secondary">Supports plain text and line breaks.</Typography.Text>
              <Button type="primary" disabled={submitting || !reply.trim()} loading={submitting} onClick={handleReply}>
                {t('submit')}
              </Button>
            </Space>
          </Space>
        </Card>
      )}
    </Space>
  )
}
