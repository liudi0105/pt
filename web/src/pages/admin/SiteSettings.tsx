import { useMemo, useState } from 'react'
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Tabs,
  Typography,
  message,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EditOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { listSiteSettings, updateSiteSetting } from '../../api/admin'
import type { SiteSetting } from '../../types'

const { Title, Paragraph, Text } = Typography

type SiteSettingGroup = {
  key: string
  title: string
  description: string
  keys: string[]
}

type EditableSetting = SiteSetting & {
  groupKey: string
}

const groupKeys = {
  basic: ['site_name'],
  tracker: [
    'tracker.interval',
    'tracker.min_interval',
    'tracker.cleanup_interval',
    'tracker.peer_ttl',
    'tracker.default_numwant',
    'tracker.allowed_clients',
    'tracker.blacklist_ports',
  ],
  bonus: [
    'bonus.per_hour', 'bonus.seed_bonus', 'bonus.size_bonus',
    'bonus.tzero', 'bonus.nzero', 'bonus.bzero', 'bonus.l',
    'bonus.perseeding', 'bonus.maxseeding', 'bonus.harvest_interval',
  ],
  hr: ['hr.enabled', 'hr.seed_hours', 'hr.check_interval'],
}

function groupForKey(key: string): string {
  if (key === 'site_name') return 'basic'
  if (key.startsWith('tracker.')) return 'tracker'
  if (key.startsWith('bonus.')) return 'bonus'
  if (key.startsWith('hr.')) return 'hr'
  return 'other'
}

function labelForType(type: string, t: (key: string, opts?: Record<string, any>) => string) {
  const map: Record<string, string> = {
    string: t('siteSettings.typeString'),
    duration: t('siteSettings.typeDuration'),
    int: t('siteSettings.typeInt'),
    float: t('siteSettings.typeFloat'),
    bool: t('siteSettings.typeBool'),
    json: t('siteSettings.typeJson'),
    csv: t('siteSettings.typeCsv'),
  }
  return map[type] ?? type
}

function normalizeValueByType(type: string, value: string) {
  if (type === 'json') {
    try {
      return JSON.stringify(JSON.parse(value), null, 2)
    } catch {
      return value
    }
  }
  return value
}

