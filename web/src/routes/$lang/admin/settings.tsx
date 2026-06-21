import { createFileRoute } from '@tanstack/react-router'
import { SiteSettings } from '../../../pages/admin/SiteSettings'
import { listSiteSettings } from '../../../api/admin'

export const Route = createFileRoute('/$lang/admin/settings')({
  staticData: {
    title: 'admin:menu.settings',
    menuCode: 'settings',
    menuSort: 30,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['admin-settings'],
      queryFn: () => listSiteSettings(),
    })
  },
  component: SiteSettings,
})
