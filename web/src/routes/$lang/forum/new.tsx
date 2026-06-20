import { createFileRoute } from '@tanstack/react-router'
import { ForumNewTopic } from '../../../pages/ForumNewTopic'

export const Route = createFileRoute('/$lang/forum/new')({
  staticData: {
    title: 'forum:newTopic',
    menuCode: 'forum',
  },
  validateSearch: (search: Record<string, string>) => ({
    forumId: search.forumId as string | undefined,
  }),
  component: ForumNewTopic,
})
