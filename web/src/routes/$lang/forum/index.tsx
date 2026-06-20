import { createFileRoute } from '@tanstack/react-router'
import { Forum } from '../../../pages/Forum'

export const Route = createFileRoute('/$lang/forum/')({
  validateSearch: (search: Record<string, string>) => ({
    forumId: search.forumId as string | undefined,
  }),
  component: Forum,
})
