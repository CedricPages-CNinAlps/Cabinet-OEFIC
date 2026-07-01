<template>
  <section class="stats" :style="sectionStyle" ref="sectionRef">
    <div class="container">
      <div class="stats__grid">
        <div
          v-for="(stat, i) in stats?.stats"
          :key="stat.id"
          class="stat-item"
          ref="statRefs"
        >
          <div class="stat-item__value">
            <span class="stat-item__number" :ref="el => numberRefs[i] = el as HTMLElement">0</span>
            <span class="stat-item__suffix">{{ stat.suffix }}</span>
          </div>
          <div class="stat-item__label">{{ stat.label }}</div>
          <div class="stat-item__bar"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { gsap } from 'gsap'
import { useSiteConfigStore } from '@/stores/siteConfig'

const { content } = storeToRefs(useSiteConfigStore())
const stats = computed(() => content.value?.stats)

const sectionRef = ref<HTMLElement | null>(null)
const numberRefs = ref<HTMLElement[]>([])

const sectionStyle = computed(() => {
  const bg = stats.value?.bgColor || 'var(--color-bg-soft)'
  return { backgroundColor: bg }
})

let observer: IntersectionObserver | null = null
let animated = false

function animateCounters() {
  if (animated) return
  animated = true

  stats.value?.stats.forEach((stat, i) => {
    const el = numberRefs.value[i]
    if (!el) return
    gsap.to({ val: 0 }, {
      val: stat.value,
      duration: 2,
      delay: i * 0.15,
      ease: 'power2.out',
      onUpdate: function () {
        el.textContent = Math.round(this.targets()[0].val).toString()
      }
    })
  })
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) animateCounters()
    },
    { threshold: 0.3 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.stats {
  padding: 5rem 2rem;
}

.stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: var(--container-max);
  margin: 0 auto;
}

.stat-item {
  text-align: center;
  padding: 2.5rem 1.5rem;
  background: var(--color-bg);
  border-radius: 20px;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-item:hover {
  border-color: var(--color-gold);
  transform: translateY(-4px);
  box-shadow: var(--shadow-gold);
}

.stat-item__value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.stat-item__number {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1;
}

.stat-item__suffix {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-gold);
  line-height: 1;
}

.stat-item__label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat-item__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-gold), var(--color-gold-dark));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.stat-item:hover .stat-item__bar {
  transform: scaleX(1);
}

@media (max-width: 900px) {
  .stats__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats__grid {
    grid-template-columns: 1fr;
  }
}
</style>
