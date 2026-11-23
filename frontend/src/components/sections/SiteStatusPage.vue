<template>
  <section v-milk class="site-status" role="main">
    <div class="site-status__card" v-reveal>
      <img
        class="site-status__logo"
        :src="resolveAssetUrl(config?.logoUrl || '/assets/logo.png')"
        :alt="config?.siteName || 'Cabinet OEFIC'"
      />

      <div class="site-status__icon" aria-hidden="true">
        <!-- Maintenance : clé ; reconstruction : chantier -->
        <svg v-if="mode === 'maintenance'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7M7 14v7M17 3v3M7 3v3M10 14L2.3 6.3M14 6l7.7 7.7M8 6l8 8"/></svg>
      </div>

      <h1 class="site-status__title">{{ text?.title }}</h1>
      <div class="site-status__divider"></div>
      <p class="site-status__message">{{ text?.message }}</p>

      <div class="site-status__actions">
        <a v-if="config?.legalInfo.phone" :href="telHref(config.legalInfo.phone)" class="btn btn-primary">
          {{ config.legalInfo.phone }}
        </a>
        <a v-if="config?.legalInfo.email" :href="`mailto:${config.legalInfo.email}`" class="btn btn-outline-white">
          {{ config.legalInfo.email }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSiteConfigStore } from '@/stores/siteConfig'
import { resolveAssetUrl } from '@/utils/asset'
import { telHref } from '@/utils/contact'

const props = defineProps<{ mode: 'maintenance' | 'construction' }>()

const { displayConfig: config, displayContent: content } = storeToRefs(useSiteConfigStore())
const text = computed(() => content.value?.siteStatus?.[props.mode])
</script>

<style scoped>
.site-status {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  background: linear-gradient(135deg, #1e1a34 0%, #2d2850 45%, #1a2b4a 100%);
}

.site-status__card {
  width: 100%;
  max-width: 640px;
  text-align: center;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(201, 168, 76, 0.3);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.site-status__logo {
  height: 110px;
  width: auto;
  margin: 0 auto 2rem;
  filter: brightness(0) invert(1) drop-shadow(0 4px 24px rgba(201, 168, 76, 0.35));
}

.site-status__icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 1.25rem;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--color-gold);
  background: rgba(201, 168, 76, 0.15);
  border: 1px solid rgba(201, 168, 76, 0.4);
}

.site-status__icon svg {
  width: 26px;
  height: 26px;
}

.site-status__title {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  color: #fff;
  line-height: 1.2;
}

.site-status__divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, var(--color-gold), var(--color-gold-dark));
  border-radius: 2px;
  margin: 1.5rem auto;
}

.site-status__message {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.75;
  white-space: pre-line;
  margin-bottom: 2rem;
}

.site-status__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .site-status__card {
    padding: 2rem 1.25rem;
  }
  .site-status__actions {
    flex-direction: column;
  }
  .site-status__actions .btn {
    justify-content: center;
    white-space: normal;
  }
}
</style>
