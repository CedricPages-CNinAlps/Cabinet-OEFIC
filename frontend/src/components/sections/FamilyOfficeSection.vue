<template>
  <section v-if="fo" class="family-office section" :style="sectionBg">
    <div class="container">
      <div class="section-header">
        <span class="eyebrow">{{ fo.eyebrow || 'Family Office' }}</span>
        <h2>{{ fo.title }}</h2>
        <div class="divider-gold"></div>
        <p v-for="(para, i) in paragraphs" :key="i" class="family-office__intro">{{ para }}</p>
      </div>

      <!-- Piliers -->
      <div class="family-office__pillars">
        <div v-for="(pillar, i) in fo.pillars" :key="i" class="fo-pillar">
          <span class="fo-pillar__num">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3 class="fo-pillar__title">{{ pillar.title }}</h3>
          <p class="fo-pillar__desc">{{ pillar.description }}</p>
        </div>
      </div>

      <!-- Méthode -->
      <div v-if="fo.steps?.length" class="family-office__method">
        <h3 class="family-office__method-title">{{ fo.stepsTitle || 'Notre méthode' }}</h3>
        <ol class="family-office__steps">
          <li v-for="(step, i) in fo.steps" :key="i" class="fo-step">
            <span class="fo-step__index">{{ i + 1 }}</span>
            <strong class="fo-step__title">{{ step.title }}</strong>
            <span class="fo-step__desc">{{ step.description }}</span>
          </li>
        </ol>
      </div>

      <div v-if="fo.ctaText" class="family-office__cta">
        <a :href="fo.ctaLink || '#contact'" class="btn btn-primary">
          {{ fo.ctaText }}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSiteConfigStore } from '@/stores/siteConfig'

const { displayContent: content } = storeToRefs(useSiteConfigStore())
const fo = computed(() => content.value?.familyOffice)

const sectionBg = computed(() => {
  const bg = fo.value?.bgColor
  return bg ? { backgroundColor: bg } : {}
})

const paragraphs = computed(() =>
  (fo.value?.text || '').split('\n\n').filter(Boolean)
)
</script>

<style scoped>
.family-office {
  background: var(--color-text);
  color: rgba(255, 255, 255, 0.8);
}

.family-office h2,
.family-office h3 {
  color: #fff;
}

.family-office .section-header {
  max-width: 820px;
  margin-left: auto;
  margin-right: auto;
}

.family-office__intro {
  color: rgba(255, 255, 255, 0.75);
}

.family-office__intro + .family-office__intro {
  margin-top: 0.75rem;
}

/* Piliers */
.family-office__pillars {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.fo-pillar {
  border: 1px solid rgba(201, 168, 76, 0.25);
  border-radius: 20px;
  padding: 2rem 1.75rem;
  background: rgba(255, 255, 255, 0.03);
  transition: border-color 0.3s ease, transform 0.3s ease, background 0.3s ease;
}

.fo-pillar:hover {
  border-color: var(--color-gold);
  background: rgba(201, 168, 76, 0.06);
  transform: translateY(-4px);
}

.fo-pillar__num {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--color-gold);
  margin-bottom: 0.75rem;
}

.fo-pillar__title {
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.6rem;
  line-height: 1.3;
}

.fo-pillar__desc {
  font-size: 0.9rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.7);
}

/* Méthode */
.family-office__method {
  margin-top: 4rem;
}

.family-office__method-title {
  text-align: center;
  margin-bottom: 2rem;
}

.family-office__steps {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1.25rem;
  counter-reset: none;
}

.fo-step {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  padding-top: 0.25rem;
}

.fo-step__index {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-gold), var(--color-gold-dark));
  color: #fff;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.fo-step__title {
  color: #fff;
  font-size: 1rem;
}

.fo-step__desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
}

.family-office__cta {
  display: flex;
  justify-content: center;
  margin-top: 3.5rem;
}

@media (max-width: 960px) {
  .family-office__pillars {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .family-office__steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .family-office__pillars,
  .family-office__steps {
    grid-template-columns: 1fr;
  }
}
</style>
