import { useState } from 'react'
import { Table, Button, Modal, Form, Input, InputNumber, Typography, Space, message, Popconfirm, Switch } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listMedals, createMedal, deleteMedal } from '../../api/medal'
import type { Medal } from '../../types'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

const { Title } = Typography

export function MedalManage() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-medals'],
    queryFn: () => listMedals(),
    select: (res) => res.data.medals,
  })

  const createMut = useMutation({
    mutationFn: (values: Partial<Medal>) => createMedal(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-medals'] })
      setOpen(false)
      form.resetFields()
      message.success(t('medalManage.createSuccess'))
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('medalManage.createFailed')),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteMedal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-medals'] })
      message.success(t('medalManage.deleteSuccess'))
    },
    onError: () => message.error(t('medalManage.deleteFailed')),
  })

  const columns: ColumnsType<Medal> = [
    {
      title: t('medalManage.code'),
      dataIndex: 'code',
      key: 'code',
      width: 80,
    },
    {
      title: t('medalManage.display'),
      key: 'display',
      render: (_: unknown, record: Medal) => tCommon(`medals.${record.code}`, { defaultValue: `Medal ${record.code}` }),
    },
    {
      title: t('medalManage.description'),
      key: 'description',
      render: (_: unknown, record: Medal) => tCommon(`medalDescriptions.${record.code}`, { defaultValue: record.description }),
    },
    { title: t('medalManage.price'), dataIndex: 'price', key: 'price', width: 80 },
    {
      title: t('medalManage.active'),
      dataIndex: 'is_active',
      key: 'is_active',
      width: 80,
      render: (v: boolean) => (v ? tCommon('status.yes') : tCommon('status.no')),
    },
    {
      title: t('medalManage.created'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (d: string) => dayjs(d).format('YYYY-MM-DD'),
    },
    {
      title: tCommon('actions'),
      key: 'actions',
      width: 80,
      render: (_, r: Medal) => (
        <Popconfirm title={t('medalManage.deleteConfirm')} onConfirm={() => deleteMut.mutate(r.id)}>
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Title level={4} style={{ margin: 0 }}>{t('medalManage.title')}</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>{t('medalManage.addMedal')}</Button>
      </Space>

      <Table columns={columns} dataSource={data} rowKey="id" loading={isLoading} size="small" pagination={false} />

      <Modal title={t('medalManage.addTitle')} open={open} onCancel={() => setOpen(false)} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" initialValues={{ is_active: true }} onFinish={(values) => createMut.mutate(values)}>
          <Form.Item name="code" label={t('medalManage.codeLabel')} rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label={t('medalManage.descriptionLabel')}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="image" label={t('medalManage.imageUrlLabel')}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label={t('medalManage.priceLabel')} rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="is_active" label={t('medalManage.activeLabel')} valuePropName="checked">
            <Switch />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={createMut.isPending}>{tCommon('create')}</Button>
        </Form>
      </Modal>
    </div>
  )
}
