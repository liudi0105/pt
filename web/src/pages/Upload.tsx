import { useState } from 'react'
import {
  Form,
  Input,
  Select,
  Button,
  Upload as AntUpload,
  message,
  Typography,
  Card,
} from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from '@tanstack/react-router'
import { uploadTorrent } from '../api/torrent'
import { useAuthStore } from '../store/auth'
import { useTranslation } from 'react-i18next'

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

  if (!token) {
    navigate({ to: `/${lang}/login` })
    return null
  }

  const handleSubmit = async () => {
    if (!file) {
      message.error(t('torrent.pleaseSelectFile'))
      return
    }

    const values = await form.validateFields()
    const formData = new FormData()
    formData.append('torrent_file', file)
    formData.append('name', values.name)
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
          <Form.Item name="name" label={t('torrent.name')} rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="category" label={t('torrent.category')} rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'movie', label: t('categories.movies') },
                { value: 'tv', label: t('categories.tv') },
                { value: 'music', label: t('categories.music') },
                { value: 'software', label: t('categories.software') },
              ]}
            />
          </Form.Item>

          <Form.Item name="description" label={t('torrent.description')}>
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label={t('torrent.torrentFile')} required>
            <Dragger
              beforeUpload={(f) => {
                setFile(f)
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
