import { createFileRoute } from '@tanstack/react-router'
import Bookmarks from '../../../pages/user-center/Bookmarks'

export const Route = createFileRoute('/$lang/user-center/bookmarks')({
  staticData: {
    title: 'user:menu.bookmarks',
    menuCode: 'user-bookmarks',
    menuSort: 40,
  },
  component: Bookmarks,
})
