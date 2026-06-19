import { createFileRoute } from '@tanstack/react-router'
import { DictManage } from '../../pages/admin/DictManage'

export const Route = createFileRoute('/$lang/admin/dict')({
  staticData: {
    title: 'admin:menu.dictionary',
    menuCode: 'dict',
  },
  validateSearch: (search: Record<string, string>): { type_id?: number } => ({
    type_id: search.type_id ? Number(search.type_id) : undefined,
  }),
  component: DictManage,
})
