import { useState } from 'react'
import { Table, Button, Typography, Space, Modal, Input, message, Drawer, Badge } from 'antd'
import { PlusOutlined, SendOutlined, InboxOutlined, ReadOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listInbox, listOutbox, sendMessage, readMessage, deleteMessage } from '../api/message'
import type { Message as Msg } from '../types'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next'

dayjs.extend(relativeTime)

const { Title, Text } = Typography
const { TextArea } = Input

export function Inbox() {
  const { t } = useTranslation('torrent')
  const { t: tCommon } = useTranslation('common')
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState<'inbox' | 'outbox'>('inbox')
  const [sendOpen, setSendOpen] = useState(false)
  const [viewMsg, setViewMsg] = useState<Msg | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['messages', tab, page],
    queryFn: () => (tab === 'inbox' ? listInbox(page) : listOutbox(page)),
    select: (res) => res.data,
  })

  const sendMut = useMutation({
    mutationFn: (values: { receiver_id: number; subject: string; body: string }) => sendMessage(values.receiver_id, values.subject, values.body),
    onSuccess: () => {
      message.success(t('messageSent'))
      setSendOpen(false)
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('failedToSend')),
  })

  const readMut = useMutation({
    mutationFn: (id: number) => readMessage(id),
    onSuccess: (res) => {
      setViewMsg(res.data)
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
    onError: () => message.error(t('failedToReadMessage')),
  })

  const delMut = useMutation({
    mutationFn: (id: number) => deleteMessage(id),
    onSuccess: () => {
      message.success(tCommon('deleted'))
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
    onError: () => message.error(tCommon('error')),
  })

  const unread = data && 'unread' in data ? (data as any).unread : 0

  const columns: ColumnsType<Msg> = [
    {
      title: t('subject'),
      dataIndex: 'subject',
      key: 'subject',
      render: (subj: string, r: Msg) => (
        <Space>
          {tab === 'inbox' && !r.is_read && <Badge dot><span style={{ fontWeight: 600 }}>{subj}</span></Badge>}
          {tab === 'inbox' && r.is_read && <span>{subj}</span>}
          {tab === 'outbox' && <span>{subj}</span>}
        </Space>
      ),
    },
    {
      title: tab === 'inbox' ? t('from') : t('to'),
      dataIndex: tab === 'inbox' ? 'sender_username' : 'receiver_username',
      key: 'user',
      width: 120,
    },
    {
      title: tCommon('date'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: (d: string) => dayjs(d).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: tCommon('actions'),
      key: 'actions',
      width: 120,
      render: (_, r: Msg) => (
        <Space>
          <Button size="small" icon={<ReadOutlined />} onClick={() => readMut.mutate(r.id)}>{tCommon('view')}</Button>
          <Button size="small" danger onClick={() => delMut.mutate(r.id)}>{tCommon('delete')}</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Space>
          <Title level={3} style={{ margin: 0 }}>
            <Badge count={tab === 'inbox' ? unread : 0} size="small" offset={[6, 0]}>
              <span>{tCommon('nav.messages')}</span>
            </Badge>
          </Title>
          <Button type={tab === 'inbox' ? 'primary' : 'default'} icon={<InboxOutlined />} onClick={() => setTab('inbox')}>{tCommon('nav.inbox')}</Button>
          <Button type={tab === 'outbox' ? 'primary' : 'default'} icon={<SendOutlined />} onClick={() => setTab('outbox')}>{tCommon('nav.outbox')}</Button>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setSendOpen(true)}>{t('newMessage')}</Button>
      </Space>

      <Table columns={columns} dataSource={data?.messages} rowKey="id" loading={isLoading} size="small"
        pagination={{ current: page, pageSize: 20, total: data?.messages?.length, onChange: setPage }}
      />

      <Modal title={t('newMessage')} open={sendOpen} onCancel={() => setSendOpen(false)} footer={null} destroyOnClose>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input placeholder={t('recipientId')} id="msg-receiver" type="number" />
          <Input placeholder={t('subject')} id="msg-subject" />
          <TextArea rows={5} placeholder={t('messageBody')} id="msg-body" />
          <Button type="primary" block onClick={() => {
            const receiver = (document.getElementById('msg-receiver') as HTMLInputElement)?.value
            const subject = (document.getElementById('msg-subject') as HTMLInputElement)?.value
            const body = (document.getElementById('msg-body') as HTMLTextAreaElement)?.value
            if (!receiver || !subject || !body) { message.error(t('allFieldsRequired')); return }
            sendMut.mutate({ receiver_id: Number(receiver), subject, body })
          }} loading={sendMut.isPending}>{tCommon('send')}</Button>
        </Space>
      </Modal>

      <Drawer title={t('message')} open={!!viewMsg} onClose={() => setViewMsg(null)} width={500}>
        {viewMsg && (
          <div>
            <p><Text strong>{t('from')}:</Text> {viewMsg.sender_username || viewMsg.sender_id}</p>
            <p><Text strong>{t('subject')}:</Text> {viewMsg.subject}</p>
            <p><Text strong>{tCommon('date')}:</Text> {dayjs(viewMsg.created_at).format('YYYY-MM-DD HH:mm')}</p>
            <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
              {viewMsg.body}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
