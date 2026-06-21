import { useState } from 'react'
import {
  Table, Button, Modal, Form, Input, InputNumber, Switch, Space, message, Typography, Popconfirm, Select,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listLevels, createLevel, updateLevel, deleteLevel } from '../../api/admin'
import type { UserLevel } from '../../types'
import { useTranslation } from 'react-i18next'
import { ColorPickerField } from '../../components/ColorPickerField'
import { IconPicker } from '../../components/IconPicker'
import { useI18n } from '../../hooks/useI18n'
import { DB_I18N_LOCALES, mergeI18nFields, resolveDbLang } from '../../utils/i18nPayload'

const { Title } = Typography

export function LevelManage() {
  const { t } = useTranslation('admin')
  const { t: tCommon, i18n } = useTranslation('common')
  const currentLang = resolveDbLang(i18n.language)
  const levelI18n = useI18n('user_level')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<UserLevel | null>(null)
  const [i18nRows, setI18nRows] = useState<string[]>([])
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'levels'],
    queryFn: () => listLevels(),
    select: (res) => res.data.levels,
  })

  const createMut = useMutation({
    mutationFn: createLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'levels'] })
      queryClient.invalidateQueries({ queryKey: ['db-i18n'] })
      setModalOpen(false)
      message.success(t('levelManage.createSuccess'))
    },
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UserLevel> }) => updateLevel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'levels'] })
      queryClient.invalidateQueries({ queryKey: ['db-i18n'] })
      setModalOpen(false)
      message.success(t('levelManage.updateSuccess'))
    },
  })
  const deleteMut = useMutation({
    mutationFn: deleteLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'levels'] })
      queryClient.invalidateQueries({ queryKey: ['db-i18n'] })
      message.success(t('levelManage.deleteSuccess'))
    },
  })

  const openModal = (record: UserLevel | null) => {
    setEditingRecord(record)
    if (record) {
      const entityI18n = levelI18n.getEntityI18n(String(record.code))
      if (entityI18n) {
        setI18nRows(Object.keys(entityI18n))
      } else {
        setI18nRows([])
      }
    } else {
      setI18nRows([])
    }
    setModalOpen(true)
  }

  const columns = [
    { title: t('levelManage.code'), dataIndex: 'code', key: 'code', width: 80 },
    {
      title: t('levelManage.display'),
      key: 'label',
      render: (_: unknown, record: UserLevel) => levelI18n.getLabel(String(record.code)),
    },
    {
      title: t('levelManage.color'),
      dataIndex: 'color',
      key: 'color',
      width: 80,
      render: (color: string) => color ? <span style={{ color, fontWeight: 'bold' }}>●</span> : '-',
    },
    { title: t('levelManage.minUpload'), dataIndex: 'min_upload', key: 'min_upload', render: (v: number) => formatBytes(v) },
    { title: t('levelManage.minDownload'), dataIndex: 'min_download', key: 'min_download', render: (v: number) => formatBytes(v) },
    { title: t('levelManage.minRatio'), dataIndex: 'min_ratio', key: 'min_ratio' },
    { title: t('levelManage.minBonus'), dataIndex: 'min_bonus', key: 'min_bonus' },
    { title: t('levelManage.minSeeds'), dataIndex: 'min_seed_count', key: 'min_seed_count' },
    { title: t('levelManage.sort'), dataIndex: 'sort_order', key: 'sort_order', width: 60 },
    {
      title: t('levelManage.active'),
      dataIndex: 'is_active',
      key: 'is_active',
      width: 60,
      render: (v: boolean) => (v ? tCommon('boolean.yes') : tCommon('boolean.no')),
    },
    {
      title: tCommon('actions'),
      key: 'actions',
      width: 120,
      render: (_: any, record: UserLevel) => (
        <Space>
          <Button size="small" onClick={() => openModal(record)}>
            {tCommon('edit')}
          </Button>
          <Popconfirm title={t('levelManage.deleteConfirm')} onConfirm={() => deleteMut.mutate(record.id)}>
            <Button size="small" danger>{tCommon('delete')}</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Title level={3} style={{ margin: 0 }}>{t('levelManage.title')}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal(null)}
        >
          {t('levelManage.addLevel')}
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={isLoading}
        size="small"
        pagination={false}
      />

      <Modal
        title={editingRecord ? t('levelManage.editLevel') : t('levelManage.newLevel')}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          labelCol={{ style: { width: 110 } }}
          initialValues={editingRecord ? {
            ...editingRecord,
            label: levelI18n.getEntityI18n(String(editingRecord.code))?.[currentLang]?.label || '',
            color: editingRecord.color || '#000000',
          } : {}}
          onFinish={(values) => {
            const payload: Record<string, unknown> = {
              ...values,
              color: values.color?.toHexString?.() ?? values.color,
            }
            let mergedI18n = levelI18n.getEntityI18n(String(editingRecord?.code ?? '')) || {}
            if (values.label) {
              mergedI18n = mergeI18nFields(mergedI18n, currentLang, {
                label: values.label as string,
              })
            }
            for (const locale of i18nRows) {
              const labelKey = `i18n_${locale}_label`
              if (values[labelKey]) {
                mergedI18n = mergeI18nFields(mergedI18n, locale, {
                  label: values[labelKey] as string,
                })
              }
            }
            if (Object.keys(mergedI18n).length > 0) {
              payload.i18n = mergedI18n
            }
            if (editingRecord) {
              updateMut.mutate({ id: editingRecord.id, data: payload as Partial<UserLevel> })
            } else {
              createMut.mutate(payload as Partial<UserLevel>)
            }
          }}
        >
          <Form.Item name="code" label={t('levelManage.codeLabel')} rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="label" label={t('levelManage.display')}>
            <Input />
          </Form.Item>
          <Form.Item name="color" label={t('levelManage.colorLabel')}>
            <ColorPickerField />
          </Form.Item>
          <Form.Item name="icon" label={t('levelManage.iconLabel')}>
            <IconPicker />
          </Form.Item>
          <Form.Item name="min_upload" label={t('levelManage.minUploadLabel')}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="min_download" label={t('levelManage.minDownloadLabel')}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="min_ratio" label={t('levelManage.minRatioLabel')}>
            <InputNumber style={{ width: '100%' }} min={0} step={0.001} />
          </Form.Item>
          <Form.Item name="min_bonus" label={t('levelManage.minBonusLabel')}>
            <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
          </Form.Item>
          <Form.Item name="min_seed_count" label={t('levelManage.minSeedsLabel')}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="sort_order" label={t('levelManage.sortOrderLabel')}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="is_active" label={t('levelManage.activeLabel')} valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>

          <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
            {t('dictManage.i18nLabel')}
          </Typography.Text>
          {i18nRows.map((locale) => (
            <Space key={locale} style={{ display: 'flex', marginBottom: 8 }} align="start">
              <Form.Item name={`i18n_${locale}_label`} label={locale} style={{ marginBottom: 0 }}
                initialValue={editingRecord ? levelI18n.getEntityI18n(String(editingRecord.code))?.[locale]?.label ?? '' : ''}
              >
                <Input placeholder={t('levelManage.i18nLabelPlaceholder')} />
              </Form.Item>
              <Button type="link" danger onClick={() => setI18nRows(i18nRows.filter((l) => l !== locale))}>
                {tCommon('delete')}
              </Button>
            </Space>
          ))}
          <Select
            style={{ width: 200, marginBottom: 16 }}
            placeholder={t('dictManage.addLocale')}
            value={null}
            onChange={(locale: string) => {
              if (!i18nRows.includes(locale)) {
                setI18nRows([...i18nRows, locale])
              }
            }}
            options={DB_I18N_LOCALES.filter((l) => !i18nRows.includes(l)).map((l) => ({ value: l, label: l }))}
          />

          <Button type="primary" htmlType="submit" loading={createMut.isPending || updateMut.isPending}>
            {editingRecord ? tCommon('update') : tCommon('create')}
          </Button>
        </Form>
      </Modal>
    </div>
  )
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}
