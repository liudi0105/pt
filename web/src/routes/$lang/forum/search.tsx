import { createFileRoute } from '@tanstack/react-router'
import { ForumSearch } from '../../../pages/ForumSearch'

export const Route = createFileRoute('/$lang/forum/search')({
  staticData: {
    title: 'forum:search',
    menuCode: 'forum',
  },
  component: ForumSearch,
})
