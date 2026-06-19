import { Card, Typography, Space, Tag, List, Spin } from 'antd'
import { useQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { listNews } from '../api/news'
import { TorrentList } from './TorrentList'
import type { News } from '../types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next'

dayjs.extend(relativeTime)

const { Text } = Typography

function NewsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: () => listNews(),
    select: (res) => res.data.news,
  })

  if (isLoading) return <Spin />
  if (!data?.length) return null

  return (
    <Card title="Announcements" style={{ marginBottom: 24 }}>
      <List
        dataSource={data}
        renderItem={(item: News) => (
          <List.Item>
            <div style={{ width: '100%' }}>
              <Space>
                <Text strong>{item.title}</Text>
                <Tag>{item.username}</Tag>
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

export function Home() {
  return (
    <div>
      <NewsSection />
      <TorrentList />
    </div>
  )
}
