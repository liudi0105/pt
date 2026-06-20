import { createFileRoute } from '@tanstack/react-router'
import { ForumTopic } from '../../../pages/ForumTopic'

export const Route = createFileRoute('/$lang/forum/topic/$id')({
  staticData: {
    title: 'forum:topicDetail',
    menuCode: 'forum',
  },
  component: ForumTopic,
})
