import { useState, useEffect } from 'react'
import {
  Select, Table, Button, Modal, Form, Input, InputNumber, Switch, Space, message, Typography, Popconfirm, Card, Spin,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Route } from '../../routes/$lang/admin.dict'
import { listDictTypes, createDictType, updateDictType, deleteDictType, listDictData, createDictData, updateDictData, deleteDictData } from '../../api/admin'
import type { DictType, DictData } from '../../types'

const { Title } = Typography
const { TextArea } = Input

export function DictManage() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const navigate = useNavigate()
  const { lang } = useParams({ from: '/$lang' })
  const { type_id } = Route.useSearch()
  const activeType = type_id ?? null
  const [typeModal, setTypeModal] = useState<{ open: boolean; record?: DictType }>({ open: false })
  const [dataModal, setDataModal] = useState<{ open: boolean; record?: DictData }>({ open: false })
  const queryClient = useQueryClient()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const setActiveType = (id: number | null) => {
    navigate({ to: `/${lang}/admin/dict`, search: id ? { type_id: id } : {} })
  }

  const { data: types } = useQuery({
    queryKey: ['admin', 'dict-types'],
    queryFn: () => listDictTypes(),
    select: (res) => res.data.types,
  })

  const { data: dictData, isLoading } = useQuery({
    queryKey: ['admin', 'dict-data', activeType],
    queryFn: () => listDictData(activeType ?? undefined),
    enabled: !!activeType,
    select: (res) => res.data.data,
  })

  const selectedType = types?.find((t) => t.id === activeType)

  const createTypeMut = useMutation({
    mutationFn: createDictType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'dict-types'] })
      setTypeModal({ open: false })
      message.success(t('dictManage.typeCreated'))
    },
  })
  const updateTypeMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DictType> }) => updateDictType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'dict-types'] })
      setTypeModal({ open: false })
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
    mutationFn: (data: Partial<DictData>) => createDictData({ ...data, type_id: activeType! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'dict-data'] })
      setDataModal({ open: false })
      message.success(t('dictManage.entryCreated'))
    },
  })
  const updateDataMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DictData> }) => updateDictData(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'dict-data'] })
      setDataModal({ open: false })
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
    { title: t('dictManage.label'), dataIndex: 'label', key: 'label' },
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
          <Button size="small" onClick={() => setDataModal({ open: true, record })}>{tCommon('edit')}</Button>
          <Popconfirm title={t('dictManage.deleteEntryConfirm')} onConfirm={() => deleteDataMut.mutate(record.id)}>
            <Button size="small" danger>{tCommon('delete')}</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  if (!mounted && activeType === null) {
    return <Spin style={{ display: 'block', margin: '40px auto' }} />
  }

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Title level={3} style={{ margin: 0 }}>{t('dictManage.title')}</Title>
        <Button icon={<PlusOutlined />} onClick={() => setTypeModal({ open: true })}>
          {t('dictManage.addType')}
        </Button>
      </Space>

      <Select
        placeholder={t('dictManage.selectType')}
        value={activeType}
        onChange={setActiveType}
        allowClear
        showSearch
        style={{ width: 360, marginBottom: 16 }}
        optionFilterProp="label"
        options={types?.map((t) => ({ value: t.id, label: `${t.label} (${t.name})` }))}
      />

      {selectedType && (
        <Card
          size="small"
          title={
            <Space>
              <span>{selectedType.label}</span>
              <Button size="small" onClick={() => setTypeModal({ open: true, record: selectedType })}>
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
            <Button icon={<PlusOutlined />} size="small" type="primary" onClick={() => setDataModal({ open: true })}>
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
        onCancel={() => setTypeModal({ open: false })}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={typeModal.record}
          onFinish={(values) => {
            if (typeModal.record) {
              updateTypeMut.mutate({ id: typeModal.record.id, data: values })
            } else {
              createTypeMut.mutate(values)
            }
          }}
        >
          <Form.Item name="name" label={t('dictManage.nameLabel')} rules={[{ required: true }]}>
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
          <Button type="primary" htmlType="submit" loading={createTypeMut.isPending || updateTypeMut.isPending}>
            {typeModal.record ? tCommon('update') : tCommon('create')}
          </Button>
        </Form>
      </Modal>

      <Modal
        title={dataModal.record ? t('dictManage.editEntry') : t('dictManage.newEntry')}
        open={dataModal.open}
        onCancel={() => setDataModal({ open: false })}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={dataModal.record}
          onFinish={(values) => {
            if (dataModal.record) {
              updateDataMut.mutate({ id: dataModal.record.id, data: values })
            } else {
              createDataMut.mutate(values)
            }
          }}
        >
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
          <Button type="primary" htmlType="submit" loading={createDataMut.isPending || updateDataMut.isPending}>
            {dataModal.record ? tCommon('update') : tCommon('create')}
          </Button>
        </Form>
      </Modal>
    </div>
  )
}
