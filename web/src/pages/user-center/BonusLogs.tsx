import { useState } from 'react'
import { Card, Table, Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getBonusLogs } from '../../api/user'
import type { BonusLog } from '../../types'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const businessTypeMap: Record<number, { label: string; color: string }> = {
  1: { label: '做种收获', color: 'green' },
  2: { label: '积分兑换', color: 'blue' },
  3: { label: '奖励发放', color: 'purple' },
  4: { label: '违规扣减', color: 'red' },
  5: { label: '积分转账', color: 'orange' },
  99: { label: '管理员调整', color: 'geekblue' },
}

export default function BonusLogs() {
  const { t } = useTranslation('user')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['user-bonus-logs', { page }],
    queryFn: () => getBonusLogs({ page, page_size: 20 }),
    select: (res) => res.data,
  })

  const columns: ColumnsType<BonusLog> = [
    {
      title: t('bonusLogs.time'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: t('bonusLogs.type'),
      dataIndex: 'business_type',
      key: 'business_type',
      width: 100,
      render: (v: number) => {
        const m = businessTypeMap[v]
        return m ? <Tag color={m.color}>{m.label}</Tag> : <Tag>{v}</Tag>
      },
    },
    {
      title: t('bonusLogs.change'),
      dataIndex: 'value',
      key: 'value',
      width: 100,
      render: (v: number) => {
        const color = v >= 0 ? '#3f8600' : '#cf1322'
        return <span style={{ color, fontWeight: 'bold' }}>{v >= 0 ? `+${v.toFixed(1)}` : v.toFixed(1)}</span>
      },
    },
    {
      title: t('bonusLogs.balance'),
      dataIndex: 'new_total_value',
      key: 'new_total_value',
      width: 100,
      render: (v: number) => v?.toFixed(1),
    },
    {
      title: t('bonusLogs.comment'),
      dataIndex: 'comment',
      key: 'comment',
    },
  ]

  return (
    <Card title={t('bonusLogs.title')}>
      <Table
        columns={columns}
        dataSource={data?.logs}
        rowKey="id"
        loading={isLoading}
        size="small"
        pagination={{
          current: page,
          pageSize: 20,
          total: data?.total,
          onChange: setPage,
          showSizeChanger: false,
        }}
      />
    </Card>
  )
}
