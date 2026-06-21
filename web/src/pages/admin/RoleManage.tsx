import { useState } from 'react'
import { Table, Button, Modal, Form, Input, InputNumber, Typography, Space, message, Checkbox, Tag, Popconfirm, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SafetyOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { listRoles, createRole, updateRole, deleteRole, setRolePermissions, listPermissions } from '../../api/admin'
import type { RoleModel, Permission } from '../../types'
import type { ColumnsType } from 'antd/es/table'
import { useI18n } from '../../hooks/useI18n'

const { Title } = Typography

interface LocaleRow {
  locale: string
  display_name: string
  description: string
}

const LOCALE_OPTIONS = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
  { value: 'jp', label: '日本語' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ko', label: '한국어' },
  { value: 'ru', label: 'Русский' },
  { value: 'es', label: 'Español' },
]

function i18nToRows(i18n: Record<string, Record<string, string>> | undefined): LocaleRow[] {
  if (!i18n) return []
  return Object.entries(i18n).map(([locale, fields]) => ({
    locale,
    display_name: fields.display_name || '',
    description: fields.description || '',
  }))
}

function rowsToI18n(rows: LocaleRow[]): Record<string, Record<string, string>> {
  const i18n: Record<string, Record<string, string>> = {}
  for (const row of rows) {
    if (!row.locale) continue
    i18n[row.locale] = {
      display_name: row.display_name || '',
      description: row.description || '',
    }
  }
  return i18n
}

export function RoleManage() {
  const { t, i18n } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const currentLang = i18n.language?.startsWith('zh') ? 'zh' : 'en'
  const roleI18n = useI18n('role')
  const [editOpen, setEditOpen] = useState(false)
  const [permOpen, setPermOpen] = useState<RoleModel | null>(null)
  const [editingRole, setEditingRole] = useState<RoleModel | null>(null)
  const [i18nRows, setI18nRows] = useState<LocaleRow[]>([])
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { data: roles, isLoading } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: () => listRoles(),
    select: (res) => res.data.roles,
  })

  const { data: permissions } = useQuery({
    queryKey: ['admin-permissions'],
    queryFn: () => listPermissions(),
    select: (res) => res.data.permissions,
  })

  const createMut = useMutation({
    mutationFn: (values: Partial<RoleModel>) => createRole(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] })
      queryClient.invalidateQueries({ queryKey: ['db-i18n'] })
      setEditOpen(false)
      form.resetFields()
      message.success(t('roleManage.createSuccess'))
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('roleManage.failed')),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<RoleModel> }) => updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] })
      queryClient.invalidateQueries({ queryKey: ['db-i18n'] })
      setEditOpen(false)
      setEditingRole(null)
      message.success(t('roleManage.updateSuccess'))
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('roleManage.failed')),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] })
      queryClient.invalidateQueries({ queryKey: ['db-i18n'] })
      message.success(t('roleManage.deleteSuccess'))
    },
    onError: () => message.error(t('roleManage.deleteFailed')),
  })

  const permMut = useMutation({
    mutationFn: ({ id, permission_ids }: { id: number; permission_ids: number[] }) => setRolePermissions(id, permission_ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] })
      setPermOpen(null)
      message.success(t('roleManage.permSuccess'))
    },
    onError: () => message.error(t('roleManage.permFailed')),
  })

  const openEdit = (role?: RoleModel) => {
    setEditingRole(role || null)
    if (role) {
      const i18nMap = roleI18n.getEntityI18n(role.key)?.[currentLang] || {}
      form.setFieldsValue({
        ...role,
        display_name: i18nMap.display_name || '',
        description: i18nMap.description || '',
      })
      setI18nRows(i18nToRows(roleI18n.getEntityI18n(role.key)))
    } else {
      form.resetFields()
      setI18nRows([])
    }
    setEditOpen(true)
  }

  const grouped = (permissions ?? []).reduce<Record<string, Permission[]>>((acc, p) => {
    if (!acc[p.group]) acc[p.group] = []
    acc[p.group].push(p)
    return acc
  }, {})

  const columns: ColumnsType<RoleModel> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: t('roleManage.key'), dataIndex: 'key', key: 'key', width: 120 },
    { title: t('roleManage.displayName'), key: 'display_name', width: 120, render: (_: unknown, record: RoleModel) => roleI18n.getLabel(record.key, 'display_name') },
    { title: t('roleManage.description'), key: 'description', render: (_: unknown, record: RoleModel) => roleI18n.getLabel(record.key, 'description') },
    {
      title: t('roleManage.system'),
      dataIndex: 'is_system',
      key: 'is_system',
      width: 70,
      render: (v: boolean) => v ? <Tag color="red">{t('roleManage.system')}</Tag> : null,
    },
    {
      title: t('roleManage.order'),
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 60,
    },
    {
      title: t('roleManage.permissions'),
      key: 'perms',
      width: 100,
      render: (_, r: RoleModel) => (
        <Button size="small" icon={<SafetyOutlined />} onClick={() => setPermOpen(r)}>
          {r.permissions?.length ?? 0}
        </Button>
      ),
    },
    {
      title: tCommon('actions'),
      key: 'actions',
      width: 100,
      render: (_, r: RoleModel) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          {!r.is_system && (
            <Popconfirm title={t('roleManage.deleteConfirm')} onConfirm={() => deleteMut.mutate(r.id)}>
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Title level={4} style={{ margin: 0 }}>{t('roleManage.title')}</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openEdit()}>{t('roleManage.addRole')}</Button>
      </Space>

      <Table columns={columns} dataSource={roles} rowKey="id" loading={isLoading} size="small" pagination={false} />

      <Modal title={editingRole ? t('roleManage.editTitle') : t('roleManage.newTitle')} open={editOpen} onCancel={() => { setEditOpen(false); setEditingRole(null); setI18nRows([]) }} footer={null} destroyOnClose>
        <Form form={form} labelCol={{ style: { width: 110 } }} onFinish={(values) => {
          const mergedI18n = rowsToI18n(i18nRows)
          mergedI18n[currentLang] = {
            ...(mergedI18n[currentLang] || {}),
            display_name: values.display_name || '',
            description: values.description || '',
          }
          const payload = {
            ...values,
            i18n: mergedI18n,
          }
          if (editingRole) {
            updateMut.mutate({ id: editingRole.id, data: payload })
          } else {
            createMut.mutate(payload)
          }
        }}>
          <Form.Item name="key" label={t('roleManage.keyLabel')} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="display_name" label={t('roleManage.displayNameLabel')}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label={t('roleManage.descriptionLabel')}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="sort_order" label={t('roleManage.sortOrderLabel')}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
            {t('dictManage.i18nLabel')}
          </Typography.Text>
          {i18nRows.map((row, idx) => (
            <Space key={row.locale} style={{ display: 'flex', marginBottom: 8 }} align="start">
              <Select
                value={row.locale}
                onChange={(v) => {
                  const next = [...i18nRows]
                  next[idx] = { ...next[idx], locale: v }
                  setI18nRows(next)
                }}
                style={{ width: 100 }}
                options={LOCALE_OPTIONS}
              />
              <Input
                placeholder={t('roleManage.displayNameLabel')}
                value={row.display_name}
                onChange={(e) => {
                  const next = [...i18nRows]
                  next[idx] = { ...next[idx], display_name: e.target.value }
                  setI18nRows(next)
                }}
                style={{ width: 150 }}
              />
              <Input
                placeholder={t('roleManage.descriptionLabel')}
                value={row.description}
                onChange={(e) => {
                  const next = [...i18nRows]
                  next[idx] = { ...next[idx], description: e.target.value }
                  setI18nRows(next)
                }}
                style={{ width: 180 }}
              />
              <Button type="text" danger onClick={() => setI18nRows((prev) => prev.filter((_, i) => i !== idx))}>
                {tCommon('delete')}
              </Button>
            </Space>
          ))}
          <Button
            type="dashed"
            size="small"
            icon={<PlusOutlined />}
            style={{ marginBottom: 16 }}
            onClick={() => setI18nRows((prev) => [...prev, { locale: '', display_name: '', description: '' }])}
          >
            {t('dictManage.addLocale')}
          </Button>

          <Button type="primary" htmlType="submit" block loading={createMut.isPending || updateMut.isPending}>
            {editingRole ? tCommon('update') : tCommon('create')}
          </Button>
        </Form>
      </Modal>

      <Modal title={t('roleManage.permTitle', { name: permOpen ? roleI18n.getLabel(permOpen.key, 'display_name') : '' })} open={!!permOpen} onCancel={() => setPermOpen(null)} footer={null} width={600}>
        {permOpen && (
          <div>
            {Object.entries(grouped).map(([group, perms]) => (
              <div key={group} style={{ marginBottom: 16 }}>
                <Title level={5} style={{ textTransform: 'capitalize' }}>{group}</Title>
                <Checkbox.Group
                  defaultValue={(permOpen.permissions ?? []).map(p => p.id)}
                  onChange={(checked) => {
                    permMut.mutate({ id: permOpen.id, permission_ids: checked as number[] })
                  }}
                >
                  <Space direction="vertical">
                    {perms.map(p => (
                      <Checkbox key={p.id} value={p.id}>
                        <Space size={4}>
                          <code>{p.code}</code>
                          <span style={{ color: '#888', fontSize: 12 }}>{p.name}</span>
                        </Space>
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
