import { useState } from 'react'
import { Table, Button, Modal, Form, Input, InputNumber, Typography, Space, message, Checkbox, Tag, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SafetyOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { listRoles, createRole, updateRole, deleteRole, setRolePermissions, listPermissions } from '../../api/admin'
import type { RoleModel, Permission } from '../../types'
import type { ColumnsType } from 'antd/es/table'

const { Title } = Typography

export function RoleManage() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const [editOpen, setEditOpen] = useState(false)
  const [permOpen, setPermOpen] = useState<RoleModel | null>(null)
  const [editingRole, setEditingRole] = useState<RoleModel | null>(null)
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
      form.setFieldsValue(role)
    } else {
      form.resetFields()
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
    { title: t('roleManage.name'), dataIndex: 'name', key: 'name', width: 120 },
    { title: t('roleManage.displayName'), dataIndex: 'display_name', key: 'display_name', width: 120 },
    { title: t('roleManage.description'), dataIndex: 'description', key: 'description' },
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

      <Modal title={editingRole ? t('roleManage.editTitle') : t('roleManage.newTitle')} open={editOpen} onCancel={() => { setEditOpen(false); setEditingRole(null) }} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={(values) => {
          if (editingRole) {
            updateMut.mutate({ id: editingRole.id, data: values })
          } else {
            createMut.mutate(values)
          }
        }}>
          <Form.Item name="name" label={t('roleManage.nameLabel')} rules={[{ required: true }]}>
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
          <Button type="primary" htmlType="submit" block loading={createMut.isPending || updateMut.isPending}>
            {editingRole ? tCommon('update') : tCommon('create')}
          </Button>
        </Form>
      </Modal>

      <Modal title={t('roleManage.permTitle', { name: permOpen?.display_name || permOpen?.name })} open={!!permOpen} onCancel={() => setPermOpen(null)} footer={null} width={600}>
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
