import { useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { queryI18nBatch } from '../api/i18n'

type I18nEntries = Record<string, Record<string, string>>
type Lang = 'zh' | 'en'

function resolveLang(language?: string): Lang {
  return language?.startsWith('zh') ? 'zh' : 'en'
}

function cacheKey(fullKey: string, locale: Lang) {
  return ['db-i18n-value', fullKey, locale] as const
}

function seedEntries(queryClient: ReturnType<typeof useQueryClient>, entries: I18nEntries) {
  for (const [fullKey, locales] of Object.entries(entries)) {
    for (const [locale, value] of Object.entries(locales)) {
      if (value !== undefined) {
        queryClient.setQueryData(cacheKey(fullKey, locale as Lang), value)
      }
    }
  }
}

function extractEntityI18n(entries: I18nEntries | undefined, prefix: string, key: string) {
  if (!entries) return undefined
  const fullPrefix = `${prefix}.${key}.`
  const result: Record<string, Record<string, string>> = {}
  for (const [fullKey, locales] of Object.entries(entries)) {
    if (!fullKey.startsWith(fullPrefix)) continue
    const field = fullKey.slice(fullPrefix.length)
    for (const [locale, value] of Object.entries(locales)) {
      if (!result[locale]) result[locale] = {}
      result[locale][field] = value
    }
  }
  return Object.keys(result).length > 0 ? result : undefined
}

export function useDbI18nBatch(prefixes: string[]) {
  const { i18n } = useTranslation()
  const queryClient = useQueryClient()
  const lang = resolveLang(i18n.language)
  const normalizedPrefixes = useMemo(
    () => Array.from(new Set(prefixes.map((prefix) => prefix.trim()).filter(Boolean))).sort(),
    [prefixes],
  )

  const { data: entries } = useQuery({
    queryKey: ['db-i18n', normalizedPrefixes],
    queryFn: () => queryI18nBatch(normalizedPrefixes),
    select: (res) => res.data.entries,
    staleTime: Infinity,
    enabled: normalizedPrefixes.length > 0,
  })

  useEffect(() => {
    if (!entries) return
    seedEntries(queryClient, entries)
  }, [entries, queryClient])

  function getLabel(prefix: string, key: string, field = 'label'): string {
    const fullKey = `${prefix}.${key}.${field}`
    const cached = queryClient.getQueryData<string>(cacheKey(fullKey, lang))
    if (cached !== undefined) return cached
    return entries?.[fullKey]?.[lang] || ''
  }

  function getEntityI18n(prefix: string, key: string) {
    return extractEntityI18n(entries, prefix, key)
  }

  return { entries, getLabel, getEntityI18n, lang }
}

export function useI18n(prefix: string) {
  const batch = useDbI18nBatch([prefix])

  function getLabel(key: string, field = 'label'): string {
    return batch.getLabel(prefix, key, field)
  }

  function getEntityI18n(key: string) {
    return batch.getEntityI18n(prefix, key)
  }

  return { data: batch.entries, getLabel, getEntityI18n, lang: batch.lang }
}
