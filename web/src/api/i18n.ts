import { api } from './client'

export function queryI18n(prefix: string) {
  return api.get<{ entries: Record<string, Record<string, string>> }>('/i18n', {
    params: { prefix },
  })
}

export function queryI18nBatch(prefixes: string[]) {
  return api.get<{ entries: Record<string, Record<string, string>> }>('/i18n/batch', {
    params: { prefixes: prefixes.join(',') },
  })
}
