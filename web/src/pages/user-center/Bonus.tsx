import { useState } from 'react'
import { Card, Row, Col, Statistic, Button, Drawer, Space, InputNumber, Table, Tag, message, Divider, Collapse, Progress, Popconfirm } from 'antd'
import { ShoppingCartOutlined, FileTextOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { getProfile, buyUpload, buyDownload, getSeedBonusRate, getBonusLogs } from '../../api/user'
import { getBonusSettings, getSeedBonusBreakdown } from '../../api/bonus'
import type { BonusLog } from '../../types'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { formatSize } from './utils'

const bonusPerGB = 100

const businessTypeMap: Record<number, { label: string; color: string }> = {
  1: { label: '做种收获', color: 'green' },
  2: { label: '积分兑换', color: 'blue' },
  3: { label: '奖励发放', color: 'purple' },
  4: { label: '违规扣减', color: 'red' },
  5: { label: '积分转账', color: 'orange' },
  99: { label: '管理员调整', color: 'geekblue' },
}

const rulesMd = String.raw`
每小时做种积分由以下公式计算：

$$ \text{bonus/h} = B_0 \times \frac{2}{\pi} \times \arctan\left(\frac{A}{L}\right) + \text{PerSeeding} \times \text{count} $$

其中每个种子的贡献值 $A_i$ 为：

$$ A_i = \left(1 - e^{\frac{\ln(0.1)}{T_0} \times w}\right) \times s \times \left(1 + \sqrt{2} \times e^{\frac{\ln(0.1)}{N_0 - 1} \times (p - 1)}\right) $$

变量说明：$w$ = 存活周数，$s$ = 大小（GB），$p$ = 做种人数
`

function ShopDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation('user')
  const queryClient = useQueryClient()
  const [uploadSpent, setUploadSpent] = useState(100)
  const [downloadSpent, setDownloadSpent] = useState(100)

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    select: (res) => res.data,
  })

  const uploadMutation = useMutation({
    mutationFn: (bonus: number) => buyUpload(bonus),
    onSuccess: (res) => {
      const d = res.data
      message.success(t('bonusShop.buySuccess', { size: formatSize(d.upload_bytes), bonus: d.bonus_spent }))
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (err: any) => {
      message.error(err.response?.data?.error || t('bonusShop.buyFailed'))
    },
  })

  const downloadMutation = useMutation({
    mutationFn: (bonus: number) => buyDownload(bonus),
    onSuccess: (res) => {
      const d = res.data
      message.success(t('bonusShop.buyDownloadSuccess', { size: formatSize(d.download_bytes), bonus: d.bonus_spent }))
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (err: any) => {
      message.error(err.response?.data?.error || t('bonusShop.buyFailed'))
    },
  })

  const uploadBytes = Math.floor(uploadSpent / bonusPerGB * 1024 * 1024 * 1024)
  const downloadBytes = Math.floor(downloadSpent / bonusPerGB * 1024 * 1024 * 1024)

  return (
    <Drawer
      title={t('bonusShop.title')}
      open={open}
      onClose={onClose}
      width={450}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card size="small" title={t('bonusShop.buyUpload')}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <span>{t('bonusShop.spendBonus')} </span>
              <InputNumber
                min={bonusPerGB}
                step={bonusPerGB}
                value={uploadSpent}
                onChange={(v) => setUploadSpent(v || bonusPerGB)}
                style={{ width: 150 }}
              />
            </div>
            <div>
              {t('bonusShop.youReceive')} <strong>{formatSize(uploadBytes)}</strong> {t('bonusShop.uploadCredit')}
            </div>
            <Popconfirm title={t('bonusShop.confirmTitle')} onConfirm={() => uploadMutation.mutate(uploadSpent)}>
              <Button
                type="primary"
                loading={uploadMutation.isPending}
                disabled={(profile?.bonus ?? 0) < uploadSpent}
              >
                {t('bonusShop.buyNow')}
              </Button>
            </Popconfirm>
            {(profile?.bonus ?? 0) < uploadSpent && (
              <span style={{ color: '#ff4d4f' }}>{t('bonusShop.insufficientBonus')}</span>
            )}
          </Space>
        </Card>

        <Card size="small" title={t('bonusShop.buyDownload')}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <span>{t('bonusShop.spendBonus')} </span>
              <InputNumber
                min={bonusPerGB}
                step={bonusPerGB}
                value={downloadSpent}
                onChange={(v) => setDownloadSpent(v || bonusPerGB)}
                style={{ width: 150 }}
              />
            </div>
            <div>
              {t('bonusShop.youReceive')} <strong>{formatSize(downloadBytes)}</strong> {t('bonusShop.downloadCredit')}
            </div>
            <Popconfirm title={t('bonusShop.confirmTitle')} onConfirm={() => downloadMutation.mutate(downloadSpent)}>
              <Button
                type="primary"
                loading={downloadMutation.isPending}
                disabled={(profile?.bonus ?? 0) < downloadSpent}
              >
                {t('bonusShop.buyNow')}
              </Button>
            </Popconfirm>
            {(profile?.bonus ?? 0) < downloadSpent && (
              <span style={{ color: '#ff4d4f' }}>{t('bonusShop.insufficientBonus')}</span>
            )}
          </Space>
        </Card>

      </Space>
    </Drawer>
  )
}

function LogsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
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
    <Drawer
      title={t('bonusLogs.title')}
      open={open}
      onClose={onClose}
      width={650}
    >
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
    </Drawer>
  )
}

