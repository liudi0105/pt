import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { BookOutlined, EditOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Col, Form, Input, Row, Select, Space, Typography } from 'antd'
import { createTopic, listForums } from '../api/forum'

const { TextArea } = Input

export function ForumNewTopic() {
  const { t } = useTranslation('forum')
  const navigate = useNavigate()
  const { lang } = useParams({ from: '/$lang/forum/new' })
  const search = useSearch({ from: '/$lang/forum/new' }) as { forumId?: string }
  const [forumId, setForumId] = useState<number>(Number(search.forumId) || 0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { data: forumsData } = useQuery({
    queryKey: ['forums'],
    queryFn: () => listForums(),
    staleTime: 5 * 60 * 1000,
  })
  const forums = forumsData?.data.forums ?? []

  const handleSubmit = async () => {
    if (!forumId || !title.trim() || !content.trim()) return
    setSubmitting(true)
      try {
        const res = await createTopic({ forum_id: forumId, title: title.trim(), content: content.trim() })
      navigate({ to: '/$lang/forum/topic/$id', params: { lang, id: String(res.data.topic.id) } })
      } finally {
        setSubmitting(false)
      }
  }

  return (
    <Row gutter={24}>
      <Col xs={24} xl={16}>
        <Card
          title={
            <Space>
              <EditOutlined />
              <span>{t('newTopic')}</span>
            </Space>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              type="info"
              showIcon
              message="Use a clear title and keep the first post focused on the topic."
            />

            <Form labelCol={{ style: { width: 100 } }}>
              <Form.Item label={t('category')} required>
                <Select
                  value={forumId}
                  onChange={setForumId}
                  options={[
                    { value: 0, label: t('selectCategory') },
                    ...forums.map(f => ({ value: f.id, label: f.name })),
                  ]}
                />
              </Form.Item>

              <Form.Item label={t('title')} required>
                <Input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  maxLength={255}
                  placeholder={t('titlePlaceholder')}
                />
              </Form.Item>

              <Form.Item label={t('content')} required>
                <TextArea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder={t('contentPlaceholder')}
                  autoSize={{ minRows: 10, maxRows: 18 }}
                />
              </Form.Item>
            </Form>

            <Space wrap>
              <Button
                type="primary"
                loading={submitting}
                disabled={!forumId || !title.trim() || !content.trim()}
                onClick={handleSubmit}
              >
                {t('submit')}
              </Button>
              <Button onClick={() => navigate({ to: '/$lang/forum', params: { lang }, search: { forumId: undefined, page: undefined } })}>
                {t('common:cancel')}
              </Button>
            </Space>
          </Space>
        </Card>
      </Col>

      <Col xs={24} xl={8}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title={<Space><BookOutlined /><span>{t('categories')}</span></Space>}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Typography.Text type="secondary">
                Select the category first so the topic lands in the right board.
              </Typography.Text>
              <Select
                value={forumId}
                onChange={setForumId}
                style={{ width: '100%' }}
                options={[
                  { value: 0, label: t('selectCategory') },
                  ...forums.map(f => ({ value: f.id, label: f.name })),
                ]}
              />
            </Space>
          </Card>

          <Card title="Writing tips">
            <Space direction="vertical" size={8}>
              <Typography.Text type="secondary">A strong first post improves reply quality.</Typography.Text>
              <Typography.Text type="secondary">Use line breaks to separate context, question, and links.</Typography.Text>
              <Typography.Text type="secondary">Keep the topic title short and descriptive.</Typography.Text>
            </Space>
          </Card>
        </Space>
      </Col>
    </Row>
  )
}
