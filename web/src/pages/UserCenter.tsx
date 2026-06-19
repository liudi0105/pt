import { useEffect, useState } from 'react'
import { Card, Descriptions, Table, Tag, Typography, Tabs, Button, Form, Input, message, InputNumber, Space, Spin, Alert } from 'antd'
import { useNavigate, Link, useParams } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/auth'
import { getProfile, getSnatches, getSeeding, getBookmarks, updatePassword, buyUpload, checkin, getCheckinStatus } from '../api/user'
import type { Snatch, SeedingInfo, Bookmark } from '../types'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next'
import { useI18n } from '../hooks/useI18n'

dayjs.extend(relativeTime)

const { Title } = Typography

function formatSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

function calcRatio(uploaded: number, downloaded: number) {
  if (downloaded === 0) return uploaded > 0 ? '\u221e' : '0.00'
  return (uploaded / downloaded).toFixed(3)
}

const bonusPerGB = 100

function ProfileTab() {
  const { t } = useTranslation('user')
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    select: (res) => res.data,
  })

  const i18nLevel = useI18n('user_level')
  const levelCode = profile?.level_code
  const levelLabel = levelCode !== undefined
    ? i18nLevel.getLabel(String(levelCode)) || profile?.level_label || `Level ${levelCode}`
    : '-'

  return (
    <Card>
      {profile && (
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label={t('profile.username')}>{profile.username}</Descriptions.Item>
          <Descriptions.Item label={t('profile.email')}>{profile.email}</Descriptions.Item>
          <Descriptions.Item label={t('profile.role')}>
            <Tag>{profile.role}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('profile.level')}>{levelLabel}</Descriptions.Item>
          <Descriptions.Item label={t('profile.bonus')}>
            <span style={{ color: '#faad14', fontWeight: 'bold' }}>{profile.bonus?.toFixed(2)}</span>
          </Descriptions.Item>
          <Descriptions.Item label={t('profile.uploaded')}>{formatSize(profile.upload_bytes)}</Descriptions.Item>
          <Descriptions.Item label={t('profile.downloaded')}>{formatSize(profile.download_bytes)}</Descriptions.Item>
          <Descriptions.Item label={t('profile.ratio')}>
            {calcRatio(profile.upload_bytes, profile.download_bytes)}
          </Descriptions.Item>
          <Descriptions.Item label={t('profile.snatches')}>{profile.total_snatches ?? '-'}</Descriptions.Item>
          <Descriptions.Item label={t('profile.seeding')}>{profile.seeding_count ?? '-'}</Descriptions.Item>
          <Descriptions.Item label={t('profile.passkey')}>
            <code style={{ fontSize: 12 }}>{profile.passkey}</code>
          </Descriptions.Item>
          <Descriptions.Item label={t('profile.joined')}>{dayjs(profile.created_at).format('YYYY-MM-DD')}</Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  )
}

