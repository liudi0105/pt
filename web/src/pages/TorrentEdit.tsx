import { useParams, useNavigate } from '@tanstack/react-router'
import { Form, Input, Select, Button, Card, Typography, Space, message, Spin } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getTorrent, editTorrent } from '../api/torrent'
import { getTorrentCategoryOptions } from '../constants/torrent'

const { Title } = Typography
const { TextArea } = Input

export function TorrentEdit() {
  const { t } = useTranslation('torrent')
  const { t: tCommon } = useTranslation('common')
  const { id } = useParams({ from: '/$lang/torrents/$id/edit' })
  const { lang } = useParams({ from: '/$lang' })
  const navigate = useNavigate()
  const torrentId = Number(id)
  const [form] = Form.useForm()

  const { data: torrent, isLoading } = useQuery({
    queryKey: ['torrent', id],
    queryFn: () => getTorrent(torrentId),
    select: (res) => res.data,
  })

  const editMut = useMutation({
    mutationFn: (values: { name: string; description?: string; category: string }) =>
      editTorrent(torrentId, values),
    onSuccess: () => {
      message.success(t('updateSuccess'))
      navigate({ to: '/$lang/torrents/$id', params: { lang, id } })
    },
    onError: (err: any) => message.error(err.response?.data?.error || tCommon('error')),
  })

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />
  if (!torrent) return <p>{t('notFound')}</p>

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate({ to: '/$lang/torrents/$id', params: { lang, id } })}>{tCommon('back')}</Button>
      </Space>
      <Card>
        <Title level={4}>{t('editTitle')}</Title>
        <Form
          form={form}
          labelCol={{ style: { width: 100 } }}
          initialValues={{ name: torrent.name, description: torrent.description, category: torrent.category }}
          onFinish={(values) => editMut.mutate(values)}
        >
          <Form.Item name="name" label={t('name')} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label={t('category')} rules={[{ required: true }]}>
            <Select options={getTorrentCategoryOptions(tCommon)} />
          </Form.Item>
          <Form.Item name="description" label={t('description')}>
            <TextArea rows={8} />
          </Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} block size="large" loading={editMut.isPending}>
            {tCommon('save')}
          </Button>
        </Form>
      </Card>
    </div>
  )
}
