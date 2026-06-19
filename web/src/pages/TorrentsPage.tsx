import { Card, Typography, Space, List, Spin } from 'antd'
import { PushpinFilled } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { listActiveAnnouncements } from '../api/announcements'
import { TorrentList } from './TorrentList'
import type { Announcement } from '../types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next'

dayjs.extend(relativeTime)

const { Text } = Typography

function AnnouncementSection() {
  const { t } = useTranslation('common')
  const { data, isLoading } = useQuery({
    queryKey: ['active-announcements'],
    queryFn: () => listActiveAnnouncements(),
    select: (res) => res.data.announcements,
    staleTime: 1000 * 60 * 5,
  })

  const sorted = [...(data || [])].sort((a, b) => {
    if (a.is_sticky !== b.is_sticky) return a.is_sticky ? -1 : 1
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  if (isLoading) return <Spin />
  if (!sorted.length) return null

  return (
    <Card title={t('announcements.title')} style={{ marginBottom: 24 }}>
      <List
        dataSource={sorted}
        renderItem={(item: Announcement) => (
          <List.Item>
            <div style={{ width: '100%' }}>
              <Space>
                {item.is_sticky && <PushpinFilled style={{ color: '#1677ff' }} />}
                <Text strong>{item.title}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(item.created_at).fromNow()}</Text>
              </Space>
              <div style={{ marginTop: 8 }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content) }} />
            </div>
          </List.Item>
        )}
      />
    </Card>
  )
}

export function TorrentsPage() {
  return (
    <div>
      <AnnouncementSection />
      <TorrentList />
    </div>
  )
}
