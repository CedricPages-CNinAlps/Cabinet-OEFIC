export function resolveAssetUrl(path: string | undefined | null): string {
  if (!path) return ''
  if (/^https?:\/\//.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