export function SiteSettings() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const [editing, setEditing] = useState<EditableSetting | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => listSiteSettings(),
    select: (res) => res.data.settings,
  })

  const grouped = useMemo(() => {
    const groups: Record<string, EditableSetting[]> = {}
    for (const item of data ?? []) {
      const groupKey = groupForKey(item.key)
      if (!groups[groupKey]) groups[groupKey] = []
      groups[groupKey].push({ ...item, groupKey })
    }

    for (const list of Object.values(groups)) {
      list.sort((a, b) => a.key.localeCompare(b.key))
    }

    return groups
  }, [data])

  const updateMut = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => updateSiteSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
      setEditing(null)
      message.success(t('siteSettings.updateSuccess'))
    },
    onError: () => message.error(t('siteSettings.updateFailed')),
  })

  const groups: SiteSettingGroup[] = [
    {
      key: 'basic',
      title: t('siteSettings.groups.basic'),
      description: t('siteSettings.groups.basicDesc'),
      keys: groupKeys.basic,
    },
    {
      key: 'tracker',
      title: t('siteSettings.groups.tracker'),
      description: t('siteSettings.groups.trackerDesc'),
      keys: groupKeys.tracker,
    },
    {
      key: 'bonus',
      title: t('siteSettings.groups.bonus'),
      description: t('siteSettings.groups.bonusDesc'),
      keys: groupKeys.bonus,
    },
    {
      key: 'hr',
      title: t('siteSettings.groups.hr'),
      description: t('siteSettings.groups.hrDesc'),
      keys: groupKeys.hr,
    },
  ]

  const columns: ColumnsType<EditableSetting> = [
    { title: t('siteSettings.key'), dataIndex: 'key', key: 'key', width: 220 },
    {
      title: t('siteSettings.value'),
      dataIndex: 'value',
      key: 'value',
      render: (value: string, record: EditableSetting) => (
        <Text code ellipsis={{ tooltip: value }} style={{ maxWidth: 360, display: 'inline-block' }}>
          {normalizeValueByType(record.type, value)}
        </Text>
      ),
    },
    {
      title: t('siteSettings.type'),
      dataIndex: 'type',
      key: 'type',
      width: 110,
      render: (value: string) => <Tag>{labelForType(value, t)}</Tag>,
    },
    {
      title: t('siteSettings.description'),
      key: 'description',
      render: (_, record: EditableSetting) => (
        <Text
          ellipsis={{ tooltip: t(`siteSettings.descriptions.${record.key}`, { defaultValue: record.description }) }}
        >
          {t(`siteSettings.descriptions.${record.key}`, { defaultValue: record.description })}
        </Text>
      ),
    },
    {
      title: tCommon('actions'),
      key: 'actions',
      width: 80,
      render: (_, record: EditableSetting) => (
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => {
            setEditing(record)
            form.setFieldsValue({
              key: record.key,
              value: normalizeValueByType(record.type, record.value),
            })
          }}
        />
      ),
    },
  ]

  function getValueRules(type: string, key: string) {
    const rules: any[] = [{ required: true, message: t('siteSettings.required') }]

    if (type === 'duration') {
      rules.push({
        validator: async (_: unknown, value: string) => {
          if (!value || /^\d+(ms|s|m|h)$/i.test(value.trim())) return
          throw new Error(t('siteSettings.invalidDuration'))
        },
      })
    }

    if (type === 'int') {
      rules.push({
        validator: async (_: unknown, value: string | number) => {
          if (value === '' || value === null || value === undefined) throw new Error(t('siteSettings.required'))
          if (Number.isInteger(Number(value))) return
          throw new Error(t('siteSettings.invalidInteger'))
        },
      })
    }

    if (type === 'float') {
      rules.push({
        validator: async (_: unknown, value: string | number) => {
          if (value === '' || value === null || value === undefined) throw new Error(t('siteSettings.required'))
          if (!Number.isNaN(Number(value))) return
          throw new Error(t('siteSettings.invalidNumber'))
        },
      })
    }

    if (type === 'json') {
      rules.push({
        validator: async (_: unknown, value: string) => {
          try {
            JSON.parse(value)
            return
          } catch {
            throw new Error(t('siteSettings.invalidJson'))
          }
        },
      })
    }

    if (type === 'csv' && key === 'tracker.blacklist_ports') {
      rules.push({
        validator: async (_: unknown, value: string) => {
          const parts = value.split(',').map((item) => item.trim()).filter(Boolean)
          if (parts.length === 0) throw new Error(t('siteSettings.required'))
          if (parts.every((item) => /^\d+$/.test(item))) return
          throw new Error(t('siteSettings.invalidPortList'))
        },
      })
    }

    return rules
  }

  function renderEditor() {
    if (!editing) return null

    const field = editing.type === 'bool' ? (
      <Select
        options={[
          { label: t('siteSettings.boolTrue'), value: 'true' },
          { label: t('siteSettings.boolFalse'), value: 'false' },
        ]}
      />
    ) : editing.type === 'int' ? (
      <InputNumber style={{ width: '100%' }} />
    ) : editing.type === 'float' ? (
      <InputNumber style={{ width: '100%' }} step={0.1} />
    ) : editing.type === 'json' || editing.type === 'csv' || editing.type === 'duration' ? (
      <Input.TextArea rows={6} />
    ) : (
      <Input />
    )

    return (
      <Modal
        title={t('siteSettings.editTitle', { key: editing.key })}
        open={!!editing}
        onCancel={() => setEditing(null)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => updateMut.mutate({ key: editing.key, value: String(values.value).trim() })}
        >
          <Form.Item name="key" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label={t('siteSettings.value')}
            name="value"
            rules={getValueRules(editing.type, editing.key)}
          >
            {field}
          </Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={() => setEditing(null)}>{tCommon('cancel')}</Button>
            <Button type="primary" htmlType="submit" loading={updateMut.isPending}>
              {tCommon('save')}
            </Button>
          </Space>
        </Form>
      </Modal>
    )
  }

  return (
    <div>
      <Title level={4}>{t('siteSettings.title')}</Title>
      <Paragraph type="secondary" style={{ marginTop: -8 }}>
        {t('siteSettings.subtitle')}
      </Paragraph>

      <Tabs
        items={groups.map((group) => ({
          key: group.key,
          label: group.title,
          children: (
            <Card>
              <Space direction="vertical" size={6} style={{ width: '100%', marginBottom: 16 }}>
                <Text type="secondary">{group.description}</Text>
                <Text type="secondary">
                  {t('siteSettings.groupCount', { count: grouped[group.key]?.length ?? 0 })}
                </Text>
              </Space>
              <Table
                columns={columns}
                dataSource={grouped[group.key] ?? []}
                rowKey="key"
                loading={isLoading}
                size="small"
                pagination={false}
              />
            </Card>
          ),
        }))}
      />

      {renderEditor()}
    </div>
  )
}
