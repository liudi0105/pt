import { useState } from 'react'
import {
  Table, Button, Modal, Form, Input, Switch, DatePicker, Space, message, Typography, Popconfirm,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../api/admin'
import type { Announcement } from '../../types'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

const { Title } = Typography
const { TextArea } = Input

export function AnnouncementManage() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<Announcement | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'announcements'],
    queryFn: () => listAnnouncements(),
    select: (res) => res.data.announcements,
  })

  const createMut = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
      setModalOpen(false)
      message.success(t('announcements.created'))
    },
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Announcement> }) => updateAnnouncement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
      setModalOpen(false)
      message.success(t('announcements.updated'))
    },
  })
  const deleteMut = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'announcements'] })
      message.success(t('announcements.deleted'))
    },
  })

  const columns = [
    { title: t('announcements.title'), dataIndex: 'title', key: 'title' },
    {
      title: t('announcements.sticky'),
      dataIndex: 'is_sticky',
      key: 'is_sticky',
      width: 80,
      render: (v: boolean) => v ? tCommon('boolean.yes') : tCommon('boolean.no'),
    },
    {
      title: t('announcements.active'),
      dataIndex: 'is_active',
      key: 'is_active',
      width: 80,
      render: (v: boolean) => v ? tCommon('boolean.yes') : tCommon('boolean.no'),
    },
    {
      title: t('announcements.expiresAt'),
      dataIndex: 'expires_at',
      key: 'expires_at',
      render: (v: string) => v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: tCommon('actions'),
      key: 'actions',
      width: 120,
      render: (_: unknown, record: Announcement) => (
        <Space>
          <Button size="small" onClick={() => { setEditingRecord(record); form.setFieldsValue({
            ...record,
            expires_at: record.expires_at ? dayjs(record.expires_at) : null,
          }); setModalOpen(true) }}>
            {tCommon('edit')}
          </Button>
          <Popconfirm title={t('announcements.deleteConfirm')} onConfirm={() => deleteMut.mutate(record.id)}>
            <Button size="small" danger>{tCommon('delete')}</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Title level={3} style={{ margin: 0 }}>{t('announcements.title')}</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
          setEditingRecord(null)
          form.resetFields()
          setModalOpen(true)
        }}>
          {t('announcements.create')}
        </Button>
      </Space>

      <Table columns={columns} dataSource={data} rowKey="id" loading={isLoading} size="small" pagination={false} />

      <Modal
        title={editingRecord ? t('announcements.edit') : t('announcements.create')}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={640}
      >
        <Form form={form} labelCol={{ style: { width: 110 } }} onFinish={(values) => {
          const payload = {
            ...values,
            expires_at: values.expires_at?.toISOString() ?? null,
          }
          if (editingRecord) {
            updateMut.mutate({ id: editingRecord.id, data: payload })
          } else {
            createMut.mutate(payload)
          }
        }}>
          <Form.Item name="title" label={t('announcements.title')} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label={t('announcements.content')}>
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item name="is_sticky" label={t('announcements.sticky')} valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="expires_at" label={t('announcements.expiresAt')}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="is_active" label={t('announcements.active')} valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={createMut.isPending || updateMut.isPending}>
            {editingRecord ? tCommon('update') : tCommon('create')}
          </Button>
        </Form>
      </Modal>
    </div>
  )
}