function SettingsTab() {
  const { t } = useTranslation('user')
  const [form] = Form.useForm()

  const mutation = useMutation({
    mutationFn: (values: { current_password: string; new_password: string }) =>
      updatePassword(values.current_password, values.new_password),
    onSuccess: () => {
      message.success(t('settings.passwordSuccess'))
      form.resetFields()
    },
    onError: (err: any) => {
      message.error(err.response?.data?.error || t('settings.passwordFailed'))
    },
  })

  return (
    <Card title={t('settings.changePassword')}>
      <Form form={form} layout="vertical" onFinish={mutation.mutate} style={{ maxWidth: 400 }}>
        <Form.Item
          name="current_password"
          label={t('settings.currentPassword')}
          rules={[{ required: true, message: t('settings.enterCurrentPassword') }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="new_password"
          label={t('settings.newPassword')}
          rules={[
            { required: true, message: t('settings.enterNewPassword') },
            { min: 6, message: t('settings.passwordMinLength') },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          {t('settings.updatePassword')}
        </Button>
      </Form>
    </Card>
  )
}

function SnatchHistoryTab() {
  const { t } = useTranslation('user')
  const { lang } = useParams({ from: '/$lang' })
  const { data, isLoading } = useQuery({
    queryKey: ['snatches'],
    queryFn: () => getSnatches(),
    select: (res) => res.data.snatches,
  })

  const columns: ColumnsType<Snatch> = [
    {
      title: t('snatches.torrent'),
      dataIndex: 'torrent_name',
      key: 'torrent_name',
      render: (name: string, r: Snatch) => (
        <Link to="/$lang/torrents/$id" params={{ lang, id: String(r.torrent_id) }}>{name || `#${r.torrent_id}`}</Link>
      ),
    },
    {
      title: t('snatches.uploaded'),
      dataIndex: 'uploaded',
      key: 'uploaded',
      render: (v: number) => formatSize(v),
    },
    {
      title: t('snatches.downloaded'),
      dataIndex: 'downloaded',
      key: 'downloaded',
      render: (v: number) => formatSize(v),
    },
    {
      title: t('snatches.ratio'),
      key: 'ratio',
      render: (_, r: Snatch) => calcRatio(r.uploaded, r.downloaded),
    },
    {
      title: t('snatches.status'),
      dataIndex: 'is_seeding',
      key: 'is_seeding',
      render: (v: boolean) =>
        v ? <Tag color="green">Seeding</Tag> : <Tag color="default">Finished</Tag>,
    },
    {
      title: t('snatches.lastAnnounce'),
      dataIndex: 'last_announce',
      key: 'last_announce',
      render: (v: string) => dayjs(v).fromNow(),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={isLoading}
      size="small"
      pagination={{ pageSize: 20 }}
    />
  )
}

function SeedingTab() {
  const { t } = useTranslation('user')
  const { lang } = useParams({ from: '/$lang' })
  const { data, isLoading } = useQuery({
    queryKey: ['seeding'],
    queryFn: () => getSeeding(),
    select: (res) => res.data.seeding,
  })

  const columns: ColumnsType<SeedingInfo> = [
    {
      title: t('seedingTab.torrent'),
      dataIndex: 'torrent_name',
      key: 'torrent_name',
      render: (name: string, r: SeedingInfo) => (
        <Link to="/$lang/torrents/$id" params={{ lang, id: String(r.torrent_id) }}>{name || `#${r.torrent_id}`}</Link>
      ),
    },
    {
      title: t('seedingTab.size'),
      dataIndex: 'torrent_size',
      key: 'torrent_size',
      render: (v: number) => formatSize(v || 0),
    },
    {
      title: t('seedingTab.uploaded'),
      dataIndex: 'uploaded',
      key: 'uploaded',
      render: (v: number) => formatSize(v),
    },
    {
      title: t('seedingTab.downloaded'),
      dataIndex: 'downloaded',
      key: 'downloaded',
      render: (v: number) => formatSize(v),
    },
    {
      title: t('seedingTab.ratio'),
      key: 'ratio',
      render: (_, r: SeedingInfo) => calcRatio(r.uploaded, r.downloaded),
    },
    {
      title: t('seedingTab.lastAnnounce'),
      dataIndex: 'last_announce',
      key: 'last_announce',
      render: (v: string) => dayjs(v).fromNow(),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={isLoading}
      size="small"
      pagination={{ pageSize: 20 }}
    />
  )
}

function BookmarksTab() {
  const { t } = useTranslation('user')
  const { lang } = useParams({ from: '/$lang' })
  const { data, isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => getBookmarks(),
    select: (res) => res.data.bookmarks,
  })

  const columns: ColumnsType<Bookmark> = [
    {
      title: t('bookmarks.torrent'),
      dataIndex: 'torrent_name',
      key: 'torrent_name',
      render: (name: string, r: Bookmark) => (
        <Link to="/$lang/torrents/$id" params={{ lang, id: String(r.torrent_id) }}>{name || `#${r.torrent_id}`}</Link>
      ),
    },
    {
      title: t('bookmarks.size'),
      dataIndex: 'torrent_size',
      key: 'torrent_size',
      render: (v: number) => formatSize(v || 0),
    },
    {
      title: t('bookmarks.seeders'),
      dataIndex: 'seeders',
      key: 'seeders',
      render: (v: number) => <span style={{ color: '#52c41a' }}>{v ?? 0}</span>,
    },
    {
      title: t('bookmarks.leechers'),
      dataIndex: 'leechers',
      key: 'leechers',
      render: (v: number) => <span style={{ color: '#faad14' }}>{v ?? 0}</span>,
    },
    {
      title: t('bookmarks.bookmarked'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v: string) => dayjs(v).fromNow(),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={isLoading}
      size="small"
      pagination={{ pageSize: 20 }}
    />
  )
}

function CheckinTab() {
  const { t } = useTranslation('user')
  const queryClient = useQueryClient()

  const { data: status, isLoading } = useQuery({
    queryKey: ['checkin'],
    queryFn: () => getCheckinStatus(),
    select: (res) => res.data,
  })

  const mutation = useMutation({
    mutationFn: () => checkin(),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['checkin'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      const d = res.data
      message.success(t('checkin.checkinSuccess', { bonus: d.bonus_earned, days: d.consecutive_days }))
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('checkin.checkinFailed')),
  })

  if (isLoading) return <Spin />

  return (
    <Card title={t('checkin.title')}>
      <Space direction="vertical" size="middle">
        <Descriptions column={1} bordered size="small" style={{ maxWidth: 400 }}>
          <Descriptions.Item label={t('checkin.status')}>
            {status?.checked ? <Tag color="green">{t('checkin.checkedToday')}</Tag> : <Tag color="orange">{t('checkin.notChecked')}</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label={t('checkin.consecutiveDays')}>{status?.consecutive_days ?? 0} {t('checkin.days')}</Descriptions.Item>
          <Descriptions.Item label={t('checkin.totalDays')}>{status?.total_days ?? 0} {t('checkin.days')}</Descriptions.Item>
        </Descriptions>
        <Alert
          message={t('checkin.rewardHint')}
          type="info"
          showIcon
        />
        <Button type="primary" size="large" onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={status?.checked}>
          {status?.checked ? t('checkin.alreadyChecked') : t('checkin.checkInNow')}
        </Button>
      </Space>
    </Card>
  )
}

function BonusShopTab() {
  const { t } = useTranslation('user')
  const [spent, setSpent] = useState(100)
  const queryClient = useQueryClient()

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    select: (res) => res.data,
  })

  const mutation = useMutation({
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

  const uploadBytes = Math.floor(spent / bonusPerGB * 1024 * 1024 * 1024)

  return (
    <div>
      <Card title={t('bonusShop.title')} style={{ marginBottom: 16 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Descriptions column={1} bordered size="small" style={{ maxWidth: 400 }}>
            <Descriptions.Item label={t('bonusShop.yourBonus')}>
              <span style={{ color: '#faad14', fontWeight: 'bold', fontSize: 16 }}>
                {profile?.bonus?.toFixed(2) ?? '...'}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label={t('bonusShop.exchangeRate')}>
              {t('bonusShop.rateText', { rate: bonusPerGB })}
            </Descriptions.Item>
          </Descriptions>

          <Card size="small" type="inner" title={t('bonusShop.buyUpload')} style={{ maxWidth: 400 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <span>{t('bonusShop.spendBonus')} </span>
                <InputNumber
                  min={bonusPerGB}
                  step={bonusPerGB}
                  value={spent}
                  onChange={(v) => setSpent(v || bonusPerGB)}
                  style={{ width: 150 }}
                />
              </div>
              <div>
                {t('bonusShop.youReceive')} <strong>{formatSize(uploadBytes)}</strong> {t('bonusShop.uploadCredit')}
              </div>
              <Button
                type="primary"
                onClick={() => mutation.mutate(spent)}
                loading={mutation.isPending}
                disabled={(profile?.bonus ?? 0) < spent}
              >
                {t('bonusShop.buyNow')}
              </Button>
              {(profile?.bonus ?? 0) < spent && (
                <span style={{ color: '#ff4d4f' }}>{t('bonusShop.insufficientBonus')}</span>
              )}
            </Space>
          </Card>
        </Space>
      </Card>
    </div>
  )
}

export function UserCenter() {
  const { t } = useTranslation('user')
  const navigate = useNavigate()
  const { lang } = useParams({ from: '/$lang' })
  const { token } = useAuthStore()
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('tab') || 'profile'
  })

  useEffect(() => {
    if (!token) navigate({ to: '/$lang/login', params: { lang } })
  }, [token, navigate])

  const handleTabChange = (key: string) => {
    setActiveTab(key)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', key)
    window.history.replaceState({}, '', url.toString())
  }

  const tabItems = [
    { key: 'profile', label: t('tabs.profile'), children: <ProfileTab /> },
    { key: 'checkin', label: t('tabs.checkin'), children: <CheckinTab /> },
    { key: 'settings', label: t('tabs.settings'), children: <SettingsTab /> },
    { key: 'snatches', label: t('tabs.snatches'), children: <SnatchHistoryTab /> },
    { key: 'seeding', label: t('tabs.seeding'), children: <SeedingTab /> },
    { key: 'bookmarks', label: t('tabs.bookmarks'), children: <BookmarksTab /> },
    { key: 'bonus', label: t('tabs.bonusShop'), children: <BonusShopTab /> },
  ]

  return (
    <div>
      <Title level={3}>{t('title')}</Title>
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />
    </div>
  )
}
