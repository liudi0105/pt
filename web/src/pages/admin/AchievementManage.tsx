import { useState } from 'react'
import { Table, Button, Modal, Form, Input, InputNumber, Typography, Space, message, Popconfirm, Switch, Tag, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listAchievements, createAchievement, updateAchievement, deleteAchievement } from '../../api/achievement'
import { IconPicker } from '../../components/IconPicker'
import { ColorPickerField } from '../../components/ColorPickerField'
import { iconRegistry } from '../../constants/icons'
import type { Achievement } from '../../types'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

const { Title } = Typography

const GROUP_OPTIONS = [
  { value: 'upload', label: 'achievementGroup.upload' },
  { value: 'seed', label: 'achievementGroup.seed' },
  { value: 'community', label: 'achievementGroup.community' },
  { value: 'special', label: 'achievementGroup.special' },
  { value: 'other', label: 'achievementGroup.other' },
]

const CONDITION_LABEL_MAP: Record<string, string> = {
  upload_count: 'condition.uploadCount',
  upload_bytes: 'condition.uploadBytes',
  download_bytes: 'condition.downloadBytes',
  seed_hours: 'condition.seedHours',
  thanks_received: 'condition.thanksReceived',
  post_count: 'condition.postCount',
  days_since_join: 'condition.daysSinceJoin',
};

const CONDITION_TYPE_OPTIONS = [
  { value: 'upload_count', label: 'condition.uploadCount' },
  { value: 'upload_bytes', label: 'condition.uploadBytes' },
  { value: 'download_bytes', label: 'condition.downloadBytes' },
  { value: 'seed_hours', label: 'condition.seedHours' },
  { value: 'thanks_received', label: 'condition.thanksReceived' },
  { value: 'post_count', label: 'condition.postCount' },
  { value: 'days_since_join', label: 'condition.daysSinceJoin' },
]

export function AchievementManage() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Achievement | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-achievements'],
    queryFn: () => listAchievements(),
    select: (res) => res.data.achievements,
  })

  const createMut = useMutation({
    mutationFn: (values: any) => {
      const condition = JSON.stringify({ type: values.condition_type, gte: values.condition_value })
      return createAchievement({ ...values, condition })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-achievements'] })
      setOpen(false)
      form.resetFields()
      message.success(t('achievementManage.createSuccess'))
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('achievementManage.createFailed')),
  })

  const updateMut = useMutation({
    mutationFn: (values: any) => {
      const condition = JSON.stringify({ type: values.condition_type, gte: values.condition_value })
      return updateAchievement(editing!.id, { ...values, condition })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-achievements'] })
      setOpen(false)
      setEditing(null)
      form.resetFields()
      message.success(t('achievementManage.updateSuccess'))
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('achievementManage.updateFailed')),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteAchievement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-achievements'] })
      message.success(t('achievementManage.deleteSuccess'))
    },
    onError: () => message.error(t('achievementManage.deleteFailed')),
  })

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({ is_active: true })
    setOpen(true)
  }

  const openEdit = (record: Achievement) => {
    setEditing(record)
    let condType = ''
    let condValue = 0
    try {
      const cond = JSON.parse(record.condition)
      condType = cond.type || ''
      condValue = cond.gte || 0
    } catch {}
    form.setFieldsValue({
      code: record.code,
      name: record.name,
      description: record.description,
      icon: record.icon,
      color: record.color,
      group: record.group,
      condition_type: condType,
      condition_value: condValue,
      is_active: record.is_active,
    })
    setOpen(true)
  }

  const columns: ColumnsType<Achievement> = [
    { title: t('achievementManage.code'), dataIndex: 'code', key: 'code', width: 80 },
    {
      title: t('achievementManage.icon'),
      key: 'icon',
      width: 60,
      render: (_: unknown, record: Achievement) => {
        const IconComp = record.icon ? iconRegistry[record.icon] : null
        return IconComp ? <IconComp size={20} color={record.color || undefined} /> : '-'
      },
    },
    {
      title: t('achievementManage.display'),
      key: 'display',
      width: 160,
      render: (_: unknown, record: Achievement) =>
        tCommon(`achievements.${record.code}`, { defaultValue: record.name || `Achievement ${record.code}` }),
    },
    {
      title: t('achievementManage.group'),
      dataIndex: 'group',
      key: 'group',
      width: 100,
      render: (g: string) => <Tag>{tCommon(`achievementGroup.${g}`)}</Tag>,
    },
    {
      title: t('achievementManage.condition'),
      key: 'condition',
      width: 200,
      ellipsis: true,
      render: (_: unknown, record: Achievement) => {
        try {
          const c = JSON.parse(record.condition)
          const label = CONDITION_LABEL_MAP[c.type] || c.type
          return `${t(label)} >= ${c.gte}`
        } catch {
          return record.condition
        }
      },
    },
    {
      title: t('achievementManage.active'),
      dataIndex: 'is_active',
      key: 'is_active',
      width: 80,
      render: (v: boolean) => (v ? tCommon('status.yes') : tCommon('status.no')),
    },
    {
      title: tCommon('createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (d: string) => dayjs(d).format('YYYY-MM-DD'),
    },
    {
      title: tCommon('actions'),
      key: 'actions',
      width: 120,
      render: (_, r: Achievement) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm title={t('achievementManage.deleteConfirm')} onConfirm={() => deleteMut.mutate(r.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Title level={4} style={{ margin: 0 }}>{t('achievementManage.title')}</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>{t('achievementManage.addAchievement')}</Button>
      </Space>

      <Table columns={columns} dataSource={data} rowKey="id" loading={isLoading} size="small" pagination={false} />

      <Modal
        title={editing ? t('achievementManage.editTitle') : t('achievementManage.addTitle')}
        open={open}
        onCancel={() => { setOpen(false); setEditing(null) }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          labelCol={{ style: { width: 110 } }}
          initialValues={{ is_active: true }}
          onFinish={(values) => {
            if (editing) {
              updateMut.mutate(values)
            } else {
              createMut.mutate(values)
            }
          }}
        >
          <Form.Item name="code" label={t('achievementManage.codeLabel')} rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="name" label={t('achievementManage.nameLabel')}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label={t('achievementManage.descriptionLabel')}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="icon" label={t('achievementManage.iconLabel')}>
            <IconPicker />
          </Form.Item>
          <Form.Item name="color" label={t('achievementManage.colorLabel')}>
            <ColorPickerField />
          </Form.Item>
          <Form.Item name="group" label={t('achievementManage.groupLabel')} rules={[{ required: true }]}>
            <Select options={GROUP_OPTIONS.map(o => ({ ...o, label: t(o.label) }))} />
          </Form.Item>
          <Form.Item name="condition_type" label={t('achievementManage.conditionTypeLabel')} rules={[{ required: true }]}>
            <Select options={CONDITION_TYPE_OPTIONS.map(o => ({ ...o, label: t(o.label) }))} />
          </Form.Item>
          <Form.Item name="condition_value" label={t('achievementManage.conditionValueLabel')} rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="is_active" label={t('achievementManage.activeLabel')} valuePropName="checked">
            <Switch />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={createMut.isPending || updateMut.isPending}>
            {tCommon(editing ? 'update' : 'create')}
          </Button>
        </Form>
      </Modal>
    </div>
  )
}
