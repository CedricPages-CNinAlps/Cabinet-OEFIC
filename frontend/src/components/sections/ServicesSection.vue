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
  // — Patrimoine & Investissement —
  patrimoine:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
  investissement: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></svg>`,
  placement:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/></svg>`,
  bourse:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="4" height="10" rx="1"/><rect x="10" y="8" width="4" height="6" rx="1"/><rect x="18" y="2" width="4" height="12" rx="1"/><line x1="0" y1="20" x2="24" y2="20"/></svg>`,
  epargne:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2z"/><path d="M3 10h18"/><path d="M7 15h.01M11 15h2"/></svg>`,
  immobilier:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="17"/><line x1="9.5" y1="14.5" x2="14.5" y2="14.5"/></svg>`,
  scpi:           `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 22V9l11-7 11 7v13"/><path d="M9 22V14h6v8"/><path d="M5 10v3M19 10v3"/></svg>`,
  // — Assurance & Prévoyance —
  assurance:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  prevoyance:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
  retraite:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><path d="M16 14l2 2 3-3"/></svg>`,
  sante:          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  // — Banque & Crédit —
  banque:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12,2 2,7 22,7"/></svg>`,
  credit:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  // — Fiscalité & Optimisation —
  fiscalite:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="9" y1="15" x2="15" y2="15"/><line x1="9" y1="11" x2="10" y2="11"/></svg>`,
  defiscalisation:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
  // — Transmission & Entreprise —
  succession:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
  entreprise:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>`,
  fonds:          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
  conseil:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
  audit:          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`,
  // — Divers Finance —
  crypto:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042l-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893L4.52 9.836m7.627 1.22l-.349 1.97M7.815 4.914l6.933 1.217M6.55 11.087l6.932 1.218M5.86 18.047l-1.392-7.896M4.52 9.836L3.127 1.941"/></svg>`,
  philanthropie:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
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

@media (max-width: 960px) {
  .service-card {
    flex: 0 0 calc(50% - 0.75rem);
  }
}

@media (max-width: 640px) {
  .service-card {
    flex: 1 1 100%;
    max-width: 100%;
    min-width: 0;
  }
}
</style>
