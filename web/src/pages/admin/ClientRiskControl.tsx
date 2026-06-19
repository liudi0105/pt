import { Alert, Card, Col, Row, Space, Statistic, Table, Tag, Timeline, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { CheckCircleOutlined, CloseCircleOutlined, SafetyOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const { Title, Paragraph, Text } = Typography

type RiskRule = {
  key: string
  rule: string
  scope: string
  endpoint: string
  priority: string
  outcome: 'allow' | 'deny' | 'exception'
  notes: string
}

const allowRules: RiskRule[] = [
  {
    key: 'allow-list',
    rule: 'Agent Allow 白名单',
    scope: '已知可用客户端',
    endpoint: 'resource /api/agent-allows',
    priority: '最高',
    outcome: 'allow',
    notes: '用于维护允许接入站点的客户端标识。',
  },
  {
    key: 'allow-query',
    rule: '全量白名单读取',
    scope: '后台治理 / 排查',
    endpoint: 'GET /api/all-agent-allows',
    priority: '高',
    outcome: 'allow',
    notes: '用于后台查看完整规则集合。',
  },
  {
    key: 'allow-exception',
    rule: '例外放行',
    scope: '单次校验',
    endpoint: 'POST /api/agent-check',
    priority: '按规则',
    outcome: 'exception',
    notes: '命中例外规则时覆盖默认拒绝结果。',
  },
]

const denyRules: RiskRule[] = [
  {
    key: 'deny-list',
    rule: 'Agent Deny 黑名单',
    scope: '已确认风险客户端',
    endpoint: 'resource /api/agent-denies',
    priority: '最高',
    outcome: 'deny',
    notes: '用于拒绝接入和风险治理。',
  },
  {
    key: 'deny-check',
    rule: '接入校验结果',
    scope: 'Tracker / 下载入口',
    endpoint: 'POST /api/agent-check',
    priority: '执行时',
    outcome: 'deny',
    notes: '风控结果会影响客户端是否允许继续连接。',
  },
]

export function ClientRiskControl() {
  const { t } = useTranslation('admin')
  const ruleColumns: ColumnsType<RiskRule> = [
    { title: t('clientRiskControl.rule'), dataIndex: 'rule', key: 'rule', width: 180 },
    { title: t('clientRiskControl.scope'), dataIndex: 'scope', key: 'scope', width: 150 },
    { title: t('clientRiskControl.endpoint'), dataIndex: 'endpoint', key: 'endpoint', width: 190 },
    { title: t('clientRiskControl.priority'), dataIndex: 'priority', key: 'priority', width: 90 },
    {
      title: t('clientRiskControl.outcome'),
      dataIndex: 'outcome',
      key: 'outcome',
      width: 110,
      render: (outcome: RiskRule['outcome']) => {
        if (outcome === 'allow') return <Tag color="green" icon={<CheckCircleOutlined />}>{t('clientRiskControl.allow')}</Tag>
        if (outcome === 'deny') return <Tag color="red" icon={<CloseCircleOutlined />}>{t('clientRiskControl.deny')}</Tag>
        return <Tag color="blue" icon={<SafetyOutlined />}>{t('clientRiskControl.exception')}</Tag>
      },
    },
    { title: t('clientRiskControl.notes'), dataIndex: 'notes', key: 'notes' },
  ]

  const steps = [
    t('clientRiskControl.step1'),
    t('clientRiskControl.step2'),
    t('clientRiskControl.step3'),
    t('clientRiskControl.step4'),
  ]

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={3}>{t('clientRiskControl.title')}</Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          {t('clientRiskControl.subtitle')}
        </Paragraph>
      </div>

      <Alert
        type="info"
        showIcon
        message={t('clientRiskControl.alertTitle')}
        description={t('clientRiskControl.alertDescription')}
      />

      <Row gutter={16}>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic title={t('clientRiskControl.summaryRules')} value={allowRules.length + denyRules.length} prefix={<SafetyOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic title={t('clientRiskControl.summaryAllow')} value={allowRules.length} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic title={t('clientRiskControl.summaryDeny')} value={denyRules.length} prefix={<CloseCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card>
            <Statistic title={t('clientRiskControl.summaryException')} value={1} prefix={<SafetyOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} xl={12}>
          <Card title={t('clientRiskControl.allowTitle')} bordered>
            <Table<RiskRule>
              columns={ruleColumns}
              dataSource={allowRules}
              rowKey="key"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card title={t('clientRiskControl.denyTitle')} bordered>
            <Table<RiskRule>
              columns={ruleColumns}
              dataSource={denyRules}
              rowKey="key"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Card title={t('clientRiskControl.checkTitle')}>
        <Timeline
          items={steps.map((item, index) => ({
            children: (
              <Space direction="vertical" size={0}>
                <Text strong>{t('clientRiskControl.stepLabel', { step: index + 1 })}</Text>
                <Text>{item}</Text>
              </Space>
            ),
          }))}
        />
      </Card>
    </Space>
  )
}
