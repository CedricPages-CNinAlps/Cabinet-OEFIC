<template>
  <section class="logo-slider section" :style="sectionBg">
    <div class="container">
      <div v-if="slider.eyebrow || slider.title || slider.subtitle" v-reveal class="section-header logo-slider__head">
        <span v-if="slider.eyebrow" class="eyebrow">{{ slider.eyebrow }}</span>
        <h2 v-if="slider.title">{{ slider.title }}</h2>
        <div v-if="slider.title" class="divider-gold"></div>
        <p v-if="slider.subtitle">{{ slider.subtitle }}</p>
      </div>

      <div
        class="logo-slider__viewport"
        :class="{ 'logo-slider__viewport--grayscale': slider.grayscale }"
        @mouseenter="paused = true"
        @mouseleave="paused = false"
        @focusin="paused = true"
        @focusout="paused = false"
      >
        <div
          ref="trackRef"
          class="logo-slider__track"
          :class="{ 'logo-slider__track--continuous': slider.mode !== 'step' }"
          :style="trackStyle"
          @transitionend="onStepEnd"
        >
          <!-- Deux groupes identiques : le second prend le relais pour une boucle sans saut -->
          <ul v-for="copy in 2" :key="copy" class="logo-slider__group" :aria-hidden="copy === 2">
            <li v-for="(logo, i) in items" :key="`${logo.id}-${i}`" class="logo-slider__item">
              <a
                v-if="logo.link"
                :href="logo.link"
                target="_blank"
                rel="noopener"
                :tabindex="copy === 2 ? -1 : undefined"
              >
                <img :src="resolveMediaUrl(logo.url)" :alt="logo.name" loading="lazy" />
              </a>
              <img v-else :src="resolveMediaUrl(logo.url)" :alt="logo.name" loading="lazy" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { resolveMediaUrl } from '@/utils/asset'
import type { LogoItem, LogoSlider } from '@/types'

const props = defineProps<{ slider: LogoSlider }>()

const trackRef = ref<HTMLElement | null>(null)
const paused = ref(false)
const reducedMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const sectionBg = computed(() =>
  props.slider.bgColor ? { backgroundColor: props.slider.bgColor } : {}
)

// Avec peu de logos, on répète la liste pour que la bande remplisse toujours l'écran
const MIN_ITEMS = 10
const items = computed<LogoItem[]>(() => {
  const logos = props.slider.logos
  if (!logos.length) return []
  const times = Math.max(1, Math.ceil(MIN_ITEMS / logos.length))
  return Array.from({ length: times }, () => logos).flat()
})

// ---- Mode « par étapes » : la bande avance d'un logo toutes les N secondes
const STEP_TRANSITION_MS = 700
const stepIndex = ref(0)
const animateStep = ref(true)
const itemW = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function measure() {
  itemW.value = trackRef.value?.querySelector<HTMLElement>('.logo-slider__item')?.offsetWidth ?? 0
}

function resetSteps() {
  animateStep.value = false
  // En sens inverse on part du second groupe (identique) pour pouvoir reculer
  stepIndex.value = props.slider.reverse ? items.value.length : 0
}

function nextStep() {
  if (paused.value) return
  animateStep.value = true
  stepIndex.value += props.slider.reverse ? -1 : 1
}

function onStepEnd(e: TransitionEvent) {
  if (props.slider.mode !== 'step' || e.target !== trackRef.value) return
  const length = items.value.length
  // Bout de la boucle atteint : saut invisible vers la position équivalente
  if (!props.slider.reverse && stepIndex.value >= length) {
    animateStep.value = false
    stepIndex.value = 0
  } else if (props.slider.reverse && stepIndex.value <= 0) {
    animateStep.value = false
    stepIndex.value = length
  }
}

function startTimer() {
  stopTimer()
  resetSteps()
  if (props.slider.mode !== 'step' || reducedMotion) return
  const seconds = Math.max(1, Number(props.slider.interval) || 3)
  timer = setInterval(nextStep, seconds * 1000)
}

function stopTimer() {
  if (timer) clearInterval(timer)
  timer = null
}

const trackStyle = computed(() => {
  if (props.slider.mode === 'step') {
    return {
      transform: `translateX(-${stepIndex.value * itemW.value}px)`,
      transition: animateStep.value ? `transform ${STEP_TRANSITION_MS}ms ease` : 'none'
    }
  }
  return {
    animationDuration: `${Math.max(3, Number(props.slider.speed) || 30)}s`,
    animationDirection: props.slider.reverse ? 'reverse' : 'normal',
    animationPlayState: paused.value ? 'paused' : 'running'
  }
})

watch(() => [props.slider.mode, props.slider.interval, props.slider.reverse, items.value.length], startTimer)

onMounted(() => {
  measure()
  window.addEventListener('resize', measure)
  startTimer()
})
onUnmounted(() => {
  window.removeEventListener('resize', measure)
  stopTimer()
})
</script>

<style scoped>
.logo-slider {
  background: var(--color-bg);
}

.logo-slider__head {
  margin-bottom: 2.5rem;
}

.logo-slider__viewport {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.logo-slider__track {
  display: flex;
  width: max-content;
}

.logo-slider__track--continuous {
  animation: logo-scroll linear infinite;
}

.logo-slider__group {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

.logo-slider__item {
  flex: 0 0 200px;
  width: 200px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
}

.logo-slider__item a {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-slider__item img {
  max-height: 60px;
  max-width: 100%;
  width: auto;
  object-fit: contain;
  transition: filter 0.3s ease, opacity 0.3s ease;
}

.logo-slider__viewport--grayscale img {
  filter: grayscale(1);
  opacity: 0.65;
}

.logo-slider__viewport--grayscale .logo-slider__item:hover img {
  filter: none;
  opacity: 1;
}

@keyframes logo-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .logo-slider__track--continuous {
    animation: none;
  }
  .logo-slider__viewport {
    overflow-x: auto;
  }
}

@media (max-width: 640px) {
  .logo-slider__item {
    flex-basis: 150px;
    width: 150px;
    height: 70px;
    padding: 0 1rem;
  }
  .logo-slider__item img {
    max-height: 46px;
  }
}
</style>
