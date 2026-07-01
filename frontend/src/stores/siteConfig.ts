import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import type { SiteConfig, SiteContent, SeoConfig, TrackingConfig } from '@/types'

export const useSiteConfigStore = defineStore('siteConfig', () => {
  const api = useApi()

  const config = ref<SiteConfig | null>(null)
  const content = ref<SiteContent | null>(null)
  const seo = ref<SeoConfig | null>(null)
  const tracking = ref<TrackingConfig | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

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
    } catch (e) {
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
    loading,
    error,
    loadAll,
    updateConfig,
    updateContent,
    updateSeo,
    updateTracking
  }
})
