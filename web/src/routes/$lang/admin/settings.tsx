import { createFileRoute } from '@tanstack/react-router'
import { SiteSettings } from '../../../pages/admin/SiteSettings'

export const Route = createFileRoute('/$lang/admin/settings')({
  staticData: {
    title: 'admin:menu.settings',
    menuCode: 'settings',
    menuSort: 30,
  },
  component: SiteSettings,
})
