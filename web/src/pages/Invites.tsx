import { Table, Tag, Typography, Space, Button, message, Alert } from 'antd'
import { CopyOutlined, PlusOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listInvites, createInvite } from '../api/invite'
import type { Invite } from '../types'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

const { Title } = Typography

export function Invites() {
  const { t } = useTranslation('torrent')
  const { t: tCommon } = useTranslation('common')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['invites'],
    queryFn: () => listInvites(),
    select: (res) => res.data.invites,
  })

  const createMut = useMutation({
    mutationFn: () => createInvite(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] })
      message.success(t('inviteCreated'))
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('failedToCreateInvite')),
  })

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    message.success(t('inviteCodeCopied'))
  }

  const columns: ColumnsType<Invite> = [
    {
      title: t('code'),
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => (
        <Space>
          <code style={{ fontSize: 12 }}>{code}</code>
          <Button size="small" icon={<CopyOutlined />} onClick={() => copyCode(code)} />
        </Space>
      ),
    },
    {
      title: tCommon('status'),
      dataIndex: 'is_used',
      key: 'is_used',
      width: 100,
      render: (used: boolean) => used
        ? <Tag color="default" icon={<CloseCircleOutlined />}>{tCommon('status.used')}</Tag>
        : <Tag color="green" icon={<CheckCircleOutlined />}>{tCommon('status.active')}</Tag>,
    },
    {
      title: t('usedBy'),
      dataIndex: 'used_by_username',
      key: 'used_by_username',
      width: 120,
      render: (name: string) => name || '-',
    },
    {
      title: tCommon('expires'),
      dataIndex: 'expires_at',
      key: 'expires_at',
      width: 120,
      render: (d: string) => dayjs(d).format('YYYY-MM-DD'),
    },
    {
      title: tCommon('created'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (d: string) => dayjs(d).format('YYYY-MM-DD'),
    },
  ]

  const activeCount = data?.filter((i: Invite) => !i.is_used).length ?? 0

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Title level={3} style={{ margin: 0 }}>{tCommon('nav.invites')}</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => createMut.mutate()} loading={createMut.isPending}>
          {t('createInviteBonus')}
        </Button>
      </Space>

      <Alert message={t('activeInvitesCount', { count: activeCount })} type="info" showIcon style={{ marginBottom: 16 }} />

      <Table columns={columns} dataSource={data} rowKey="id" loading={isLoading} size="small"
        pagination={false}
      />
    </div>
  )
}
