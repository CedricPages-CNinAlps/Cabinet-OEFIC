<template>
  <!-- Composant invisible : injecte dynamiquement les scripts Tarte au Citron selon config -->
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSiteConfigStore } from '@/stores/siteConfig'
import type { TrackingConfig } from '@/types'

const { tracking } = storeToRefs(useSiteConfigStore())

function applyTracking(t: TrackingConfig) {
  if (!window.tarteaucitron) return

  const tac = window.tarteaucitron
  const job: string[] = (tac.job = tac.job || [])

  function push(service: string) {
    if (!job.includes(service)) job.push(service)
  }

  if (t.enabledServices.googletagmanager && t.gtmId) {
    tac.user.googletagmanagerId = t.gtmId
    push('googletagmanager')
  }
  if (t.enabledServices.gtag && t.ga4Id) {
    tac.user.gtagUa = t.ga4Id
    tac.user.gtagMore = function () {}
    push('gtag')
  }
  if (t.enabledServices.analytics && t.uaId) {
    tac.user.analyticsUa = t.uaId
    tac.user.analyticsAnonymizeIp = true
    tac.user.analyticsMore = function () {}
    push('analytics')
  }
  if (t.enabledServices.googlemaps && t.googleMapsKey) {
    tac.user.googlemapsKey = t.googleMapsKey
    push('googlemaps')
  }
  if (t.enabledServices.matomotm && t.matomoTagManagerUrl) {
    tac.user.matomotmUrl = t.matomoTagManagerUrl
    push('matomotm')
  }
  if (t.enabledServices.matomo && t.matomoUrl && t.matomoSiteId) {
    tac.user.matomoId = parseInt(t.matomoSiteId) || 1
    push('matomo')
  }
  if (t.enabledServices.facebook) {
    push('facebook')
    push('facebookpost')
  }
  if (t.enabledServices.twitter) {
    push('twitter')
    push('twitterembed')
    push('twittertimeline')
  }
  if (t.enabledServices.tiktok && t.tiktokId) {
    tac.user.tiktokId = t.tiktokId
    tac.user.tiktokMore = function () {}
    push('tiktok')
    push('tiktokvideo')
  }

  // Google Fonts via Tarte au Citron
  const fontStore = useSiteConfigStore()
  const cfg = fontStore.config
  if (cfg) {
    tac.user.googleFonts = `${cfg.fonts.heading}:wght@${cfg.fonts.weights.join(';')}|${cfg.fonts.body}:wght@${cfg.fonts.weights.join(';')}`
    push('googlefonts')
  }
}

onMounted(() => {
  if (tracking.value) applyTracking(tracking.value)
})

watch(tracking, (t) => {
  if (t) applyTracking(t)
}, { deep: true })

declare global {
  interface Window {
    tarteaucitron: {
      job: string[]
      user: Record<string, unknown>
      init: (cfg: Record<string, unknown>) => void
    }
  }
}
</script>
