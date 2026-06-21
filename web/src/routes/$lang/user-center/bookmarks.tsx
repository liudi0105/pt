import { createFileRoute } from '@tanstack/react-router'
import Bookmarks from '../../../pages/user-center/Bookmarks'
import { getBookmarks } from '../../../api/user'

export const Route = createFileRoute('/$lang/user-center/bookmarks')({
  staticData: {
    title: 'user:menu.bookmarks',
    menuCode: 'user-bookmarks',
    menuSort: 40,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['bookmarks'],
      queryFn: () => getBookmarks(),
    })
  },
  component: Bookmarks,
})
