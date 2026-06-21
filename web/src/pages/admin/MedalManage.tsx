import { useState } from 'react'
import { Table, Button, Modal, Form, Input, InputNumber, Typography, Space, message, Popconfirm, Switch } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { listMedals, createMedal, updateMedal, deleteMedal } from '../../api/medal'
import { IconPicker } from '../../components/IconPicker'
import { ColorPickerField } from '../../components/ColorPickerField'
import { iconRegistry } from '../../constants/icons'
import type { Medal, MedalFormValues } from '../../types'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useI18n } from '../../hooks/useI18n'
import { buildI18nMap } from '../../utils/i18nPayload'

const { Title } = Typography

export function MedalManage() {
  const { t } = useTranslation('admin')
  const medalI18n = useI18n('medal')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Medal | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-medals'],
    queryFn: () => listMedals(),
    select: (res) => res.data.medals,
  })

  const createMut = useMutation({
    mutationFn: (values: MedalFormValues) => {
      const payload: Record<string, any> = {
        code: values.code,
        description: values.description,
        image: values.image,
        color: values.color,
        price: values.price,
        is_active: values.is_active,
        i18n: buildI18nMap({
          zh: { label: values.label_zh, description: values.description_zh },
          en: { label: values.label_en, description: values.description_en },
        }),
      }
      return createMedal(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-medals'] })
      queryClient.invalidateQueries({ queryKey: ['db-i18n'] })
      setOpen(false)
      form.resetFields()
      message.success(t('medalManage.createSuccess'))
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('medalManage.createFailed')),
  })

  const updateMut = useMutation({
    mutationFn: (values: MedalFormValues) => {
      const payload: Record<string, any> = {
        code: values.code,
        description: values.description,
        image: values.image,
        color: values.color,
        price: values.price,
        is_active: values.is_active,
        i18n: buildI18nMap({
          zh: { label: values.label_zh, description: values.description_zh },
          en: { label: values.label_en, description: values.description_en },
        }),
      }
      return updateMedal(editing!.id, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-medals'] })
      queryClient.invalidateQueries({ queryKey: ['db-i18n'] })
      setOpen(false)
      setEditing(null)
      form.resetFields()
      message.success(t('medalManage.updateSuccess'))
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('medalManage.updateFailed')),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteMedal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-medals'] })
      queryClient.invalidateQueries({ queryKey: ['db-i18n'] })
      message.success(t('medalManage.deleteSuccess'))
    },
    onError: () => message.error(t('medalManage.deleteFailed')),
  })

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({ is_active: true })
    setOpen(true)
  }

  const openEdit = (record: Medal) => {
    setEditing(record)
    const i18nMap = medalI18n.getEntityI18n(String(record.code)) || {}
    const i18nZh = i18nMap.zh || {}
    const i18nEn = i18nMap.en || {}
    form.setFieldsValue({
      code: record.code,
      description: record.description,
      image: record.image,
      color: record.color,
      price: record.price,
      is_active: record.is_active,
      label_zh: i18nZh.label || '',
      label_en: i18nEn.label || '',
      description_zh: i18nZh.description || '',
      description_en: i18nEn.description || '',
    })
    setOpen(true)
  }

  const columns: ColumnsType<Medal> = [
    { title: t('medalManage.code'), dataIndex: 'code', key: 'code', width: 80 },
    {
      title: t('medalManage.icon'),
      key: 'icon',
      width: 60,
      render: (_: unknown, record: Medal) => {
        const IconComp = record.image ? iconRegistry[record.image] : null
        return IconComp ? <IconComp size={20} color={record.color || undefined} /> : '-'
      },
    },
    {
      title: t('medalManage.display'),
      key: 'display',
      render: (_: unknown, record: Medal) => {
        return medalI18n.getLabel(String(record.code)) || ''
      },
    },
    {
      title: t('medalManage.description'),
      key: 'description',
      render: (_: unknown, record: Medal) => {
        return medalI18n.getLabel(String(record.code), 'description') || ''
      },
    },
    { title: t('medalManage.price'), dataIndex: 'price', key: 'price', width: 80 },
    {
      title: t('medalManage.active'),
      dataIndex: 'is_active',
      key: 'is_active',
      width: 80,
      render: (v: boolean) => (v ? t('common:boolean.yes') : t('common:boolean.no')),
    },
    {
      title: t('medalManage.created'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (d: string) => dayjs(d).format('YYYY-MM-DD'),
    },
    {
      title: t('common:actions'),
      key: 'actions',
      width: 120,
      render: (_, r: Medal) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm title={t('medalManage.deleteConfirm')} onConfirm={() => deleteMut.mutate(r.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Title level={4} style={{ margin: 0 }}>{t('medalManage.title')}</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>{t('medalManage.addMedal')}</Button>
      </Space>

      <Table columns={columns} dataSource={data} rowKey="id" loading={isLoading} size="small" pagination={false} />

      <Modal
        title={editing ? t('medalManage.editTitle') : t('medalManage.addTitle')}
        open={open}
        onCancel={() => { setOpen(false); setEditing(null) }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          labelCol={{ style: { width: 110 } }}
          initialValues={{ is_active: true }}
          onFinish={(values: MedalFormValues) => {
            if (editing) {
              updateMut.mutate(values)
            } else {
              createMut.mutate(values)
            }
          }}
        >
          <Form.Item name="code" label={t('medalManage.codeLabel')} rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label={t('medalManage.descriptionLabel')}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="image" label={t('medalManage.iconLabel')}>
            <IconPicker />
          </Form.Item>
          <Form.Item name="color" label={t('medalManage.colorLabel')}>
            <ColorPickerField />
          </Form.Item>
          <Form.Item name="price" label={t('medalManage.priceLabel')} rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="is_active" label={t('medalManage.activeLabel')} valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="label_zh" label={t('medalManage.labelZh')}>
            <Input />
          </Form.Item>
          <Form.Item name="label_en" label={t('medalManage.labelEn')}>
            <Input />
          </Form.Item>
          <Form.Item name="description_zh" label={t('medalManage.descriptionZh')}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="description_en" label={t('medalManage.descriptionEn')}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={createMut.isPending || updateMut.isPending}>
            {t('common:' + (editing ? 'update' : 'create'))}
          </Button>
        </Form>
      </Modal>
    </div>
  )
}
