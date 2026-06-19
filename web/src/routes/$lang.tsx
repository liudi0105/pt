import { createFileRoute, Outlet, useParams } from '@tanstack/react-router'
import { useEffect } from 'react'
import i18n from '../i18n'

export const Route = createFileRoute('/$lang')({
  beforeLoad: ({ params }) => {
    const lang = params.lang
    if (lang !== 'zh' && lang !== 'en') {
      throw new Error('Invalid language')
    }
  },
  component: LangLayout,
})

function LangLayout() {
  const { lang } = useParams({ from: '/$lang' })

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
    document.cookie = `lang=${lang};path=/;max-age=31536000`
  }, [lang])

  return <Outlet />
}
