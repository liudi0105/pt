import { createFileRoute } from '@tanstack/react-router'
import BonusLogs from '../../../../pages/user-center/BonusLogs'

export const Route = createFileRoute('/$lang/user-center/bonus/logs')({
  staticData: {
    title: 'user:bonusLogs.title',
    menuCode: 'user-bonus-logs',
    menuSort: 40,
  },
  component: BonusLogs,
})
