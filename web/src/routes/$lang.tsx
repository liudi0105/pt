import { createFileRoute, Outlet, redirect, useParams } from '@tanstack/react-router'
import { useEffect } from 'react'
import i18n from '../i18n'
import { normalizeLang } from '../utils/lang'

export const Route = createFileRoute('/$lang')({
  beforeLoad: ({ params }) => {
    const lang = normalizeLang(params.lang)
    if (!lang) {
      throw redirect({ to: '/$lang', params: { lang: 'zh' }, replace: true })
    }
  },
  component: LangLayout,
})

function LangLayout() {
  const { lang: rawLang } = useParams({ from: '/$lang' })
  const lang = normalizeLang(rawLang) ?? 'zh'

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
    document.cookie = `lang=${lang};path=/;max-age=31536000`
  }, [lang])

  return <Outlet />
}
