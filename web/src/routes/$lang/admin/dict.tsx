import { createFileRoute } from '@tanstack/react-router'
import { DictManage } from '../../../pages/admin/DictManage'

export const Route = createFileRoute('/$lang/admin/dict')({
  staticData: {
    title: 'admin:menu.dictionary',
    menuCode: 'dict',
    menuSort: 35,
  },
  validateSearch: (search: Record<string, string>): { type_key?: string } => ({
    type_key: search.type_key || undefined,
  }),
  component: DictManage,
})
