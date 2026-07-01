<template>
  <section class="hero" :style="heroBg">
    <!-- Particules animées -->
    <div class="hero__particles" aria-hidden="true">
      <span
        v-for="i in 20"
        :key="i"
        class="hero__particle"
        :style="particleStyle(i)"
      ></span>
    </div>

    <!-- Contenu hero -->
    <div class="hero__content" ref="contentRef">
      <!-- Logo à gauche -->
      <div class="hero__logo" ref="logoRef">
        <img
          :src="config?.logoUrl || '/assets/logo.png'"
          :alt="config?.siteName || 'Cabinet OEFIC'"
        />
      </div>

      <!-- Card glass morphism -->
      <div class="hero__glass" ref="glassRef">
        <div class="hero__badge">
          <span>Depuis 1984</span>
        </div>

        <h1 class="hero__title" v-html="formattedTitle"></h1>

        <div class="hero__divider"></div>

        <p class="hero__subtitle">{{ hero?.subtitle }}</p>

        <div class="hero__actions">
          <a
            :href="hero?.cta1Link || '#contact'"
            class="btn btn-primary hero__btn"
          >
            {{ hero?.cta1Text || 'Prendre rendez-vous' }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a
            :href="hero?.cta2Link || '#services'"
            class="btn btn-outline-white hero__btn"
          >
            {{ hero?.cta2Text || 'Nos services' }}
          </a>
        </div>

        <!-- Stats rapides -->
        <div class="hero__quick-stats">
          <div class="hero__quick-stat">
            <strong>40</strong><span>ans</span>
          </div>
          <div class="hero__quick-stat-divider"></div>
          <div class="hero__quick-stat">
            <strong>500+</strong><span>clients</span>
          </div>
          <div class="hero__quick-stat-divider"></div>
          <div class="hero__quick-stat">
            <strong>5</strong><span>expertises</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Scroll indicator -->
    <div class="hero__scroll" ref="scrollRef">
      <span>Découvrir</span>
      <div class="hero__scroll-line"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSiteConfigStore } from '@/stores/siteConfig'
import { gsap } from 'gsap'

const { config, content } = storeToRefs(useSiteConfigStore())
const hero = computed(() => content.value?.hero)

const contentRef = ref<HTMLElement | null>(null)
const logoRef = ref<HTMLElement | null>(null)
const glassRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)

const heroBg = computed(() => {
  const bg = hero.value?.bgColor
  if (bg) return { backgroundColor: bg }
  return {}
})

const formattedTitle = computed(() => {
  const title = hero.value?.title || '40 ans d\'expertise\nau service de votre patrimoine'
  return title.replace(/\n/g, '<br/>')
})

function particleStyle(i: number) {
  const size = 4 + (i % 8) * 3
  const delay = (i * 0.4) % 8
  const duration = 6 + (i % 5) * 2
  const left = (i * 17 + 5) % 90
  const top = (i * 13 + 10) % 80
  const opacity = 0.1 + (i % 5) * 0.06
  const isGold = i % 3 === 0

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    opacity,
    background: isGold ? 'var(--color-gold)' : 'rgba(255,255,255,0.6)',
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    borderRadius: i % 4 === 0 ? '50%' : i % 4 === 1 ? '2px' : '50%'
  }
}

let tl: gsap.core.Timeline | null = null

onMounted(() => {
  if (!contentRef.value) return

  // Timeline GSAP d'entrée
  tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.fromTo(
    logoRef.value,
    { opacity: 0, x: -50, scale: 0.9 },
    { opacity: 1, x: 0, scale: 1, duration: 0.9 }
  )
  .fromTo(
    glassRef.value,
    { opacity: 0, x: 50, scale: 0.96 },
    { opacity: 1, x: 0, scale: 1, duration: 1 },
    '-=0.6'
  )
  .fromTo(
    scrollRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6 },
    '-=0.3'
  )
})

onUnmounted(() => {
  tl?.kill()
})
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1e1a34 0%, #2d2850 45%, #1a2b4a 100%);
}

/* ===========================
   Particules
   =========================== */
.hero__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero__particle {
  position: absolute;
  border-radius: 50%;
  animation: float linear infinite;
}

/* ===========================
   Contenu principal
   =========================== */
.hero__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4rem;
  width: 100%;
  padding: 6rem 4rem 4rem;
}

/* Logo à gauche */
.hero__logo {
  flex: 1 1 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero__logo img {
  height: 440px;
  width: auto;
  max-width: 100%;
  object-fit: contain;
  filter: brightness(0) invert(1) drop-shadow(0 4px 24px rgba(201, 168, 76, 0.35));
}

/* Glass card */
.hero__glass {
  flex: 1 1 50%;
  min-width: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(201, 168, 76, 0.3);
  border-radius: 24px;
  padding: 3rem 3.5rem;
  text-align: center;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Badge */
.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(201, 168, 76, 0.2);
  border: 1px solid rgba(201, 168, 76, 0.4);
  border-radius: 100px;
  padding: 0.375rem 1rem;
  margin-bottom: 1.75rem;
}

.hero__badge span {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-gold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Titre */
.hero__title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 0;
}

/* Divider */
.hero__divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, var(--color-gold), var(--color-gold-dark));
  border-radius: 2px;
  margin: 1.5rem auto;
}

/* Sous-titre */
.hero__subtitle {
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.75;
  max-width: 560px;
  margin: 0 auto 2.5rem;
}

/* CTA */
.hero__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}

.hero__btn {
  min-width: 200px;
  justify-content: center;
}

/* Quick stats */
.hero__quick-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.hero__quick-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.hero__quick-stat strong {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-gold);
}

.hero__quick-stat span {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hero__quick-stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.15);
}

/* Scroll indicator */
.hero__scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero__scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent);
  animation: pulse 2s ease infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* ===========================
   Responsive
   =========================== */
@media (max-width: 900px) {
  .hero__content {
    flex-direction: column;
    padding-top: 5rem;
    padding-bottom: 5rem;
    gap: 2.5rem;
    max-width: 600px;
  }

  .hero__logo img {
    height: 140px;
  }
}

@media (max-width: 768px) {
  .hero__content {
    padding-top: 4rem;
  }

  .hero__glass {
    padding: 2rem 1.5rem;
  }

  .hero__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .hero__btn {
    min-width: unset;
  }

  .hero__quick-stats {
    gap: 1.25rem;
  }

  .hero__quick-stat strong {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .hero__logo img {
    height: 110px;
  }

  .hero__quick-stats {
    flex-direction: column;
    gap: 1rem;
    padding-top: 1.25rem;
  }

  .hero__quick-stat-divider {
    display: none;
  }
}
</style>
