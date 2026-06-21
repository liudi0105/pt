import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Table, Button, Tag, Typography, Space, Modal, Input, Select, message, Card, Form, Alert } from 'antd'
import { PlusOutlined, CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next'
import { listOffers, createOffer, voteOffer, getOfferVotes } from '../api/offer'
import type { Offer, OfferVote } from '../types'
import { getTorrentCategoryOptions } from '../constants/torrent'

dayjs.extend(relativeTime)

const { Title, Text } = Typography
const { TextArea } = Input
const candidateVoteThreshold = 5

export function Offers() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [keyword, setKeyword] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [votesOpen, setVotesOpen] = useState<number | null>(null)
  const [form] = Form.useForm<{ name: string; description?: string; category?: string }>()
  const queryClient = useQueryClient()
  const { t: tt } = useTranslation('torrent')
  const { t } = useTranslation()
  const { t: tCommon } = useTranslation('common')

  const { data, isLoading } = useQuery({
    queryKey: ['offers', page, status, keyword],
    queryFn: () => listOffers({ page, page_size: 20, status: status || undefined, keyword: keyword || undefined }),
    select: (res) => res.data,
  })

  const { data: votes } = useQuery({
    queryKey: ['offer-votes', votesOpen],
    queryFn: () => getOfferVotes(votesOpen!),
    enabled: votesOpen !== null,
    select: (res) => res.data.votes,
  })

  const createMut = useMutation({
    mutationFn: (values: { name: string; description?: string; category?: string }) => createOffer(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      setCreateOpen(false)
      form.resetFields()
      message.success(tt('uploadSuccess'))
    },
    onError: (err: any) => message.error(err.response?.data?.error || tt('uploadFailed')),
  })

  const voteMut = useMutation({
    mutationFn: ({ id, isYeah }: { id: number; isYeah: boolean }) => voteOffer(id, isYeah),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      message.success(t('submit'))
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('error')),
  })

  const handleCreate = async () => {
    const values = await form.validateFields()
    createMut.mutate(values)
  }

  const statusTag = (current: string) => {
    if (current === 'allowed') return <Tag color="green" icon={<CheckCircleOutlined />}>{t('status.allowed')}</Tag>
    if (current === 'denied') return <Tag color="red" icon={<CloseCircleOutlined />}>{t('status.denied')}</Tag>
    return <Tag color="blue" icon={<MinusCircleOutlined />}>{t('status.pending')}</Tag>
  }

  const columns: ColumnsType<Offer> = [
    {
      title: tt('name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, r: Offer) => (
        <div>
          <div>{name}</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            {r.description?.slice(0, 140) || t('description')}
          </div>
        </div>
      ),
    },
    {
      title: tt('category'),
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (cat: string) => (cat ? <Tag>{cat}</Tag> : '-'),
    },
    {
      title: tt('status'),
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (current: string) => statusTag(current),
    },
    {
      title: t('actions'),
      key: 'votes',
      width: 220,
      render: (_, r: Offer) => (
        <Space size={6} wrap>
          <Tag color="green">{r.vote_yeah}</Tag>
          <Tag color="red">{r.vote_against}</Tag>
          {r.status === 'pending' && (
            <>
              <Button size="small" type="link" onClick={() => voteMut.mutate({ id: r.id, isYeah: true })} loading={voteMut.isPending}>
                {t('status.yes')}
              </Button>
              <Button size="small" type="link" danger onClick={() => voteMut.mutate({ id: r.id, isYeah: false })} loading={voteMut.isPending}>
                {t('status.no')}
              </Button>
            </>
          )}
          <Button size="small" type="link" onClick={() => setVotesOpen(r.id)}>
            {t('view')}
          </Button>
        </Space>
      ),
    },
    {
      title: tt('uploader'),
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: tt('created'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 130,
      render: (d: string) => dayjs(d).fromNow(),
    },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }} align="start">
        <div>
          <Title level={3} style={{ margin: 0 }}>{t('nav.candidates')}</Title>
          <Text type="secondary">发起候选，其他用户可投赞成/反对；达到 {candidateVoteThreshold} 票差值后自动通过或拒绝。</Text>
        </div>
        <Space>
          <Select
            placeholder={tt('status')}
            value={status || undefined}
            onChange={setStatus}
            allowClear
            style={{ width: 120 }}
            options={[
              { value: 'pending', label: t('status.pending') },
              { value: 'allowed', label: t('status.allowed') },
              { value: 'denied', label: t('status.denied') },
            ]}
          />
          <Input.Search placeholder={tt('searchPlaceholder')} onSearch={setKeyword} allowClear style={{ width: 250 }} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            {t('nav.candidates')}
          </Button>
        </Space>
      </Space>

      <Alert
        style={{ marginBottom: 16 }}
        type="info"
        showIcon
        message="候选功能"
        description="用于提交站内缺失的资源提案。你可以先发起候选，再由其他用户投票决定是否收入站。"
      />

      <Table
        columns={columns}
        dataSource={data?.offers}
        rowKey="id"
        loading={isLoading}
        size="small"
        pagination={{
          current: page,
          pageSize: 20,
          total: data?.total,
          onChange: setPage,
          showTotal: (total) => t('pagination.total', { count: total }),
        }}
      />

      <Modal
        title={t('nav.candidates')}
        open={createOpen}
        onCancel={() => {
          setCreateOpen(false)
          form.resetFields()
        }}
        onOk={handleCreate}
        confirmLoading={createMut.isPending}
        okText={t('submit')}
        cancelText={t('back')}
        destroyOnClose
      >
        <Card size="small">
          <Form form={form} preserve={false} labelCol={{ style: { width: 80 } }}>
            <Form.Item
              name="name"
              label={tt('name')}
              rules={[{ required: true, message: tt('name') + ' is required' }]}
            >
              <Input placeholder="请输入候选名称" />
            </Form.Item>

            <Form.Item
              name="category"
              label={tt('category')}
              rules={[{ required: true, message: tt('category') + ' is required' }]}
            >
              <Select
                placeholder={tt('categoryPlaceholder')}
                options={getTorrentCategoryOptions(tCommon)}
              />
            </Form.Item>

            <Form.Item name="description" label={tt('description')}>
              <TextArea rows={5} placeholder="补充来源、版本、规格、补充说明" />
            </Form.Item>
          </Form>
        </Card>
      </Modal>

      <Modal title={t('nav.candidates')} open={votesOpen !== null} onCancel={() => setVotesOpen(null)} footer={null}>
        {votes?.map((v: OfferVote) => (
          <div key={v.id} style={{ padding: '4px 0' }}>
            <Tag color={v.is_yeah ? 'green' : 'red'}>{v.is_yeah ? t('status.yes') : t('status.no')}</Tag>
            <Text>{v.username}</Text>
            <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>{dayjs(v.created_at).fromNow()}</Text>
          </div>
        ))}
        {(!votes || votes.length === 0) && <Text type="secondary">{tt('noComments')}</Text>}
      </Modal>
    </div>
  )
}
