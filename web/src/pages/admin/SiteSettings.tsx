import { Table, Button, Typography, Space, message, Input, Tag, Modal } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { listSiteSettings, updateSiteSetting } from '../../api/admin'
import type { SiteSetting } from '../../types'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'

const { Title } = Typography

export function SiteSettings() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const [editing, setEditing] = useState<SiteSetting | null>(null)
  const [value, setValue] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => listSiteSettings(),
    select: (res) => res.data.settings,
  })

  const updateMut = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => updateSiteSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
      setEditing(null)
      message.success(t('siteSettings.updateSuccess'))
    },
    onError: () => message.error(t('siteSettings.updateFailed')),
  })

  const columns: ColumnsType<SiteSetting> = [
    { title: t('siteSettings.key'), dataIndex: 'key', key: 'key', width: 200 },
    { title: t('siteSettings.value'), dataIndex: 'value', key: 'value', width: 250 },
    {
      title: t('siteSettings.type'),
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (t: string) => <Tag>{t}</Tag>,
    },
    { title: t('siteSettings.description'), dataIndex: 'description', key: 'description' },
    {
      title: tCommon('actions'),
      key: 'actions',
      width: 80,
      render: (_, r: SiteSetting) => (
        <Button size="small" icon={<EditOutlined />} onClick={() => { setEditing(r); setValue(r.value) }} />
      ),
    },
  ]

  return (
    <div>
      <Title level={4}>{t('siteSettings.title')}</Title>
      <Table columns={columns} dataSource={data} rowKey="key" loading={isLoading} size="small" pagination={false} />

      <Modal title={t('siteSettings.editTitle', { key: editing?.key })} open={!!editing} onCancel={() => setEditing(null)} footer={null} destroyOnClose>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input.TextArea rows={3} value={value} onChange={(e) => setValue(e.target.value)} />
          <Button type="primary" block onClick={() => editing && updateMut.mutate({ key: editing.key, value })} loading={updateMut.isPending}>
            {tCommon('save')}
          </Button>
        </Space>
      </Modal>
    </div>
  )
}
