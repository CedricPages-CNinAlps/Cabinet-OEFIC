<template>
  <section v-milk class="site-status" role="main">
    <div class="site-status__inner" v-reveal>
      <img
        class="site-status__logo"
        :src="resolveAssetUrl(config?.logoUrl || '/assets/logo.png')"
        :alt="config?.siteName || 'Cabinet OEFIC'"
      />
      <h1 v-if="text?.title" class="site-status__title">{{ text.title }}</h1>
      <div class="site-status__divider"></div>
      <p v-if="text?.message" class="site-status__message">{{ text.message }}</p>
    </div>
    <SiteFooter legal-only class="site-status__legal" />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSiteConfigStore } from '@/stores/siteConfig'
import { resolveAssetUrl } from '@/utils/asset'
import SiteFooter from '@/components/layout/SiteFooter.vue'

const props = defineProps<{ mode: 'maintenance' | 'construction' }>()

const { displayConfig: config, displayContent: content } = storeToRefs(useSiteConfigStore())
const text = computed(() => content.value?.siteStatus?.[props.mode])
</script>

<style scoped>
/* Tient dans la fenêtre : contenu centré, mentions réglementaires en bas, tailles calées sur la hauteur */
.site-status {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(1.5rem, 5vh, 4rem) 0 0;
  background: linear-gradient(135deg, #1e1a34 0%, #2d2850 45%, #1a2b4a 100%);
}

.site-status__inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 0 clamp(1rem, 3vw, 2.5rem);
  text-align: center;
}

.site-status__legal {
  width: 100%;
  margin-top: clamp(1rem, 3vh, 3rem);
}

.site-status__logo {
  display: block;
  height: clamp(90px, 30vh, 280px);
  width: auto;
  max-width: 100%;
  margin: 0 auto clamp(1rem, 4vh, 2.5rem);
  object-fit: contain;
  filter: brightness(0) invert(1) drop-shadow(0 4px 24px rgba(201, 168, 76, 0.35));
}

.site-status__title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4.5vw, 3rem);
  color: #fff;
  line-height: 1.2;
}

.site-status__divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, var(--color-gold), var(--color-gold-dark));
  border-radius: 2px;
  margin: clamp(0.75rem, 2.5vh, 1.5rem) auto;
}

.site-status__message {
  color: rgba(255, 255, 255, 0.85);
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  line-height: 1.75;
  white-space: pre-line;
}

@media (max-width: 640px) {
  .site-status__logo {
    height: clamp(80px, 20vh, 150px);
  }
}
</style>
