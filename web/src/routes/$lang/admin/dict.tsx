import { createFileRoute } from '@tanstack/react-router'
import { DictManage } from '../../../pages/admin/DictManage'
import { listDictTypes, listDictData } from '../../../api/admin'

export const Route = createFileRoute('/$lang/admin/dict')({
  staticData: {
    title: 'admin:menu.dictionary',
    menuCode: 'dict',
    menuSort: 35,
  },
  validateSearch: (search: Record<string, string>): { type_key?: string } => ({
    type_key: search.type_key || undefined,
  }),
  loader: async ({ context: { queryClient }, location }) => {
    const usp = new URLSearchParams(location.searchStr)
    const typeKey = usp.get('type_key')
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['admin', 'dict-types'],
        queryFn: () => listDictTypes(),
      }),
      typeKey
        ? queryClient.ensureQueryData({
            queryKey: ['admin', 'dict-data', typeKey],
            queryFn: () => listDictData(typeKey),
          })
        : undefined,
    ])
  },
  component: DictManage,
})
