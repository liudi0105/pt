import { createFileRoute } from '@tanstack/react-router'
import { AnnouncementManage } from '../../../pages/admin/AnnouncementManage'
import { listAnnouncements } from '../../../api/admin'

export const Route = createFileRoute('/$lang/admin/announcements')({
  staticData: {
    title: 'admin:menu.announcements',
    menuCode: 'announcements',
    menuSort: 70,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['admin', 'announcements'],
      queryFn: () => listAnnouncements(),
    })
  },
  component: AnnouncementManage,
})
