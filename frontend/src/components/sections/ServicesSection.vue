<template>
  <section class="services section" :style="sectionBg">
    <div class="container">
      <div class="section-header">
        <span class="eyebrow">Nos domaines d'expertise</span>
        <h2>Des solutions complètes<br />pour votre patrimoine</h2>
        <div class="divider-gold"></div>
        <p>Depuis 40 ans, nous mettons notre expertise à votre service avec une approche indépendante et personnalisée.</p>
      </div>

      <div class="services__grid">
        <a
          v-for="service in visibleServices"
          :key="service.id"
          class="service-card"
          :href="service.link || '#contact'"
          :style="service.bgColor ? { backgroundColor: service.bgColor } : {}"
        >
          <div class="service-card__icon">
            <component :is="iconComponent(service.icon)" />
          </div>
          <h3 class="service-card__title">{{ service.title }}</h3>
          <p class="service-card__desc">{{ service.description }}</p>
          <span class="service-card__cta">
            En savoir plus
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { storeToRefs } from 'pinia'
import { useSiteConfigStore } from '@/stores/siteConfig'

const { content } = storeToRefs(useSiteConfigStore())

const visibleServices = computed(() =>
  (content.value?.services ?? [])
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order)
)

const sectionBg = computed(() => ({}))

const icons: Record<string, string> = {
  patrimoine: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
  investissement: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></svg>`,
  assurance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  banque: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>`,
  fonds: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`
}

function iconComponent(icon: string) {
  const svg = icons[icon] || icons.patrimoine
  return defineComponent({
    render() {
      return h('span', { innerHTML: svg, class: 'icon-svg' })
    }
  })
}
</script>

<style scoped>
.services {
  background: var(--color-bg);
}

.services__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.service-card {
  flex: 0 0 calc(33.333% - 1rem);
  min-width: 280px;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 2.25rem 2rem;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  color: var(--color-text);
}

.service-card:hover {
  border-color: var(--color-gold);
  box-shadow: 0 12px 40px rgba(201, 168, 76, 0.15), 0 4px 16px rgba(30, 26, 52, 0.08);
  transform: translateY(-6px);
}

.service-card__icon {
  width: 56px;
  height: 56px;
  background: var(--color-gold-light, rgba(201, 168, 76, 0.12));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gold);
  flex-shrink: 0;
  transition: background 0.3s ease;
}

.service-card:hover .service-card__icon {
  background: var(--color-gold);
  color: #fff;
}

.service-card__icon :deep(.icon-svg svg) {
  width: 28px;
  height: 28px;
}

.service-card__title {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
}

.service-card__desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  flex: 1;
}

.service-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-gold);
  margin-top: auto;
  transition: gap 0.2s ease;
}

.service-card:hover .service-card__cta {
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .service-card {
    flex: 1 1 100%;
    max-width: 100%;
  }
}
</style>
