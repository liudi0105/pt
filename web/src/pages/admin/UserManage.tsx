import { useEffect, useState } from 'react'
import {
  Table, Button, Input, Select, Tag, Space, Modal, Form, message, Typography, Popconfirm,
} from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import {
  adminListUsers, adminUpdateUserRole, adminUpdateUserStatus,
  adminUpdateUserTraffic, adminResetPasskey,
} from '../../api/admin'
import type { User } from '../../types'
import { useI18n } from '../../hooks/useI18n'

const { Title } = Typography
const { Search } = Input

export function UserManage() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const navigate = useNavigate()
  const { lang } = useParams({ from: '/$lang' })
  const search = useSearch({ from: '/$lang/admin/users' })
  const roleI18n = useI18n('role')
  const [keywordInput, setKeywordInput] = useState(search.keyword || '')
  const [trafficModal, setTrafficModal] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  })
  const queryClient = useQueryClient()

  useEffect(() => {
    setKeywordInput(search.keyword || '')
  }, [search.keyword])

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', search.page, search.page_size, search.keyword || '', search.role || '', search.status ?? 'all'],
    queryFn: () => adminListUsers({
      page: search.page,
      page_size: search.page_size,
      keyword: search.keyword,
      role: search.role,
      status: search.status,
    }),
    select: (res) => res.data,
  })

  const updateSearch = (patch: Partial<typeof search>) => {
    navigate({
      to: '/$lang/admin/users',
      params: { lang },
      search: { ...search, ...patch },
    })
  }

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) => adminUpdateUserRole(id, role),
    onSuccess: () => {
      message.success(t('userManage.roleSuccess'))
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) => adminUpdateUserStatus(id, status),
    onSuccess: () => {
      message.success(t('userManage.statusSuccess'))
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })

  const updateTraffic = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminUpdateUserTraffic(id, data),
    onSuccess: () => {
      message.success(t('userManage.trafficSuccess'))
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      setTrafficModal({ open: false, user: null })
    },
  })

  const resetPasskey = useMutation({
    mutationFn: (id: number) => adminResetPasskey(id),
    onSuccess: (res) => {
      message.success(t('userManage.newPasskey', { passkey: res.data.passkey }))
    },
  })

  const columns = [
    { title: tCommon('id'), dataIndex: 'id', key: 'id', width: 60 },
    { title: t('userManage.username'), dataIndex: 'username', key: 'username', width: 120 },
    { title: t('userManage.email'), dataIndex: 'email', key: 'email', width: 200 },
    {
      title: t('userManage.role'),
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
            { value: 'user', label: roleI18n.getLabel('user', 'display_name') },
            { value: 'vip', label: roleI18n.getLabel('vip', 'display_name') },
            { value: 'admin', label: roleI18n.getLabel('admin', 'display_name') },
          ]}
        />
      ),
    },
    {
      title: t('userManage.status'),
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) =>
        status === 1 ? <Tag color="green">{tCommon('status.active')}</Tag> : <Tag color="red">{tCommon('status.banned')}</Tag>,
    },
    {
      title: t('userManage.upload'),
      dataIndex: 'upload_bytes',
      key: 'upload_bytes',
      width: 100,
      render: (v: number) => formatBytes(v),
    },
    {
      title: t('userManage.download'),
      dataIndex: 'download_bytes',
      key: 'download_bytes',
      width: 100,
      render: (v: number) => formatBytes(v),
    },
    {
      title: t('userManage.bonus'),
      dataIndex: 'bonus',
      key: 'bonus',
      width: 80,
    },
    {
      title: t('userManage.created'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 100,
      render: (v: string) => new Date(v).toLocaleDateString(),
    },
    {
      title: tCommon('actions'),
      key: 'actions',
      width: 200,
      render: (_: any, record: User) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => setTrafficModal({ open: true, user: record })}
          >
            {t('userManage.traffic')}
          </Button>
          <Popconfirm
            title={record.status === 1 ? t('userManage.banConfirm') : t('userManage.activateConfirm')}
            onConfirm={() => updateStatus.mutate({ id: record.id, status: record.status === 1 ? 0 : 1 })}
          >
            <Button size="small" danger={record.status === 1}>
              {record.status === 1 ? t('userManage.ban') : t('userManage.activate')}
            </Button>
          </Popconfirm>
          <Button size="small" onClick={() => resetPasskey.mutate(record.id)}>
            {t('userManage.resetKey')}
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Title level={3}>{t('userManage.title')}</Title>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder={t('userManage.searchPlaceholder')}
          value={keywordInput}
          onChange={(e) => {
            const value = e.target.value
            setKeywordInput(value)
            if (!value) {
              updateSearch({ keyword: undefined, page: 1 })
            }
          }}
          onSearch={(value) => updateSearch({ keyword: value || undefined, page: 1 })}
          allowClear
          style={{ width: 300 }}
        />
        <Select
          placeholder={t('userManage.rolePlaceholder')}
          value={search.role || undefined}
          onChange={(value) => updateSearch({ role: value || undefined, page: 1 })}
          allowClear
          style={{ width: 120 }}
          options={[
            { value: 'user', label: roleI18n.getLabel('user', 'display_name') },
            { value: 'vip', label: roleI18n.getLabel('vip', 'display_name') },
            { value: 'admin', label: roleI18n.getLabel('admin', 'display_name') },
          ]}
        />
        <Select
          placeholder={t('userManage.statusPlaceholder')}
          value={search.status ?? undefined}
          onChange={(v) => updateSearch({ status: v, page: 1 })}
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
          current: search.page,
          pageSize: search.page_size,
          total: data?.total,
          onChange: (page) => updateSearch({ page }),
        }}
        size="small"
        scroll={{ x: 1200 }}
      />

      <Modal
        title={t('userManage.trafficTitle', { username: trafficModal.user?.username })}
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
          <Form.Item label={t('userManage.uploadLabel')} name="uploaded">
            <Input type="number" />
          </Form.Item>
          <Form.Item label={t('userManage.downloadLabel')} name="downloaded">
            <Input type="number" />
          </Form.Item>
          <Form.Item label={t('userManage.bonusLabel')} name="bonus">
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
