import { createFileRoute } from '@tanstack/react-router'
import { Upload } from '../../pages/Upload'

export const Route = createFileRoute('/$lang/torrents_/upload')({
  staticData: {
    title: '上传种子',
  },
  component: Upload,
})
