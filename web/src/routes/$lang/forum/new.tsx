import { createFileRoute } from '@tanstack/react-router'
import { ForumNewTopic } from '../../../pages/ForumNewTopic'
import { listForums } from '../../../api/forum'

export const Route = createFileRoute('/$lang/forum/new')({
  staticData: {
    title: 'forum:newTopic',
    menuCode: 'forum',
  },
  validateSearch: (search: Record<string, string>) => ({
    forumId: search.forumId as string | undefined,
  }),
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['forums'],
      queryFn: () => listForums(),
      staleTime: 5 * 60 * 1000,
    })
  },
  component: ForumNewTopic,
})
