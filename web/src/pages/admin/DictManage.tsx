import { useState, useEffect, useCallback } from 'react'
import {
  Select, Table, Button, Modal, Form, Input, InputNumber, Switch, Space, message, Typography, Popconfirm, Card, Spin,
} from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Route } from '../../routes/$lang/admin/dict'
import { listDictTypes, createDictType, updateDictType, deleteDictType, listDictData, createDictData, updateDictData, deleteDictData } from '../../api/admin'
import type { DictType, DictData } from '../../types'

const { Title } = Typography
const { TextArea } = Input

interface LocaleRow {
  locale: string
  label: string
  remark?: string
}

const LOCALE_OPTIONS = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
  { value: 'jp', label: '日本語' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ko', label: '한국어' },
  { value: 'ru', label: 'Русский' },
  { value: 'es', label: 'Español' },
]

function i18nToRows(i18n: Record<string, Record<string, string>> | undefined): LocaleRow[] {
  if (!i18n) return []
  return Object.entries(i18n).map(([locale, fields]) => ({
    locale,
    label: fields.label || '',
    remark: fields.remark || '',
  }))
}

function rowsToI18n(rows: LocaleRow[]): Record<string, Record<string, string>> {
  const i18n: Record<string, Record<string, string>> = {}
  for (const row of rows) {
    if (!row.locale) continue
    i18n[row.locale] = { label: row.label || '' }
    if (row.remark !== undefined) {
      i18n[row.locale].remark = row.remark
    }
  }
  return i18n
}

function localizedLabel(entity: { i18n?: Record<string, Record<string, string>>; label?: string } | null | undefined, lang: string, field = 'label'): string {
  if (!entity) return ''
  return entity.i18n?.[lang]?.[field] || entity.label || ''
}

