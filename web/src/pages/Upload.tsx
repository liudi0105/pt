import { useEffect, useState } from 'react'
import {
  Form,
  Input,
  Select,
  Button,
  Upload as AntUpload,
  message,
  Typography,
  Card,
  Descriptions,
  Alert,
} from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from '@tanstack/react-router'
import { uploadTorrent } from '../api/torrent'
import { useAuthStore } from '../store/auth'
import { useTranslation } from 'react-i18next'
import { formatSize } from '../utils/format'

const { Title } = Typography
const { Dragger } = AntUpload
const { TextArea } = Input

export function Upload() {
  const [form] = Form.useForm()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { lang } = useParams({ from: '/$lang' })
  const { token } = useAuthStore()
  const { t } = useTranslation()

  useEffect(() => {
    if (!token) {
      navigate({ to: `/${lang}/login`, replace: true })
    }
  }, [lang, navigate, token])

  const suggestedTitle = file
    ? file.name.replace(/\.torrent$/i, '').replace(/[._]+/g, ' ').trim()
    : ''

  const handleSubmit = async () => {
    if (!file) {
      message.error(t('torrent.pleaseSelectFile'))
      return
    }

    const values = await form.validateFields()
    const formData = new FormData()
    formData.append('torrent_file', file)
    formData.append('name', values.name?.trim() || suggestedTitle)
    formData.append('description', values.description || '')
    formData.append('category', values.category)

    setLoading(true)
    try {
      const res = await uploadTorrent(formData)
      message.success(t('torrent.uploadSuccess'))
      navigate({ to: `/${lang}/torrents/$id`, params: { id: res.data.id } })
    } catch {
      message.error(t('torrent.uploadFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Title level={3}>{t('torrent.uploadTitle')}</Title>
      <Card>
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={t('torrent.name')}
            rules={[{ required: true }]}
            tooltip="可留空后自动从种子文件名生成"
          >
            <Input placeholder={suggestedTitle || '输入发布标题'} />
          </Form.Item>

          <Form.Item name="category" label={t('torrent.category')} rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'movie', label: t('categories.movies') },
                { value: 'tv', label: t('categories.tv') },
                { value: 'music', label: t('categories.music') },
                { value: 'game', label: 'Games' },
                { value: 'software', label: t('categories.software') },
                { value: 'documentary', label: 'Documentary' },
                { value: 'anime', label: 'Anime' },
                { value: 'ebook', label: 'E-Book' },
              ]}
            />
          </Form.Item>

          <Form.Item name="description" label={t('torrent.description')}>
            <TextArea rows={4} placeholder="补充内容、来源、发布说明等" />
          </Form.Item>

          <Form.Item label={t('torrent.torrentFile')} required>
            <Dragger
              beforeUpload={(f) => {
                setFile(f)
                if (!form.getFieldValue('name')) {
                  form.setFieldValue('name', f.name.replace(/\.torrent$/i, '').replace(/[._]+/g, ' ').trim())
                }
                return false
              }}
              onRemove={() => setFile(null)}
              accept=".torrent"
              maxCount={1}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">{t('torrent.clickOrDragTorrent')}</p>
            </Dragger>
          </Form.Item>

          {file && (
            <Card size="small" style={{ marginBottom: 16 }} title="候选信息">
              <Descriptions size="small" column={1}>
                <Descriptions.Item label="文件名">{file.name}</Descriptions.Item>
                <Descriptions.Item label="文件大小">{formatSize(file.size)}</Descriptions.Item>
                <Descriptions.Item label="候选标题">{suggestedTitle || '未生成'}</Descriptions.Item>
              </Descriptions>
              <Alert
                style={{ marginTop: 12 }}
                type="info"
                showIcon
                message="发布前请确认标题、分类和种子文件是否正确"
              />
            </Card>
          )}

          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            block
            size="large"
          >
            {t('nav.upload')}
          </Button>
        </Form>
      </Card>
    </div>
  )
}
