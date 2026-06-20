import { createFileRoute } from '@tanstack/react-router'
import { ClientRiskControl } from '../../../pages/admin/ClientRiskControl'

export const Route = createFileRoute('/$lang/admin/client-risk-control')({
  staticData: {
    title: 'admin:menu.clientRisk',
    menuCode: 'client-risk',
    menuSort: 60,
  },
  component: ClientRiskControl,
})
