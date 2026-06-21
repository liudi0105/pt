import { createFileRoute } from '@tanstack/react-router'
import { Col, Card, Row, Skeleton, Space } from 'antd'
import { Forum } from '../../../pages/Forum'
import { listForums, listForumTopics, listRecentTopics } from '../../../api/forum'

export const Route = createFileRoute('/$lang/forum/')({
  validateSearch: (search: Record<string, string>) => ({
    forumId: search.forumId as string | undefined,
    page: search.page ? Number(search.page) : undefined,
  }),
  loader: async ({ context: { queryClient }, location }) => {
    const usp = new URLSearchParams(location.searchStr)
    const forumId = usp.get('forumId')
    const page = Number(usp.get('page')) || 1
    const validForumId = forumId && !isNaN(Number(forumId)) ? forumId : null
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['forums'],
        queryFn: () => listForums(),
        staleTime: 5 * 60 * 1000,
      }),
      (validForumId
        ? queryClient.ensureQueryData({
            queryKey: ['forum-topics', validForumId, page],
            queryFn: () => listForumTopics(Number(validForumId), { page, page_size: 20 }),
          })
        : queryClient.ensureQueryData({
            queryKey: ['forum-recent', page],
            queryFn: () => listRecentTopics({ page, page_size: 20 }),
          })
      ),
    ])
  },
  wrapInSuspense: true,
  pendingComponent: () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card><Skeleton active /></Card>
      <Row gutter={24}>
        <Col xs={24} lg={7}>
          <Card><Skeleton active paragraph={{ rows: 6 }} /></Card>
        </Col>
        <Col xs={24} lg={17}>
          <Card><Skeleton active paragraph={{ rows: 8 }} /></Card>
        </Col>
      </Row>
    </Space>
  ),
  component: Forum,
})
