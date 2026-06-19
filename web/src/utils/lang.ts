export type AppLang = 'zh' | 'en'

export function normalizeLang(input: string | null | undefined): AppLang | undefined {
  const value = String(input || '').trim().toLowerCase()
  if (value.startsWith('zh')) return 'zh'
  if (value.startsWith('en')) return 'en'
  if (value === 'zh' || value === 'en') return value
  return undefined
}

export function langPath(lang: string, path: string): string {
  const resolvedLang = normalizeLang(lang) ?? 'zh'
  return `/${resolvedLang}${path}`
}
