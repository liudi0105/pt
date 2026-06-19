import { Table, Tag, Typography, Button, message } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listReports, resolveReport } from '../../api/report'
import type { Report } from '../../types'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

const { Title } = Typography

function StatusTag({ status, t }: { status: string; t: (key: string) => string }) {
  if (status === 'resolved') return <Tag color="green" icon={<CheckCircleOutlined />}>{t('status.resolved')}</Tag>
  return <Tag color="orange">{t('status.pending')}</Tag>
}

export function ReportManage() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: () => listReports(),
    select: (res) => res.data,
  })

  const resolveMut = useMutation({
    mutationFn: (id: number) => resolveReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] })
      message.success(t('reportManage.resolveSuccess'))
    },
    onError: () => message.error(t('reportManage.resolveFailed')),
  })

  const columns: ColumnsType<Report> = [
    {
      title: tCommon('id'),
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: t('reportManage.reporter'),
      dataIndex: 'reporter_username',
      key: 'reporter_username',
      width: 120,
    },
    {
      title: t('reportManage.target'),
      key: 'target',
      width: 140,
      render: (_, r: Report) => `${r.target_type}#${r.target_id}`,
    },
    {
      title: t('reportManage.reason'),
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: t('reportManage.status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s: string) => <StatusTag status={s} t={tCommon} />,
    },
    {
      title: t('reportManage.created'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: (d: string) => dayjs(d).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: tCommon('actions'),
      key: 'actions',
      width: 100,
      render: (_, r: Report) =>
        r.status !== 'resolved' ? (
          <Button size="small" icon={<CheckCircleOutlined />} onClick={() => resolveMut.mutate(r.id)} loading={resolveMut.isPending}>
            {t('reportManage.resolve')}
          </Button>
        ) : null,
    },
  ]

  return (
    <div>
      <Title level={4}>{t('reportManage.title')}</Title>
      <Table columns={columns} dataSource={data?.reports} rowKey="id" loading={isLoading} size="small"
        pagination={{ pageSize: 20, total: data?.total }}
      />
    </div>
  )
}
