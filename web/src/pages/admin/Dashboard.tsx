import { Card, Col, Row, Statistic, Typography } from 'antd'
import { UserOutlined, CloudUploadOutlined, CloudDownloadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { api } from '../../api/client'

const { Title } = Typography

export function AdminDashboard() {
  const { t } = useTranslation('admin')
  const { data: userStats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get('/admin/users', { params: { page_size: 1 } }),
    select: (res) => res.data,
  })

  return (
    <div>
      <Title level={3}>{t('title')}</Title>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('totalUsers')}
              value={userStats?.total ?? 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('activeUsers')}
              value={0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('totalUpload')}
              value={0}
              prefix={<CloudUploadOutlined />}
              suffix={t('tb')}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('totalDownload')}
              value={0}
              prefix={<CloudDownloadOutlined />}
              suffix={t('tb')}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
