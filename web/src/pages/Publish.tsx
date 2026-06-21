import { useEffect, useState } from 'react'
import {
  Form, Input, Select, Button, Switch, Upload as AntUpload, message,
  Typography, Card, Descriptions, Alert, Collapse, Space,
} from 'antd'
import { InboxOutlined, FileTextOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { uploadTorrent } from '../api/torrent'
import { getDictData } from '../api/dict'
import type { DictData } from '../types'
import { useAuthStore } from '../store/auth'
import { useTranslation } from 'react-i18next'
import { formatSize } from '../utils/format'
import { getTorrentCategoryOptions, PUBLISH_DICT_TYPES, PUBLISH_META_FIELDS } from '../constants/torrent'

const { Title } = Typography
const { Dragger } = AntUpload
const { TextArea } = Input
const { Panel } = Collapse

function dictOptions(data: Record<string, DictData[]> | undefined, typeKey: string, lang: string) {
  const items = data?.[typeKey] ?? []
  return items.map(d => ({
    value: d.key,
    label: d.i18n?.[lang]?.label || '',
  }))
}

export function Publish() {
  const [form] = Form.useForm()
  const [file, setFile] = useState<File | null>(null)
  const [nfoFile, setNfoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { lang } = useParams({ from: '/$lang' })
  const { token } = useAuthStore()
  const { t: tt } = useTranslation('torrent')
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation()

  const { data: dictData } = useQuery({
    queryKey: ['dict-data', PUBLISH_DICT_TYPES],
    queryFn: () => getDictData([...PUBLISH_DICT_TYPES]),
    select: (res) => res.data.data,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (!token) {
      navigate({ to: '/$lang/login', params: { lang }, replace: true })
    }
  }, [lang, navigate, token])

  const suggestedTitle = file
    ? file.name.replace(/\.torrent$/i, '').replace(/[._]+/g, ' ').trim()
    : ''

  const handleSubmit = async () => {
    if (!file) {
      message.error(tt('pleaseSelectFile'))
      return
    }

    const values = await form.validateFields()
    const formData = new FormData()
    formData.append('torrent_file', file)
    formData.append('name', values.name?.trim() || suggestedTitle)
    formData.append('description', values.description || '')
    formData.append('category', values.category)

    const metaFields = [...PUBLISH_META_FIELDS]
    for (const field of metaFields) {
      const v = values[field]
      if (v) formData.append(field, v)
    }

    if (values.small_descr) formData.append('small_descr', values.small_descr)
    if (values.technical_info) formData.append('technical_info', values.technical_info)
    if (values.cover) formData.append('cover', values.cover)
    if (values.tags?.length) formData.append('tags', values.tags.join(','))
    if (nfoFile) formData.append('nfo', nfoFile)

    setLoading(true)
    try {
      const res = await uploadTorrent(formData)
      message.success(tt('uploadSuccess'))
      navigate({ to: '/$lang/torrents/$id', params: { lang, id: String(res.data.id) } })
    } catch {
      message.error(tt('uploadFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <Title level={3}>{tt('publish.title')}</Title>
      <Form form={form} labelCol={{ style: { width: 100 } }}>
        <Card title={tt('publish.basicInfo')} style={{ marginBottom: 16 }}>
          <Form.Item
            name="name"
            label={tt('name')}
            rules={[{ required: true, message: tt('name') }]}
            tooltip={suggestedTitle || ''}
          >
            <Input placeholder={suggestedTitle} />
          </Form.Item>

          <Form.Item name="small_descr" label={tt('publish.smallDescr')}>
            <Input placeholder={tt('publish.smallDescr')} />
          </Form.Item>

          <Form.Item name="category" label={tt('category')} rules={[{ required: true }]}>
            <Select options={getTorrentCategoryOptions(tCommon)} />
          </Form.Item>
        </Card>

        <Card title={tt('publish.metadata')} style={{ marginBottom: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Space style={{ width: '100%' }} wrap>
              <Form.Item name="source" label={tt('publish.source')}>
                <Select allowClear style={{ minWidth: 180 }} options={dictOptions(dictData, 'source', lang)} />
              </Form.Item>
              <Form.Item name="codec" label={tt('publish.codec')}>
                <Select allowClear style={{ minWidth: 180 }} options={dictOptions(dictData, 'codec', lang)} />
              </Form.Item>
            </Space>
            <Space style={{ width: '100%' }} wrap>
              <Form.Item name="standard" label={tt('publish.standard')}>
                <Select allowClear style={{ minWidth: 180 }} options={dictOptions(dictData, 'resolution', lang)} />
              </Form.Item>
              <Form.Item name="processing" label={tt('publish.processing')}>
                <Select allowClear style={{ minWidth: 180 }} options={dictOptions(dictData, 'processing', lang)} />
              </Form.Item>
            </Space>
            <Space style={{ width: '100%' }} wrap>
              <Form.Item name="team" label={tt('publish.team')}>
                <Select allowClear style={{ minWidth: 180 }} options={dictOptions(dictData, 'team', lang)} />
              </Form.Item>
              <Form.Item name="audiocodec" label={tt('publish.audiocodec')}>
                <Select allowClear style={{ minWidth: 180 }} options={dictOptions(dictData, 'audio', lang)} />
              </Form.Item>
            </Space>
          </Space>
        </Card>

        <Card title={tt('description')} style={{ marginBottom: 16 }}>
          <Form.Item name="description" label={tt('description')}>
            <TextArea rows={8} placeholder={tt('description')} />
          </Form.Item>
        </Card>

        <Collapse style={{ marginBottom: 16 }} ghost>
          <Panel header={tt('publish.tags')} key="tags">
            <Form.Item name="tags">
              <Select mode="tags" placeholder={tt('publish.tags')}
                open={false}
                tokenSeparators={[',']}
              />
            </Form.Item>
          </Panel>
          <Panel header={tt('publish.technicalInfo')} key="technical">
            <Form.Item name="technical_info">
              <TextArea rows={4} placeholder={tt('publish.technicalInfo')} />
            </Form.Item>
          </Panel>
          <Panel header={tt('publish.cover')} key="cover">
            <Form.Item name="cover">
              <Input placeholder="https://example.com/cover.jpg" />
            </Form.Item>
          </Panel>
        </Collapse>

        <Card title={tt('publish.files')} style={{ marginBottom: 16 }}>
          <Form.Item label={tt('publish.torrentFile')} required>
            <Dragger
              beforeUpload={(f) => {
                setFile(f)
                if (!form.getFieldValue('name')) {
                  form.setFieldValue('name',
                    f.name.replace(/\.torrent$/i, '').replace(/[._]+/g, ' ').trim())
                }
                return false
              }}
              onRemove={() => setFile(null)}
              accept=".torrent"
              maxCount={1}
            >
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">{tt('clickOrDragTorrent')}</p>
            </Dragger>
          </Form.Item>

          <Form.Item label={tt('publish.nfo')}>
            <Dragger
              beforeUpload={(f) => { setNfoFile(f); return false }}
              onRemove={() => setNfoFile(null)}
              accept=".nfo,.txt"
              maxCount={1}
            >
              <p className="ant-upload-drag-icon"><FileTextOutlined /></p>
              <p className="ant-upload-text">{tt('publish.uploadNfo')}</p>
            </Dragger>
          </Form.Item>
        </Card>

        {file && (
          <Card size="small" style={{ marginBottom: 16 }} title={tt('name')}>
            <Descriptions size="small" column={1}>
              <Descriptions.Item label={tt('name')}>{file.name}</Descriptions.Item>
              <Descriptions.Item label={tt('size')}>{formatSize(file.size)}</Descriptions.Item>
            </Descriptions>
            <Alert style={{ marginTop: 12 }} type="info" showIcon
              message={tt('publish.confirmInfo')}
            />
          </Card>
        )}

        <Collapse style={{ marginBottom: 16 }} ghost>
          <Panel header={tt('publish.advanced')} key="advanced">
            <Alert style={{ marginBottom: 16 }} type="warning" showIcon
              message={tt('publish.privilegedNote')}
            />
            <Space wrap>
              <Form.Item name="hr" label={tt('publish.hr')} valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="sticky" label={tt('publish.sticky')}>
                <Select style={{ width: 120 }}>
                  <Select.Option value="">{t('status.no')}</Select.Option>
                  <Select.Option value="1">1</Select.Option>
                  <Select.Option value="2">2</Select.Option>
                  <Select.Option value="3">3</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="pick" label={tt('publish.pick')}>
                <Select style={{ width: 120 }} allowClear>
                  <Select.Option value="recommend">{t('status.yes')}</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="price" label={tt('publish.price')}>
                <Input type="number" style={{ width: 120 }} />
              </Form.Item>
            </Space>
          </Panel>
        </Collapse>

        <Button type="primary" onClick={handleSubmit} loading={loading} block size="large">
          {tt('publish.title')}
        </Button>
      </Form>
    </div>
  )
}
