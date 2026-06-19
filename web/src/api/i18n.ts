import { api } from './client'

export function queryI18n(prefix: string) {
  return api.get<{ entries: Record<string, Record<string, string>> }>('/i18n', {
    params: { prefix },
  })
}
