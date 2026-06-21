import type { AppLang } from './lang'

export type DbI18nFields = Record<string, string>
export type DbI18nMap = Record<string, DbI18nFields>
export type LocaleRow<Field extends string = string> = {
  locale: string
} & Record<Field, string>

export const DB_I18N_LOCALE_OPTIONS = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
  { value: 'jp', label: '日本語' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ko', label: '한국어' },
  { value: 'ru', label: 'Русский' },
  { value: 'es', label: 'Español' },
] as const

export const DB_I18N_LOCALES = DB_I18N_LOCALE_OPTIONS.map((option) => option.value) as readonly string[]

export function resolveDbLang(input: string | null | undefined): AppLang {
  return input?.startsWith('zh') ? 'zh' : 'en'
}

export function i18nToRows<Field extends string>(
  i18n: DbI18nMap | undefined,
  fields: readonly Field[],
): Array<LocaleRow<Field>> {
  if (!i18n) return []
  return Object.entries(i18n).map(([locale, values]) => {
    const row = { locale } as LocaleRow<Field>
    for (const field of fields) {
      ;(row as Record<Field, string>)[field] = values[field] || ''
    }
    return row
  })
}

export function rowsToI18n<Field extends string>(
  rows: Array<LocaleRow<Field>>,
  fields: readonly Field[],
): DbI18nMap {
  const result: DbI18nMap = {}
  for (const row of rows) {
    const locale = row.locale.trim()
    if (!locale) continue
    result[locale] = {}
    for (const field of fields) {
      result[locale][field] = row[field] || ''
    }
  }
  return result
}

export function mergeI18nFields(
  base: DbI18nMap | undefined,
  locale: string,
  fields: DbI18nFields,
): DbI18nMap {
  const normalizedLocale = locale.trim()
  if (!normalizedLocale) return { ...(base || {}) }
  return {
    ...(base || {}),
    [normalizedLocale]: {
      ...((base || {})[normalizedLocale] || {}),
      ...fields,
    },
  }
}

export function buildI18nMap(entries: Record<string, DbI18nFields | undefined>): DbI18nMap {
  const result: DbI18nMap = {}
  for (const [locale, fields] of Object.entries(entries)) {
    if (!locale || !fields) continue
    result[locale] = { ...fields }
  }
  return result
}
