export function resolveAssetUrl(path: string | undefined | null): string {
  if (!path) return ''
  if (/^https?:\/\//.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

/** Fichiers envoyés via le backoffice (/uploads/…) : servis par l'API, hors du chemin de base du site */
export function resolveMediaUrl(path: string | undefined | null): string {
  if (!path) return ''
  if (path.startsWith('/uploads/')) return path
  return resolveAssetUrl(path)
}
