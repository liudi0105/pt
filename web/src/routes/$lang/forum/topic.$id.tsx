import { createFileRoute } from '@tanstack/react-router'
import { ForumTopic } from '../../../pages/ForumTopic'
import { getTopic, listTopicPosts } from '../../../api/forum'

export const Route = createFileRoute('/$lang/forum/topic/$id')({
  staticData: {
    title: 'forum:topicDetail',
    menuCode: 'forum',
  },
  loader: async ({ context: { queryClient }, params }) => {
    const id = Number(params.id)
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['forum-topic', id],
        queryFn: () => getTopic(id),
      }),
      queryClient.ensureQueryData({
        queryKey: ['forum-topic-posts', id, 1],
        queryFn: () => listTopicPosts(id, { page: 1, page_size: 20 }),
      }),
    ])
  },
  component: ForumTopic,
})
