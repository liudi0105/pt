import { Card, Col, Row, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DatabaseOutlined, GiftOutlined, TagsOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons'
import { useParams } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const { Title, Paragraph, Text } = Typography

type ResourceRow = {
  key: string
  resource: string
  page: string
  api: string
  consumers: string
  stateModel: string
  status: 'implemented' | 'todo'
}

export function OperationsResources() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const { lang } = useParams({ from: '/$lang' })

  const rows: ResourceRow[] = [
    {
      key: 'tags',
      resource: t('operationsResources.tags'),
      page: t('operationsResources.tagsPage'),
      api: 'resource /api/tags',
      consumers: t('operationsResources.tagsConsumers'),
      stateModel: t('operationsResources.tagsState'),
      status: 'todo',
    },
    {
      key: 'medals',
      resource: t('operationsResources.medals'),
      page: t('operationsResources.medalsPage'),
      api: 'resource /api/medals',
      consumers: t('operationsResources.medalsConsumers'),
      stateModel: t('operationsResources.medalsState'),
      status: 'implemented',
    },
    {
      key: 'user-medals',
      resource: t('operationsResources.userMedals'),
      page: t('operationsResources.userMedalsPage'),
      api: 'resource /api/user-medals',
      consumers: t('operationsResources.userMedalsConsumers'),
      stateModel: t('operationsResources.userMedalsState'),
      status: 'todo',
    },
    {
      key: 'exams',
      resource: t('operationsResources.exams'),
      page: t('operationsResources.examsPage'),
      api: 'resource /api/exams',
      consumers: t('operationsResources.examsConsumers'),
      stateModel: t('operationsResources.examsState'),
      status: 'todo',
    },
    {
      key: 'exam-users',
      resource: t('operationsResources.examUsers'),
      page: t('operationsResources.examUsersPage'),
      api: 'resource /api/exam-users',
      consumers: t('operationsResources.examUsersConsumers'),
      stateModel: t('operationsResources.examUsersState'),
      status: 'todo',
    },
    {
      key: 'hr',
      resource: t('operationsResources.hr'),
      page: t('operationsResources.hrPage'),
      api: 'resource /api/hr',
      consumers: t('operationsResources.hrConsumers'),
      stateModel: t('operationsResources.hrState'),
      status: 'implemented',
    },
  ]

  const columns: ColumnsType<ResourceRow> = [
    { title: t('operationsResources.resource'), dataIndex: 'resource', key: 'resource', width: 120 },
    { title: t('operationsResources.page'), dataIndex: 'page', key: 'page', width: 180 },
    { title: t('operationsResources.api'), dataIndex: 'api', key: 'api', width: 170 },
    { title: t('operationsResources.consumers'), dataIndex: 'consumers', key: 'consumers' },
    { title: t('operationsResources.stateModel'), dataIndex: 'stateModel', key: 'stateModel' },
    {
      title: tCommon('status'),
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: ResourceRow['status']) => (
        <Tag color={status === 'implemented' ? 'green' : 'orange'}>
          {status === 'implemented' ? t('operationsResources.implemented') : t('operationsResources.todo')}
        </Tag>
      ),
    },
  ]

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3}>{t('operationsResources.title')}</Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          {t('operationsResources.subtitle')}
        </Paragraph>
      </div>

      <Row gutter={16}>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Space direction="vertical" size={4}>
              <Text type="secondary">{t('operationsResources.overviewResources')}</Text>
              <Text strong style={{ fontSize: 28 }}>{rows.length}</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Space direction="vertical" size={4}>
              <Text type="secondary">{t('operationsResources.overviewImplemented')}</Text>
              <Text strong style={{ fontSize: 28 }}>{rows.filter((row) => row.status === 'implemented').length}</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Space direction="vertical" size={4}>
              <Text type="secondary">{t('operationsResources.overviewTodo')}</Text>
              <Text strong style={{ fontSize: 28 }}>{rows.filter((row) => row.status === 'todo').length}</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Space direction="vertical" size={4}>
              <Text type="secondary">{t('operationsResources.overviewFocus')}</Text>
              <Text strong style={{ fontSize: 28 }}>{t('operationsResources.overviewFocusValue')}</Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card
        title={t('operationsResources.resourceCatalog')}
        extra={<Link to="/$lang/admin/medals" params={{ lang }}>{t('operationsResources.openMedals')}</Link>}
      >
        <Table<ResourceRow>
          columns={columns}
          dataSource={rows}
          rowKey="key"
          pagination={false}
          size="small"
          scroll={{ x: 1000 }}
        />
      </Card>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title={t('operationsResources.quickCardsTitle')}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Card size="small" type="inner" title={<Space><TagsOutlined /><span>{t('operationsResources.tags')}</span></Space>}>
                {t('operationsResources.tagsSummary')}
              </Card>
              <Card size="small" type="inner" title={<Space><GiftOutlined /><span>{t('operationsResources.medals')}</span></Space>}>
                {t('operationsResources.medalsSummary')}
              </Card>
              <Card size="small" type="inner" title={<Space><TrophyOutlined /><span>{t('operationsResources.exams')}</span></Space>}>
                {t('operationsResources.examsSummary')}
              </Card>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={t('operationsResources.implementedEntry')}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Card size="small" type="inner" title={<Space><DatabaseOutlined /><span>{t('operationsResources.medalsPage')}</span></Space>}>
                {t('operationsResources.medalsEntry')}
              </Card>
              <Card size="small" type="inner" title={<Space><UserOutlined /><span>{t('operationsResources.hrPage')}</span></Space>}>
                {t('operationsResources.hrEntry')}
              </Card>
              <Card size="small" type="inner" title={t('operationsResources.dataNoteTitle')}>
                {t('operationsResources.dataNote')}
              </Card>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  )
}
