import { createFileRoute } from '@tanstack/react-router'
import { UserManage } from '../../../pages/admin/UserManage'
import { adminListUsers } from '../../../api/admin'

export interface UserManageSearchParams {
  page: number
  page_size: number
  keyword?: string
  role?: string
  status?: number
}

function parseSearch(search: Record<string, string>): UserManageSearchParams {
  return {
    page: search.page ? Number(search.page) : 1,
    page_size: search.page_size ? Number(search.page_size) : 20,
    keyword: search.keyword || undefined,
    role: search.role || undefined,
    status: search.status !== undefined ? Number(search.status) : undefined,
  }
}

export const Route = createFileRoute('/$lang/admin/users')({
  staticData: {
    title: 'admin:menu.users',
    menuCode: 'users',
    menuSort: 20,
  },
  validateSearch: (search: Record<string, string>): UserManageSearchParams => parseSearch(search),
  loader: async ({ context: { queryClient }, location }) => {
    const usp = new URLSearchParams(location.searchStr)
    const search = parseSearch(Object.fromEntries(usp.entries()))
    await queryClient.ensureQueryData({
      queryKey: ['admin', 'users', search.page, search.page_size, search.keyword ?? '', search.role ?? '', search.status ?? 'all'],
      queryFn: () => adminListUsers({
        page: search.page,
        page_size: search.page_size,
        keyword: search.keyword,
        role: search.role,
        status: search.status,
      }),
    })
  },
  component: UserManage,
})
