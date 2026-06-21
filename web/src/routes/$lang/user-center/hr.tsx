import { createFileRoute } from '@tanstack/react-router'
import { HR } from '../../../pages/HR'
import { listHR } from '../../../api/hr'

export const Route = createFileRoute('/$lang/user-center/hr')({
  staticData: {
    title: 'user:menu.hr',
    menuCode: 'user-hr',
    menuSort: 100,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['hr'],
      queryFn: () => listHR(),
    })
  },
  component: HR,
})
