import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@tanstack/react-router'
import DOMPurify from 'dompurify'
import { Avatar, Button, Card, Col, Empty, Input, List, Pagination, Row, Space, Tag, Typography } from 'antd'
import { createPost, getTopic, listTopicPosts, type Post, type Topic } from '../api/forum'
import { formatDistanceToNow } from '../utils/date'

const { TextArea } = Input

function initials(name?: string) {
  const value = (name || '?').trim()
  return value.slice(0, 2).toUpperCase()
}

export function ForumTopic() {
  const { t } = useTranslation('forum')
  const navigate = useNavigate()
  const { id } = useParams({ from: '/$lang/forum/topic/$id' })
  const [topic, setTopic] = useState<Topic | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 20

  const load = (pageNum = page) => {
    setLoading(true)
    return Promise.all([
      getTopic(Number(id)),
      listTopicPosts(Number(id), { page: pageNum, page_size: pageSize }),
    ]).then(([tRes, pRes]) => {
      setTopic(tRes.data.topic)
      setPosts(pRes.data.posts)
      setTotal(pRes.data.total)
    }).finally(() => setLoading(false))
  }

  useEffect(() => {
    void load()
  }, [id, page])

  const handleReply = async () => {
    if (!reply.trim()) return
    setSubmitting(true)
    try {
      await createPost(Number(id), { content: reply.trim() })
      setReply('')
      const lastPage = Math.ceil((total + 1) / pageSize)
      if (lastPage === page) {
        await load(page)
      } else {
        setPage(lastPage)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  if (loading) {
    return (
      <Card>
        <Typography.Text>{t('common:loading')}</Typography.Text>
      </Card>
    )
  }

  if (!topic) {
    return (
      <Card>
        <Empty description={t('topicNotFound')} />
      </Card>
    )
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col>
          <Button onClick={() => navigate({ to: '/$lang/forum', params: { lang: '' }, search: { forumId: String(topic.forum_id) } })}>
            {t('back')}
          </Button>
        </Col>
        <Col>
          <Space wrap>
            {topic.is_sticky && <Tag color="gold">{t('sticky')}</Tag>}
            {topic.is_locked && <Tag color="red">{t('locked')}</Tag>}
            <Tag color="blue">{topic.forum_name || t('categories')}</Tag>
          </Space>
        </Col>
      </Row>

      <Card>
        <Row gutter={24} align="middle">
          <Col xs={24} lg={16}>
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              {topic.title}
            </Typography.Title>
            <Space wrap size={12}>
              <Typography.Text type="secondary">{topic.username || 'Unknown user'}</Typography.Text>
              <Typography.Text type="secondary">{formatDistanceToNow(topic.created_at)}</Typography.Text>
              <Typography.Text type="secondary">{t('views')}: {topic.views}</Typography.Text>
              <Typography.Text type="secondary">{t('replies')}: {topic.post_count}</Typography.Text>
            </Space>
          </Col>
          <Col xs={24} lg={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Card size="small">
                <Typography.Text type="secondary">{t('recent')}</Typography.Text>
                <Typography.Title level={4} style={{ margin: '8px 0 0' }}>
                  {page} / {pageCount}
                </Typography.Title>
              </Card>
              <Card size="small">
                <Typography.Text type="secondary">Last post</Typography.Text>
                <Typography.Title level={4} style={{ margin: '8px 0 0' }}>
                  {formatDistanceToNow(topic.last_post_at)}
                </Typography.Title>
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
        locale={{ emptyText: <Empty description={t('noTopics')} /> }}
        renderItem={post => (
          <List.Item style={{ padding: 0, border: 'none' }}>
            <Card style={{ width: '100%' }}>
              <Space align="start" size={16} style={{ width: '100%' }}>
                <Avatar size={48} style={{ background: 'linear-gradient(135deg, #22d3ee, #3b82f6)', color: '#020617', fontWeight: 700 }}>
                  {initials(post.username)}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Space wrap size={8}>
                    <Typography.Text strong>{post.username || 'Unknown user'}</Typography.Text>
                    <Typography.Text type="secondary">{formatDistanceToNow(post.created_at)}</Typography.Text>
                    {post.is_first && <Tag color="cyan">{t('authorPost')}</Tag>}
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
