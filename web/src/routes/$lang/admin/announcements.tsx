import { createFileRoute } from '@tanstack/react-router'
import { AnnouncementManage } from '../../../pages/admin/AnnouncementManage'

export const Route = createFileRoute('/$lang/admin/announcements')({
  staticData: {
    title: 'admin:menu.announcements',
    menuCode: 'announcements',
    menuSort: 70,
  },
  component: AnnouncementManage,
})
