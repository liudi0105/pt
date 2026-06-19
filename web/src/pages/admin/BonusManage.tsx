import { useState } from 'react'
import { Table, Card, Input, Select, Tag, Space } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { listBonusLogs } from '../../api/admin'
import { useTranslation } from 'react-i18next'

const businessTypeMap: Record<number, { label: string; color: string }> = {
  1: { label: '做种收获', color: 'green' },
  2: { label: '积分兑换', color: 'blue' },
  3: { label: '奖励发放', color: 'purple' },
  4: { label: '违规扣减', color: 'red' },
  5: { label: '积分转账', color: 'orange' },
  99: { label: '管理员调整', color: 'geekblue' },
}

export function BonusManage() {
  const { t } = useTranslation('admin')
  const [page, setPage] = useState(1)
  const [userId, setUserId] = useState('')
  const [businessType, setBusinessType] = useState<number | undefined>(undefined)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bonus-logs', { page, userId, businessType }],
    queryFn: () =>
      listBonusLogs({
        page,
        page_size: 20,
        user_id: userId ? Number(userId) : undefined,
        business_type: businessType,
      }),
    select: (res) => res.data,
  })

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: t('userManage.username'), dataIndex: 'user_id', key: 'user_id', width: 80 },
    {
      title: t('bonusManage.businessType'),
      dataIndex: 'business_type',
      key: 'business_type',
      width: 120,
      render: (v: number) => {
        const m = businessTypeMap[v]
        return m ? <Tag color={m.color}>{m.label}</Tag> : <Tag>{v}</Tag>
      },
    },
    {
      title: t('bonusManage.oldValue'),
      dataIndex: 'old_total_value',
      key: 'old_total_value',
      width: 120,
      render: (v: number) => v?.toFixed(1),
    },
    {
      title: t('bonusManage.change'),
      dataIndex: 'value',
      key: 'value',
      width: 120,
      render: (v: number) => {
        const color = v >= 0 ? '#3f8600' : '#cf1322'
        return <span style={{ color }}>{v >= 0 ? `+${v.toFixed(1)}` : v.toFixed(1)}</span>
      },
    },
    {
      title: t('bonusManage.newValue'),
      dataIndex: 'new_total_value',
      key: 'new_total_value',
      width: 120,
      render: (v: number) => v?.toFixed(1),
    },
    { title: t('bonusManage.comment'), dataIndex: 'comment', key: 'comment', width: 200 },
    { title: t('bonusManage.time'), dataIndex: 'created_at', key: 'created_at', width: 180 },
  ]

  return (
    <Card title={t('bonusManage.title')}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder={t('bonusManage.userIdPlaceholder')}
          value={userId}
          onChange={(e) => { setUserId(e.target.value); setPage(1) }}
          style={{ width: 160 }}
        />
        <Select
          placeholder={t('bonusManage.businessTypePlaceholder')}
          allowClear
          style={{ width: 160 }}
          value={businessType}
          onChange={(v) => { setBusinessType(v); setPage(1) }}
          options={Object.entries(businessTypeMap).map(([k, v]) => ({ value: Number(k), label: v.label }))}
        />
      </Space>
      <Table
        dataSource={data?.logs}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: 20,
          total: data?.total,
          onChange: setPage,
        }}
        size="small"
      />
    </Card>
  )
}
