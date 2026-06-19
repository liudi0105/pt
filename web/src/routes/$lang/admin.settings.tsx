import { createFileRoute } from '@tanstack/react-router'
import { SiteSettings } from '../../pages/admin/SiteSettings'

export const Route = createFileRoute('/$lang/admin/settings')({
  staticData: {
    title: 'admin:menu.settings',
    menuCode: 'settings',
  },
  component: SiteSettings,
})