export function DictManage() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const navigate = useNavigate()
  const { lang } = useParams({ from: '/$lang' })
  const { type_key } = Route.useSearch()
  const activeTypeKey = type_key ?? null
  const [typeModal, setTypeModal] = useState<{ open: boolean; record?: DictType }>({ open: false })
  const [dataModal, setDataModal] = useState<{ open: boolean; record?: DictData }>({ open: false })
  const [typeLocaleRows, setTypeLocaleRows] = useState<LocaleRow[]>([])
  const [dataLocaleRows, setDataLocaleRows] = useState<LocaleRow[]>([])
  const queryClient = useQueryClient()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const openTypeModal = useCallback((record?: DictType) => {
    setTypeModal({ open: true, record })
    setTypeLocaleRows(i18nToRows(record?.i18n))
  }, [])

  const closeTypeModal = useCallback(() => {
    setTypeModal({ open: false })
    setTypeLocaleRows([])
  }, [])

  const openDataModal = useCallback((record?: DictData) => {
    setDataModal({ open: true, record })
    setDataLocaleRows(i18nToRows(record?.i18n))
  }, [])

  const closeDataModal = useCallback(() => {
    setDataModal({ open: false })
    setDataLocaleRows([])
  }, [])

  const setActiveType = (key: string | null) => {
    navigate({ to: '/$lang/admin/dict', params: { lang }, search: key ? { type_key: key } : {} })
  }

  const { data: types } = useQuery({
    queryKey: ['admin', 'dict-types'],
    queryFn: () => listDictTypes(),
    select: (res) => res.data.types,
  })

  const { data: dictData, isLoading } = useQuery({
    queryKey: ['admin', 'dict-data', activeTypeKey],
    queryFn: () => listDictData(activeTypeKey ?? undefined),
    enabled: !!activeTypeKey,
    select: (res) => res.data.data,
  })

  const selectedType = types?.find((t) => t.key === activeTypeKey)

  const createTypeMut = useMutation({
    mutationFn: createDictType,
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'dict-types'] })
      setActiveType(created.data.key)
      closeTypeModal()
      message.success(t('dictManage.typeCreated'))
    },
  })
  const updateTypeMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DictType> }) => updateDictType(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'dict-types'] })
      if (updated.data.key !== activeTypeKey) {
        setActiveType(updated.data.key)
      }
      closeTypeModal()
      message.success(t('dictManage.typeUpdated'))
    },
  })
  const deleteTypeMut = useMutation({
    mutationFn: deleteDictType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'dict-types'] })
      setActiveType(null)
      message.success(t('dictManage.typeDeleted'))
    },
  })

  const createDataMut = useMutation({
    mutationFn: (data: Partial<DictData>) => createDictData({ ...data, type_key: activeTypeKey! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'dict-data'] })
      closeDataModal()
      message.success(t('dictManage.entryCreated'))
    },
  })
  const updateDataMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DictData> }) => updateDictData(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'dict-data'] })
      closeDataModal()
      message.success(t('dictManage.entryUpdated'))
    },
  })
  const deleteDataMut = useMutation({
    mutationFn: deleteDictData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'dict-data'] })
      message.success(t('dictManage.entryDeleted'))
    },
  })

  const dataColumns = [
    { title: t('dictManage.key'), dataIndex: 'key', key: 'key' },
    { title: t('dictManage.value'), dataIndex: 'value', key: 'value', ellipsis: true },
    { title: t('dictManage.label'), key: 'label', render: (_: unknown, record: DictData) => localizedLabel(record, lang) },
    { title: t('dictManage.sort'), dataIndex: 'sort_order', key: 'sort_order', width: 60 },
    {
      title: t('dictManage.default'),
      dataIndex: 'is_default',
      key: 'is_default',
      width: 60,
      render: (v: boolean) => v ? tCommon('yes') : '-',
    },
    {
      title: t('dictManage.active'),
      dataIndex: 'is_active',
      key: 'is_active',
      width: 60,
      render: (v: boolean) => v ? tCommon('yes') : tCommon('no'),
    },
    {
      title: tCommon('actions'),
      key: 'actions',
      width: 140,
      render: (_: any, record: DictData) => (
        <Space>
          <Button size="small" onClick={() => openDataModal(record)}>{tCommon('edit')}</Button>
          <Popconfirm title={t('dictManage.deleteEntryConfirm')} onConfirm={() => deleteDataMut.mutate(record.id)}>
            <Button size="small" danger>{tCommon('delete')}</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  if (!mounted && activeTypeKey === null) {
    return <Spin style={{ display: 'block', margin: '40px auto' }} />
  }

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Title level={3} style={{ margin: 0 }}>{t('dictManage.title')}</Title>
        <Button icon={<PlusOutlined />} onClick={() => openTypeModal()}>
          {t('dictManage.addType')}
        </Button>
      </Space>

      <Select
        placeholder={t('dictManage.selectType')}
        value={activeTypeKey}
        onChange={(value) => setActiveType(value ?? null)}
        allowClear
        showSearch
        style={{ width: 360, marginBottom: 16 }}
        optionFilterProp="label"
        options={types?.map((t) => ({ value: t.key, label: `${localizedLabel(t, lang)} (${t.key})` }))}
      />

      {selectedType && (
        <Card
          size="small"
          title={
            <Space>
              <span>{localizedLabel(selectedType, lang)}</span>
              <Button size="small" onClick={() => openTypeModal(selectedType)}>
                {tCommon('edit')}
              </Button>
              {!selectedType.is_system && (
                <Popconfirm title={t('dictManage.deleteTypeConfirm')} onConfirm={() => deleteTypeMut.mutate(selectedType.id)}>
                  <Button size="small" danger>{tCommon('delete')}</Button>
                </Popconfirm>
              )}
            </Space>
          }
          extra={
            <Button icon={<PlusOutlined />} size="small" type="primary" onClick={() => openDataModal()} disabled={!activeTypeKey}>
              {t('dictManage.addEntry')}
            </Button>
          }
        >
          <Table
            columns={dataColumns}
            dataSource={dictData}
            rowKey="id"
            loading={isLoading}
            size="small"
            pagination={false}
          />
        </Card>
      )}

      <Modal
        title={typeModal.record ? t('dictManage.editType') : t('dictManage.newType')}
        open={typeModal.open}
        onCancel={closeTypeModal}
        footer={null}
        width={600}
      >
          <Form
          layout="vertical"
          initialValues={typeModal.record}
          onFinish={(values) => {
            const payload = { ...values, i18n: rowsToI18n(typeLocaleRows) }
            if (typeModal.record) {
              updateTypeMut.mutate({ id: typeModal.record.id, data: payload })
            } else {
              createTypeMut.mutate(payload)
            }
          }}
        >
          <Form.Item name="key" label={t('dictManage.keyLabel')} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="label" label={t('dictManage.labelLabel')} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="remark" label={t('dictManage.remarkLabel')}>
            <Input />
          </Form.Item>
          <Form.Item name="sort_order" label={t('dictManage.sortOrderLabel')}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <div style={{ marginBottom: 16 }}>
            <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
              {t('dictManage.i18nLabel')}
            </Typography.Text>
            {typeLocaleRows.map((row, idx) => (
              <Space key={idx} style={{ display: 'flex', marginBottom: 8 }} align="start">
                <Select
                  value={row.locale}
                  onChange={(v) => {
                    const next = [...typeLocaleRows]
                    next[idx] = { ...next[idx], locale: v }
                    setTypeLocaleRows(next)
                  }}
                  style={{ width: 100 }}
                  options={LOCALE_OPTIONS}
                />
                <Input
                  placeholder={t('dictManage.labelLabel')}
                  value={row.label}
                  onChange={(e) => {
                    const next = [...typeLocaleRows]
                    next[idx] = { ...next[idx], label: e.target.value }
                    setTypeLocaleRows(next)
                  }}
                  style={{ width: 160 }}
                />
                <Input
                  placeholder={t('dictManage.remarkLabel')}
                  value={row.remark}
                  onChange={(e) => {
                    const next = [...typeLocaleRows]
                    next[idx] = { ...next[idx], remark: e.target.value }
                    setTypeLocaleRows(next)
                  }}
                  style={{ width: 160 }}
                />
                <Button
                  type="text"
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => setTypeLocaleRows((prev) => prev.filter((_, i) => i !== idx))}
                />
              </Space>
            ))}
            <Button
              type="dashed"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setTypeLocaleRows((prev) => [...prev, { locale: '', label: '', remark: '' }])}
            >
              {t('dictManage.addLocale')}
            </Button>
          </div>

          <Button type="primary" htmlType="submit" loading={createTypeMut.isPending || updateTypeMut.isPending}>
            {typeModal.record ? tCommon('update') : tCommon('create')}
          </Button>
        </Form>
      </Modal>

      <Modal
        title={dataModal.record ? t('dictManage.editEntry') : t('dictManage.newEntry')}
        open={dataModal.open}
        onCancel={closeDataModal}
        footer={null}
        width={600}
      >
        <Form
          layout="vertical"
          initialValues={dataModal.record}
          onFinish={(values) => {
            const payload = { ...values, i18n: rowsToI18n(dataLocaleRows) }
            if (dataModal.record) {
              updateDataMut.mutate({ id: dataModal.record.id, data: payload })
            } else {
              createDataMut.mutate(payload)
            }
          }}
        >
          <Form.Item name="type_key" initialValue={activeTypeKey} hidden>
            <Input />
          </Form.Item>
          <Form.Item name="key" label={t('dictManage.keyLabel')} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="value" label={t('dictManage.valueLabel')}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="label" label={t('dictManage.labelLabel')}>
            <Input />
          </Form.Item>
          <Form.Item name="sort_order" label={t('dictManage.sortOrderLabel')}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="is_default" label={t('dictManage.defaultLabel')} valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="is_active" label={t('dictManage.activeLabel')} valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>

          <div style={{ marginBottom: 16 }}>
            <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
              {t('dictManage.i18nLabel')}
            </Typography.Text>
            {dataLocaleRows.map((row, idx) => (
              <Space key={idx} style={{ display: 'flex', marginBottom: 8 }} align="start">
                <Select
                  value={row.locale}
                  onChange={(v) => {
                    const next = [...dataLocaleRows]
                    next[idx] = { ...next[idx], locale: v }
                    setDataLocaleRows(next)
                  }}
                  style={{ width: 100 }}
                  options={LOCALE_OPTIONS}
                />
                <Input
                  placeholder={t('dictManage.labelLabel')}
                  value={row.label}
                  onChange={(e) => {
                    const next = [...dataLocaleRows]
                    next[idx] = { ...next[idx], label: e.target.value }
                    setDataLocaleRows(next)
                  }}
                  style={{ width: 260 }}
                />
                <Button
                  type="text"
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => setDataLocaleRows((prev) => prev.filter((_, i) => i !== idx))}
                />
              </Space>
            ))}
            <Button
              type="dashed"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setDataLocaleRows((prev) => [...prev, { locale: '', label: '' }])}
            >
              {t('dictManage.addLocale')}
            </Button>
          </div>

          <Button type="primary" htmlType="submit" loading={createDataMut.isPending || updateDataMut.isPending}>
            {dataModal.record ? tCommon('update') : tCommon('create')}
          </Button>
        </Form>
      </Modal>
    </div>
  )
}
