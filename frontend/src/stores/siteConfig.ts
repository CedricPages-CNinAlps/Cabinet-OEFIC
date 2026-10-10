import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import type { SiteConfig, SiteContent, SeoConfig, TrackingConfig } from '@/types'
import fallbackConfig from '@/data/config.json'
import fallbackContent from '@/data/content.json'
import fallbackSeo from '@/data/seo.json'
import fallbackTracking from '@/data/tracking.json'

export const useSiteConfigStore = defineStore('siteConfig', () => {
  const api = useApi()

  const config = ref<SiteConfig | null>(null)
  const content = ref<SiteContent | null>(null)
  const seo = ref<SeoConfig | null>(null)
  const tracking = ref<TrackingConfig | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ---------------------------------------------------------------------------
  // Variables utilisables dans tous les textes : {annee_creation}, {nom_cabinet}…
  // Une information saisie une seule fois (Configuration / Expertises) est ainsi
  // reprise partout où elle apparaît.
  // ---------------------------------------------------------------------------
  const textVars = computed<Record<string, string>>(() => {
    const cfg = config.value
    const legal = cfg?.legalInfo
    return {
      nom_cabinet: cfg?.siteName ?? '',
      annee_creation: cfg?.foundingYear ?? '',
      anciennete: cfg?.yearsOfExpertise ?? '',
      nb_expertises: String((content.value?.services ?? []).filter(s => s.visible).length),
      annee_courante: String(new Date().getFullYear()),
      telephone: legal?.phone ?? '',
      email: legal?.email ?? '',
      ville: legal?.city ?? ''
    }
  })

  function fillText(text: string): string {
    return text.replace(/\{(\w+)\}/g, (match, key: string) =>
      key in textVars.value ? textVars.value[key] : match
    )
  }

  function fillDeep<T>(value: T): T {
    if (typeof value === 'string') return fillText(value) as T
    if (Array.isArray(value)) return value.map(v => fillDeep(v)) as T
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, fillDeep(v)])
      ) as T
    }
    return value
  }

  /** Configuration telle qu'affichée sur le site (variables remplacées) */
  const displayConfig = computed<SiteConfig | null>(() =>
    config.value ? fillDeep(config.value) : null
  )

  /** Contenu tel qu'affiché sur le site (variables et chiffres automatiques résolus) */
  const displayContent = computed<SiteContent | null>(() => {
    if (!content.value) return null
    const c = fillDeep(content.value)
    c.stats.stats = c.stats.stats.map(stat => {
      if (stat.source === 'anciennete') {
        return { ...stat, value: Number(textVars.value.anciennete) || stat.value }
      }
      if (stat.source === 'nb_expertises') {
        return { ...stat, value: Number(textVars.value.nb_expertises) }
      }
      return stat
    })
    return c
  })

  async function loadAll() {
    loading.value = true
    error.value = null
    try {
      const [cfg, cnt, seoData, trackData] = await Promise.all([
        api.get<SiteConfig>('/config'),
        api.get<SiteContent>('/content'),
        api.get<SeoConfig>('/config/seo'),
        api.get<TrackingConfig>('/config/tracking')
      ])
      config.value = cfg
      content.value = cnt
      seo.value = seoData
      tracking.value = trackData
      applyColorVars(cfg)
      applyFonts(cfg)
      applySeo(seoData)
    } catch (e) {
      // No backend reachable (e.g. static hosting on GitHub Pages) — fall back to the
      // last known content baked into the build at deploy time.
      config.value = fallbackConfig as SiteConfig
      content.value = fallbackContent as unknown as SiteContent
      seo.value = fallbackSeo as SeoConfig
      tracking.value = fallbackTracking as TrackingConfig
      applyColorVars(config.value)
      applyFonts(config.value)
      applySeo(seo.value)
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  function applyColorVars(cfg: SiteConfig) {
    const root = document.documentElement
    root.style.setProperty('--color-bg', cfg.colors.bg)
    root.style.setProperty('--color-bg-soft', cfg.colors.bgSoft)
    root.style.setProperty('--color-text', cfg.colors.text)
    root.style.setProperty('--color-gold', cfg.colors.gold)
    root.style.setProperty('--color-gold-dark', cfg.colors.goldDark)
  }

  function applySeo(data: SeoConfig) {
    if (data.title) document.title = fillText(data.title)
    const setMeta = (name: string, value: string) => {
      if (!value) return
      document.querySelector(`meta[name="${name}"]`)?.setAttribute('content', value)
    }
    setMeta('description', fillText(data.description))
    setMeta('keywords', fillText(data.keywords))
  }

  function applyFonts(cfg: SiteConfig) {
    const weights = cfg.fonts.weights.join(';')
    const headingParam = cfg.fonts.heading.replace(/\s+/g, '+')
    const bodyParam = cfg.fonts.body.replace(/\s+/g, '+')

    const existingLink = document.getElementById('google-fonts-link')
    if (existingLink) existingLink.remove()

    const link = document.createElement('link')
    link.id = 'google-fonts-link'
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${headingParam}:wght@${weights}&family=${bodyParam}:wght@${weights}&display=swap`
    document.head.appendChild(link)

    document.documentElement.style.setProperty('--font-heading', `'${cfg.fonts.heading}', serif`)
    document.documentElement.style.setProperty('--font-body', `'${cfg.fonts.body}', sans-serif`)
  }

  async function updateConfig(data: Partial<SiteConfig>) {
    if (!config.value) return
    const updated = await api.put<SiteConfig>('/config', { ...config.value, ...data })
    config.value = updated
    applyColorVars(updated)
    applyFonts(updated)
  }

  async function updateContent(data: Partial<SiteContent>) {
    if (!content.value) return
    const updated = await api.put<SiteContent>('/content', { ...content.value, ...data })
    content.value = updated
  }

  async function updateSeo(data: Partial<SeoConfig>) {
    if (!seo.value) return
    const updated = await api.put<SeoConfig>('/config/seo', { ...seo.value, ...data })
    seo.value = updated
    applySeo(updated)
  }

  async function updateTracking(data: Partial<TrackingConfig>) {
    if (!tracking.value) return
    const updated = await api.put<TrackingConfig>('/config/tracking', { ...tracking.value, ...data })
    tracking.value = updated
  }

  return {
    config,
    content,
    seo,
    tracking,
    displayConfig,
    displayContent,
    textVars,
    fillText,
    loading,
    error,
    loadAll,
    updateConfig,
    updateContent,
    updateSeo,
    updateTracking
  }
})
