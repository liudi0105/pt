import { useState } from 'react'
import { Table, Button, Tag, Typography, Space, Modal, Input, Select, message, Card } from 'antd'
import { PlusOutlined, CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listOffers, createOffer, voteOffer, getOfferVotes } from '../api/offer'
import type { Offer, OfferVote } from '../types'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next'

dayjs.extend(relativeTime)

const { Title, Text } = Typography
const { TextArea } = Input

export function Offers() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [keyword, setKeyword] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [votesOpen, setVotesOpen] = useState<number | null>(null)
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  function StatusTag(status: string) {
    if (status === 'allowed') return <Tag color="green" icon={<CheckCircleOutlined />}>{t('status.allowed')}</Tag>
    if (status === 'denied') return <Tag color="red" icon={<CloseCircleOutlined />}>{t('status.denied')}</Tag>
    return <Tag color="blue" icon={<MinusCircleOutlined />}>{t('status.pending')}</Tag>
  }

  const { data, isLoading } = useQuery({
    queryKey: ['offers', page, status, keyword],
    queryFn: () => listOffers({ page, page_size: 20, status: status || undefined, keyword: keyword || undefined }),
    select: (res) => res.data,
  })

  const { data: votes } = useQuery({
    queryKey: ['offer-votes', votesOpen],
    queryFn: () => getOfferVotes(votesOpen!),
    enabled: !!votesOpen,
    select: (res) => res.data.votes,
  })

  const createMut = useMutation({
    mutationFn: (values: { name: string; description?: string; category?: string }) => createOffer(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      setCreateOpen(false)
      message.success(t('torrent.commentSuccess'))
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('torrent.commentFailed')),
  })

  const voteMut = useMutation({
    mutationFn: ({ id, isYeah }: { id: number; isYeah: boolean }) => voteOffer(id, isYeah),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      message.success(t('torrent.commentSuccess'))
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('torrent.commentFailed')),
  })

  const columns: ColumnsType<Offer> = [
    {
      title: t('torrent.name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, r: Offer) => (
        <span>
          {name}
          <div style={{ fontSize: 12, color: '#888' }}>{r.description?.slice(0, 100)}</div>
        </span>
      ),
    },
    {
      title: t('torrent.category'),
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (cat: string) => cat ? <Tag>{cat}</Tag> : '-',
    },
    {
      title: t('torrent.status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s: string) => StatusTag(s),
    },
    {
      title: t('nav.offers'),
      key: 'votes',
      width: 120,
      render: (_, r: Offer) => (
        <Space size={4}>
          <Tag color="green">{r.vote_yeah} yeah</Tag>
          <Tag color="red">{r.vote_against} against</Tag>
          {r.status === 'pending' && (
            <>
              <Button size="small" type="link" onClick={() => voteMut.mutate({ id: r.id, isYeah: true })} loading={voteMut.isPending}>
                Yeah
              </Button>
              <Button size="small" type="link" danger onClick={() => voteMut.mutate({ id: r.id, isYeah: false })} loading={voteMut.isPending}>
                Against
              </Button>
            </>
          )}
          <Button size="small" type="link" onClick={() => setVotesOpen(r.id)}>{t('nav.offers')}</Button>
        </Space>
      ),
    },
    {
      title: t('torrent.uploader'),
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: t('torrent.created'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (d: string) => dayjs(d).fromNow(),
    },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Title level={3} style={{ margin: 0 }}>{t('nav.offers')}</Title>
        <Space>
          <Select
            placeholder={t('torrent.status')}
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
          <Input.Search placeholder={t('torrent.searchPlaceholder')} onSearch={setKeyword} allowClear style={{ width: 250 }} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>{t('nav.offers')} +</Button>
        </Space>
      </Space>

      <Table columns={columns} dataSource={data?.offers} rowKey="id" loading={isLoading} size="small"
        pagination={{ current: page, pageSize: 20, total: data?.total, onChange: setPage, showTotal: (total) => t('torrent.totalTorrents', { count: total }) }}
      />

      <Modal title={t('nav.offers')} open={createOpen} onCancel={() => setCreateOpen(false)}
        footer={null} destroyOnClose>
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input placeholder={t('torrent.name')} id="offer-name" />
            <Select placeholder={t('torrent.categoryPlaceholder')} allowClear style={{ width: '100%' }}
              options={[
                { value: 'movie', label: t('categories.movies') },
                { value: 'tv', label: t('categories.tv') },
                { value: 'music', label: t('categories.music') },
                { value: 'software', label: t('categories.software') },
              ]}
            />
            <TextArea rows={4} placeholder={t('torrent.description')} id="offer-desc" />
            <Button type="primary" block onClick={() => {
              const name = (document.getElementById('offer-name') as HTMLInputElement)?.value
              const desc = (document.getElementById('offer-desc') as HTMLTextAreaElement)?.value
              const cat = document.querySelector('.ant-select-focused')?.previousElementSibling?.textContent || undefined
              if (!name) { message.error(t('torrent.name') + ' is required'); return }
              createMut.mutate({ name, description: desc, category: cat })
            }} loading={createMut.isPending}>
              {t('submit')}
            </Button>
          </Space>
        </Card>
      </Modal>

      <Modal title={t('nav.offers')} open={!!votesOpen} onCancel={() => setVotesOpen(null)} footer={null}>
        {votes?.map((v: OfferVote) => (
          <div key={v.id} style={{ padding: '4px 0' }}>
            <Tag color={v.is_yeah ? 'green' : 'red'}>{v.is_yeah ? 'Yeah' : 'Against'}</Tag>
            <Text>{v.username}</Text>
            <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>{dayjs(v.created_at).fromNow()}</Text>
          </div>
        ))}
        {(!votes || votes.length === 0) && <Text type="secondary">{t('torrent.noComments')}</Text>}
      </Modal>
    </div>
  )
}
