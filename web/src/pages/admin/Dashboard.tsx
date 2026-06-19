import { Card, Col, Row, Statistic, Table, Tag, Typography, Alert, Space } from 'antd'
import { UserOutlined, CloudUploadOutlined, CloudDownloadOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import type { ColumnsType } from 'antd/es/table'
import type { Torrent, User } from '../../types'
import { adminGetDashboard } from '../../api/admin'

const { Title, Text } = Typography

export function AdminDashboard() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminGetDashboard(),
    select: (res) => res.data,
  })

  const latestUsersColumns: ColumnsType<User> = [
    { title: t('userManage.username'), dataIndex: 'username', key: 'username', width: 140 },
    { title: t('userManage.email'), dataIndex: 'email', key: 'email', width: 220 },
    {
      title: t('userManage.role'),
      dataIndex: 'role',
      key: 'role',
      width: 90,
      render: (role: string) => <Tag>{role}</Tag>,
    },
    {
      title: t('userManage.status'),
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? tCommon('status.active') : tCommon('status.banned')}
        </Tag>
      ),
    },
    {
      title: t('userManage.created'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
    },
  ]

  const latestTorrentsColumns: ColumnsType<Torrent> = [
    { title: t('dashboard.torrentName'), dataIndex: 'name', key: 'name', width: 280 },
    { title: t('dashboard.torrentCategory'), dataIndex: 'category', key: 'category', width: 120, render: (value: string) => <Tag>{value}</Tag> },
    { title: t('dashboard.seeders'), dataIndex: 'seeders', key: 'seeders', width: 90 },
    { title: t('dashboard.leechers'), dataIndex: 'leechers', key: 'leechers', width: 90 },
    {
      title: t('dashboard.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
    },
  ]

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3}>{t('dashboard.title')}</Title>
        <Text type="secondary">{t('dashboard.subtitle')}</Text>
      </div>

      <Alert
        type="info"
        showIcon
        message={t('dashboard.alertTitle')}
        description={t('dashboard.alertDescription')}
      />

      <Row gutter={16}>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic
              title={t('dashboard.totalUsers')}
              value={data?.total_users ?? 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic
              title={t('dashboard.activeUsers')}
              value={data?.active_users ?? 0}
              prefix={<PlayCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic
              title={t('dashboard.totalUpload')}
              value={((data?.total_upload_bytes ?? 0) / 1024 / 1024 / 1024 / 1024).toFixed(2)}
              prefix={<CloudUploadOutlined />}
              suffix={t('dashboard.tb')}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic
              title={t('dashboard.totalDownload')}
              value={((data?.total_download_bytes ?? 0) / 1024 / 1024 / 1024 / 1024).toFixed(2)}
              prefix={<CloudDownloadOutlined />}
              suffix={t('dashboard.tb')}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} xl={12}>
          <Card title={t('dashboard.latestUsers')} loading={isLoading}>
            <Table
              columns={latestUsersColumns}
              dataSource={data?.latest_users}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 720 }}
            />
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card title={t('dashboard.latestTorrents')} loading={isLoading}>
            <Table
              columns={latestTorrentsColumns}
              dataSource={data?.latest_torrents}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 720 }}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  )
}
