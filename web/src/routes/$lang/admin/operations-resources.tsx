import { createFileRoute } from '@tanstack/react-router'
import { OperationsResources } from '../../../pages/admin/OperationsResources'

export const Route = createFileRoute('/$lang/admin/operations-resources')({
  staticData: {
    title: 'admin:menu.resources',
    menuCode: 'resources',
    menuSort: 65,
  },
  component: OperationsResources,
})
