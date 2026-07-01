<template>
  <section class="about section section-soft" :style="sectionBg" ref="sectionRef">
    <div class="container">
      <div class="about__grid">
        <!-- Texte -->
        <div class="about__text" ref="textRef">
          <span class="eyebrow">Notre histoire</span>
          <h2>{{ about?.title }}</h2>
          <div class="divider-gold" style="margin: 1.5rem 0"></div>
          <p v-for="(para, i) in paragraphs" :key="i" class="about__para">{{ para }}</p>

          <!-- Timeline -->
          <div class="about__timeline">
            <div
              v-for="(m, i) in about?.milestones"
              :key="i"
              class="about__milestone"
            >
              <div class="about__milestone-year">{{ m.year }}</div>
              <div class="about__milestone-dot"></div>
              <div class="about__milestone-label">{{ m.label }}</div>
            </div>
          </div>
        </div>

        <!-- Image -->
        <div class="about__visual" ref="visualRef">
          <div class="about__img-wrapper">
            <img
              v-if="about?.imageUrl"
              :src="about.imageUrl"
              alt="Cabinet OEFIC"
              class="about__img"
            />
            <div v-else class="about__img-placeholder">
              <div class="about__img-overlay">
                <strong>{{ about?.placeholderTitle || 'Cabinet OEFIC' }}</strong>
                <span>{{ about?.placeholderSubtitle || 'Depuis 1984' }}</span>
              </div>
            </div>
            <!-- Badge flottant -->
            <div class="about__badge">
              <strong>{{ about?.badgeValue || '40' }}</strong>
              <span>{{ about?.badgeLabel || "ans d'expertise" }}</span>
            </div>
          </div>
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
const about = computed(() => content.value?.about)

const sectionRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const visualRef = ref<HTMLElement | null>(null)

const sectionBg = computed(() => {
  const bg = about.value?.bgColor
  return bg ? { backgroundColor: bg } : {}
})

const paragraphs = computed(() =>
  (about.value?.text || '').split('\n\n').filter(Boolean)
)

let observer: IntersectionObserver | null = null

onMounted(() => {
  gsap.set([textRef.value, visualRef.value], { opacity: 0, y: 40 })

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(textRef.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
          gsap.to(visualRef.value, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' })
          observer?.disconnect()
        }
      })
    },
    { threshold: 0.2 }
  )

  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.about__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

/* ===========================
   Texte
   =========================== */
.about__text .eyebrow {
  display: block;
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-gold);
  margin-bottom: 0.75rem;
}

.about__text h2 {
  margin-bottom: 0;
}

.about__para {
  font-family: var(--font-body, 'Inter', sans-serif);
  color: var(--color-text-muted);
  line-height: 1.8;
  margin-bottom: 1rem;
}

/* Timeline */
.about__timeline {
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  border-left: 2px solid var(--color-border);
  padding-left: 1.5rem;
}

.about__milestone {
  position: relative;
  padding: 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.about__milestone-dot {
  position: absolute;
  left: -1.625rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-gold);
  border: 2px solid var(--color-bg-soft);
}

.about__milestone-year {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gold);
  min-width: 50px;
}

.about__milestone-label {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

/* ===========================
   Visuel
   =========================== */
.about__visual {
  display: flex;
  justify-content: center;
}

.about__img-wrapper {
  position: relative;
  width: 100%;
  max-width: 460px;
}

.about__img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: var(--shadow-lg);
}

.about__img-placeholder {
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, var(--color-text) 0%, #2d2850 100%);
  border-radius: 20px;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: flex-end;
  padding: 2rem;
}

.about__img-overlay {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.about__img-overlay strong {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 1.4rem;
  color: #fff;
}

.about__img-overlay span {
  font-size: 0.875rem;
  color: var(--color-gold);
  font-weight: 500;
}

/* Badge flottant */
.about__badge {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--color-gold), var(--color-gold-dark));
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-gold);
  color: #fff;
  animation: float 6s ease-in-out infinite;
}

.about__badge strong {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}

.about__badge span {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 0.6rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.9;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* ===========================
   Responsive
   =========================== */
@media (max-width: 900px) {
  .about__grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .about__visual {
    order: -1;
  }

  .about__img,
  .about__img-placeholder {
    height: 300px;
  }

  .about__badge {
    width: 80px;
    height: 80px;
    top: -10px;
    right: 8px;
  }

  .about__badge strong {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .about__img,
  .about__img-placeholder {
    height: 240px;
  }
}
</style>