const paramMeta = [
  { key: 'tzero' as const, label: '$T_0$', desc: '时间常数（周），控制种子年龄对积分的影响' },
  { key: 'nzero' as const, label: '$N_0$', desc: '做种人数常数，控制竞争衰减' },
  { key: 'bzero' as const, label: '$B_0$', desc: '最大积分基数' },
  { key: 'l' as const, label: '$L$', desc: 'arctan 缩放因子' },
  { key: 'perseeding' as const, label: 'PerSeeding', desc: '每个做种种子的基础积分' },
  { key: 'maxseeding' as const, label: 'MaxSeeding', desc: '计入公式的最大做种数' },
]

const otherWays = [
  { label: '发布种子', bonus: '15' },
  { label: '上传字幕', bonus: '5' },
  { label: '发起论坛主题', bonus: '2' },
  { label: '论坛回复', bonus: '1' },
  { label: '添加评论', bonus: '1' },
  { label: '每日签到', bonus: '视连续天数而定' },
]

function BonusRules() {
  const { t } = useTranslation('user')

  const { data: settings } = useQuery({
    queryKey: ['bonus-settings'],
    queryFn: () => getBonusSettings(),
    select: (res) => res.data,
  })

  const { data: breakdown, isLoading } = useQuery({
    queryKey: ['seed-bonus-breakdown'],
    queryFn: () => getSeedBonusBreakdown(),
    select: (res) => res.data,
  })

  const breakdownColumns: ColumnsType<any> = [
    {
      title: t('bonusRules.breakdown.torrent'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (v: string, r: any) => (
        <a href={`/torrents/${r.torrent_id}`} target="_blank" rel="noopener noreferrer">
          {v || `#${r.torrent_id}`}
        </a>
      ),
    },
    {
      title: t('bonusRules.breakdown.size'),
      dataIndex: 'size',
      key: 'size',
      width: 110,
      render: (v: number) => formatSize(v),
    },
    {
      title: t('bonusRules.breakdown.weeks'),
      dataIndex: 'weeks_alive',
      key: 'weeks_alive',
      width: 90,
      render: (v: number) => v.toFixed(2),
    },
    {
      title: t('bonusRules.breakdown.seeders'),
      dataIndex: 'seeders',
      key: 'seeders',
      width: 90,
    },
    {
      title: 'A 值',
      dataIndex: 'a_value',
      key: 'a_value',
      width: 100,
      render: (v: number) => v.toFixed(4),
    },
  ]

  const items = [
    {
      key: '1',
      label: t('bonusRules.title'),
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Card size="small">
            <div className="bonus-rules-md">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {rulesMd}
              </ReactMarkdown>
            </div>
          </Card>

          {settings && (
            <Card size="small" title="配置参数">
              <table className="bonus-params-table">
                <thead>
                  <tr>
                    <th>参数</th>
                    <th>说明</th>
                    <th>当前值</th>
                  </tr>
                </thead>
                <tbody>
                  {paramMeta.map((p) => (
                    <tr key={p.key}>
                      <td style={{ fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{p.label}</td>
                      <td>{p.desc}</td>
                      <td style={{ fontFamily: 'monospace', textAlign: 'center' }}>{settings[p.key]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          <Card size="small" title="其他赚积分方式">
            <table className="bonus-params-table">
              <thead>
                <tr>
                  <th>方式</th>
                  <th style={{ width: 140 }}>积分</th>
                </tr>
              </thead>
              <tbody>
                {otherWays.map((w, i) => (
                  <tr key={i}>
                    <td>{w.label}</td>
                    <td style={{ color: '#3f8600', textAlign: 'center' }}>{w.bonus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {breakdown && (
            <Card size="small" title={t('bonusRules.progress.title')}>
              <Row gutter={16} style={{ marginBottom: 12 }}>
                <Col span={8}>
                  <Statistic
                    title={t('bonusRules.progress.current')}
                    value={breakdown.seed_bonus}
                    precision={3}
                    valueStyle={{ color: '#3f8600', fontSize: 24 }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title={t('bonusRules.progress.max')}
                    value={breakdown.max_bonus}
                    precision={3}
                    valueStyle={{ fontSize: 24 }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="A 值"
                    value={breakdown.total_a}
                    precision={2}
                    valueStyle={{ fontSize: 24 }}
                  />
                </Col>
              </Row>
              <div>
                <span style={{ marginRight: 8 }}>{t('bonusRules.progress.percent')}</span>
                <Progress
                  percent={Math.min(breakdown.percent, 100)}
                  size="small"
                  strokeColor={breakdown.percent >= 80 ? '#3f8600' : breakdown.percent >= 50 ? '#faad14' : '#ff4d4f'}
                  format={() => `${breakdown.percent.toFixed(1)}%`}
                />
              </div>
            </Card>
          )}

          {breakdown && breakdown.torrents?.length > 0 && (
            <Card size="small" title={t('bonusRules.breakdown.title')}>
              <Table
                columns={breakdownColumns}
                dataSource={breakdown.torrents}
                rowKey="torrent_id"
                loading={isLoading}
                size="small"
                pagination={false}
              />
            </Card>
          )}
        </Space>
      ),
    },
  ]

  return (
    <Collapse defaultActiveKey={['1']} items={items} />
  )
}

export default function Bonus() {
  const { t } = useTranslation('user')
  const [shopOpen, setShopOpen] = useState(false)
  const [logsOpen, setLogsOpen] = useState(false)

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    select: (res) => res.data,
  })

  const { data: seedRate } = useQuery({
    queryKey: ['seed-bonus-rate'],
    queryFn: () => getSeedBonusRate(),
    select: (res) => res.data,
  })

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('bonusShop.yourBonus')}
              value={profile?.bonus ?? 0}
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('bonusShop.bonusPerHour')}
              value={seedRate?.bonus_per_hour ?? 0}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('bonusShop.seedingCount')}
              value={seedRate?.torrent_count ?? 0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('bonusShop.seedingSize')}
              value={seedRate?.total_size ? formatSize(seedRate.total_size) : '0 B'}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        <Col>
          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            onClick={() => setShopOpen(true)}
          >
            {t('bonusShop.title')}
          </Button>
        </Col>
        <Col>
          <Button
            size="large"
            icon={<FileTextOutlined />}
            onClick={() => setLogsOpen(true)}
          >
            {t('bonusLogs.title')}
          </Button>
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <BonusRules />
      </div>

      <ShopDrawer open={shopOpen} onClose={() => setShopOpen(false)} />
      <LogsDrawer open={logsOpen} onClose={() => setLogsOpen(false)} />
    </div>
  )
}
