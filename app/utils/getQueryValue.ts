import type { LocationQuery } from 'vue-router'

export function getQueryValue(query: LocationQuery, key: string): string {
  const entry = query[key]
  return typeof entry === 'string' ? entry : ''
}
