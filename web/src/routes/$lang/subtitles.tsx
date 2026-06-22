import { createFileRoute } from '@tanstack/react-router'
import { Subtitles } from '../../pages/Subtitles'
import { listSubtitles } from '../../api/subtitle'

export const Route = createFileRoute('/$lang/subtitles')({
  staticData: {
    title: 'common:nav.subtitles',
    menuCode: 'subtitles',
    menuIcon: 'FileTextOutlined',
    menuSort: 12,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['subtitles', { page: 1, page_size: 50 }],
      queryFn: () => listSubtitles({ page: 1, page_size: 50 }),
    })
  },
  component: Subtitles,
})
