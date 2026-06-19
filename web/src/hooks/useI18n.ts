import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { queryI18n } from '../api/i18n'

export function useI18n(prefix: string) {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('zh') ? 'zh' : 'en'

  const { data } = useQuery({
    queryKey: ['i18n', prefix],
    queryFn: () => queryI18n(prefix),
    staleTime: Infinity,
    select: (res) => res.data.entries,
  })

  function getLabel(key: string, field = 'label', fallback = key): string {
    return data?.[`${prefix}.${key}.${field}`]?.[lang] || fallback
  }

  return { data, getLabel, lang }
}
