import { useState } from 'react'
import {
  Table, Button, Input, Select, Tag, Space, Modal, Form, message, Typography, Popconfirm,
} from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  adminListUsers, adminUpdateUserRole, adminUpdateUserStatus,
  adminUpdateUserTraffic, adminResetPasskey,
} from '../../api/admin'
import type { User } from '../../types'

const { Title } = Typography
const { Search } = Input

export function UserManage() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<number>(0)
  const [trafficModal, setTrafficModal] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  })
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', page, keyword, roleFilter, statusFilter],
    queryFn: () => adminListUsers({ page, keyword, role: roleFilter, status: statusFilter, page_size: 20 }),
    select: (res) => res.data,
  })

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) => adminUpdateUserRole(id, role),
    onSuccess: () => {
      message.success(t('roleSuccess'))
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) => adminUpdateUserStatus(id, status),
    onSuccess: () => {
      message.success(t('statusSuccess'))
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })

  const updateTraffic = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminUpdateUserTraffic(id, data),
    onSuccess: () => {
      message.success(t('trafficSuccess'))
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      setTrafficModal({ open: false, user: null })
    },
  })

  const resetPasskey = useMutation({
    mutationFn: (id: number) => adminResetPasskey(id),
    onSuccess: (res) => {
      message.success(t('newPasskey', { passkey: res.data.passkey }))
    },
  })

  const columns = [
    { title: tCommon('id'), dataIndex: 'id', key: 'id', width: 60 },
    { title: t('username'), dataIndex: 'username', key: 'username', width: 120 },
    { title: t('email'), dataIndex: 'email', key: 'email', width: 200 },
    {
      title: t('role'),
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string, record: User) => (
        <Select
          value={role}
          size="small"
          style={{ width: 100 }}
          onChange={(v) => updateRole.mutate({ id: record.id, role: v })}
          options={[
            { value: 'user', label: t('roleUser') },
            { value: 'vip', label: t('roleVip') },
            { value: 'admin', label: t('roleAdmin') },
          ]}
        />
      ),
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) =>
        status === 1 ? <Tag color="green">{tCommon('status.active')}</Tag> : <Tag color="red">{tCommon('status.banned')}</Tag>,
    },
    {
      title: t('upload'),
      dataIndex: 'upload_bytes',
      key: 'upload_bytes',
      width: 100,
      render: (v: number) => formatBytes(v),
    },
    {
      title: t('download'),
      dataIndex: 'download_bytes',
      key: 'download_bytes',
      width: 100,
      render: (v: number) => formatBytes(v),
    },
    {
      title: t('bonus'),
      dataIndex: 'bonus',
      key: 'bonus',
      width: 80,
    },
    {
      title: t('created'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 100,
      render: (v: string) => new Date(v).toLocaleDateString(),
    },
    {
      title: t('actions'),
      key: 'actions',
      width: 200,
      render: (_: any, record: User) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => setTrafficModal({ open: true, user: record })}
          >
            {t('traffic')}
          </Button>
          <Popconfirm
            title={record.status === 1 ? t('banConfirm') : t('activateConfirm')}
            onConfirm={() => updateStatus.mutate({ id: record.id, status: record.status === 1 ? 0 : 1 })}
          >
            <Button size="small" danger={record.status === 1}>
              {record.status === 1 ? t('ban') : t('activate')}
            </Button>
          </Popconfirm>
          <Button size="small" onClick={() => resetPasskey.mutate(record.id)}>
            {t('resetKey')}
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Title level={3}>{t('title')}</Title>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder={t('searchPlaceholder')}
          onSearch={setKeyword}
          allowClear
          style={{ width: 300 }}
        />
        <Select
          placeholder={t('rolePlaceholder')}
          value={roleFilter || undefined}
          onChange={setRoleFilter}
          allowClear
          style={{ width: 120 }}
          options={[
            { value: 'user', label: t('roleUser') },
            { value: 'vip', label: t('roleVip') },
            { value: 'admin', label: t('roleAdmin') },
          ]}
        />
        <Select
          placeholder={t('statusPlaceholder')}
          value={statusFilter || undefined}
          onChange={(v) => setStatusFilter(v ?? 0)}
          allowClear
          style={{ width: 120 }}
          options={[
            { value: 1, label: tCommon('status.active') },
            { value: 0, label: tCommon('status.banned') },
          ]}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={data?.users}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: 20,
          total: data?.total,
          onChange: setPage,
        }}
        size="small"
        scroll={{ x: 1200 }}
      />

      <Modal
        title={t('trafficTitle', { username: trafficModal.user?.username })}
        open={trafficModal.open}
        onCancel={() => setTrafficModal({ open: false, user: null })}
        footer={null}
      >
        <Form
          labelCol={{ style: { width: 110 } }}
          onFinish={(values) => {
            if (!trafficModal.user) return
            updateTraffic.mutate({
              id: trafficModal.user.id,
              data: {
                uploaded: values.uploaded ? Number(values.uploaded) : 0,
                downloaded: values.downloaded ? Number(values.downloaded) : 0,
                bonus: values.bonus ? Number(values.bonus) : undefined,
              },
            })
          }}
        >
          <Form.Item label={t('uploadLabel')} name="uploaded">
            <Input type="number" />
          </Form.Item>
          <Form.Item label={t('downloadLabel')} name="downloaded">
            <Input type="number" />
          </Form.Item>
          <Form.Item label={t('bonusLabel')} name="bonus">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={updateTraffic.isPending}>
            {tCommon('apply')}
          </Button>
        </Form>
      </Modal>
    </div>
  )
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}
