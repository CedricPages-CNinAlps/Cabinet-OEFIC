<template>
  <div class="font-picker">
    <label class="font-picker__label">{{ label }}</label>

    <!-- Affichage de la police sélectionnée -->
    <div class="font-picker__selected" @click="toggleOpen">
      <span class="font-picker__preview-text" :style="selectedStyle">
        {{ modelValue || 'Choisir une police' }}
      </span>
      <span class="font-picker__arrow" :class="{ 'font-picker__arrow--open': isOpen }">▾</span>
    </div>

    <!-- Dropdown -->
    <div v-if="isOpen" class="font-picker__dropdown">
      <!-- Recherche -->
      <div class="font-picker__search-wrap">
        <svg class="font-picker__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          ref="searchInput"
          v-model="search"
          type="text"
          class="font-picker__search"
          placeholder="Rechercher une police..."
          @click.stop
        />
      </div>

      <!-- Catégories -->
      <div class="font-picker__categories">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="font-picker__cat-btn"
          :class="{ 'font-picker__cat-btn--active': activeCategory === cat.id }"
          @click.stop="activeCategory = cat.id"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Texte de prévisualisation -->
      <div class="font-picker__preview-bar">
        <span>Aperçu :</span>
        <input
          v-model="previewText"
          type="text"
          class="font-picker__preview-input"
          placeholder="Cabinet OEFIC"
          @click.stop
        />
      </div>

      <!-- Liste des polices -->
      <div class="font-picker__list" ref="listRef">
        <div
          v-for="font in filteredFonts"
          :key="font.family"
          class="font-picker__item"
          :class="{ 'font-picker__item--selected': font.family === modelValue }"
          @click.stop="selectFont(font.family)"
          :ref="el => observeFont(el as HTMLElement, font.family)"
        >
          <div class="font-picker__item-name">{{ font.family }}</div>
          <div
            class="font-picker__item-preview"
            :style="fontLoaded(font.family) ? { fontFamily: `'${font.family}', ${font.category}` } : {}"
          >
            {{ previewText || 'Cabinet OEFIC — Expertise & Patrimoine' }}
          </div>
          <div class="font-picker__item-meta">
            <span class="font-picker__item-cat">{{ font.categoryLabel }}</span>
            <span v-if="font.family === modelValue" class="font-picker__item-check">✓ Sélectionnée</span>
          </div>
        </div>

        <div v-if="filteredFonts.length === 0" class="font-picker__empty">
          Aucune police trouvée pour "{{ search }}"
        </div>
      </div>
    </div>

    <!-- Overlay pour fermer -->
    <div v-if="isOpen" class="font-picker__overlay" @click="isOpen = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'

interface FontDef {
  family: string
  category: string
  categoryLabel: string
}

const props = defineProps<{
  modelValue: string
  label: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isOpen = ref(false)
const search = ref('')
const activeCategory = ref('all')
const previewText = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const loadedFonts = ref<Set<string>>(new Set())

// IntersectionObserver pour chargement lazy des polices
let fontObserver: IntersectionObserver | null = null

const categories = [
  { id: 'all', label: 'Toutes' },
  { id: 'serif', label: 'Serif' },
  { id: 'sans-serif', label: 'Sans-Serif' },
  { id: 'display', label: 'Display' },
  { id: 'monospace', label: 'Mono' }
]

// Liste curated de 80 polices Google Fonts adaptées au business/finance
const allFonts: FontDef[] = [
  // Serif élégants
  { family: 'Playfair Display', category: 'serif', categoryLabel: 'Serif' },
  { family: 'Cormorant Garamond', category: 'serif', categoryLabel: 'Serif' },
  { family: 'EB Garamond', category: 'serif', categoryLabel: 'Serif' },
  { family: 'Libre Baskerville', category: 'serif', categoryLabel: 'Serif' },
  { family: 'Merriweather', category: 'serif', categoryLabel: 'Serif' },
  { family: 'Lora', category: 'serif', categoryLabel: 'Serif' },
  { family: 'Crimson Text', category: 'serif', categoryLabel: 'Serif' },
  { family: 'Spectral', category: 'serif', categoryLabel: 'Serif' },
  { family: 'PT Serif', category: 'serif', categoryLabel: 'Serif' },
  { family: 'Noto Serif', category: 'serif', categoryLabel: 'Serif' },
  { family: 'Source Serif 4', category: 'serif', categoryLabel: 'Serif' },
  { family: 'Bitter', category: 'serif', categoryLabel: 'Serif' },
  { family: 'Gelasio', category: 'serif', categoryLabel: 'Serif' },
  { family: 'Cardo', category: 'serif', categoryLabel: 'Serif' },
  { family: 'Gilda Display', category: 'serif', categoryLabel: 'Serif' },
  { family: 'Italiana', category: 'serif', categoryLabel: 'Serif' },
  { family: 'Cormorant', category: 'serif', categoryLabel: 'Serif' },
  { family: 'Sorts Mill Goudy', category: 'serif', categoryLabel: 'Serif' },
  // Sans-serif professionnels
  { family: 'Inter', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Poppins', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Roboto', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Open Sans', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Lato', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Nunito', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Raleway', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Montserrat', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Source Sans 3', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Work Sans', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Mulish', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'DM Sans', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Outfit', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Plus Jakarta Sans', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Figtree', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Urbanist', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Manrope', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Lexend', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Sora', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Space Grotesk', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Be Vietnam Pro', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'IBM Plex Sans', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Josefin Sans', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Barlow', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Karla', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Rubik', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Cabin', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Noto Sans', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Exo 2', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  { family: 'Titillium Web', category: 'sans-serif', categoryLabel: 'Sans-Serif' },
  // Display / Élégants
  { family: 'Cinzel', category: 'serif', categoryLabel: 'Display' },
  { family: 'Cinzel Decorative', category: 'display', categoryLabel: 'Display' },
  { family: 'Tenor Sans', category: 'sans-serif', categoryLabel: 'Display' },
  { family: 'Josefin Slab', category: 'serif', categoryLabel: 'Display' },
  { family: 'Abril Fatface', category: 'display', categoryLabel: 'Display' },
  { family: 'Yeseva One', category: 'display', categoryLabel: 'Display' },
  { family: 'Unna', category: 'serif', categoryLabel: 'Display' },
  { family: 'Philosopher', category: 'serif', categoryLabel: 'Display' },
  { family: 'Bodoni Moda', category: 'serif', categoryLabel: 'Display' },
  { family: 'GFS Didot', category: 'serif', categoryLabel: 'Display' },
  { family: 'Marcellus', category: 'serif', categoryLabel: 'Display' },
  { family: 'Fraunces', category: 'serif', categoryLabel: 'Display' },
  { family: 'Big Shoulders Display', category: 'display', categoryLabel: 'Display' },
  { family: 'Bebas Neue', category: 'display', categoryLabel: 'Display' },
  { family: 'Questrial', category: 'sans-serif', categoryLabel: 'Display' },
  // Monospace
  { family: 'JetBrains Mono', category: 'monospace', categoryLabel: 'Mono' },
  { family: 'Fira Code', category: 'monospace', categoryLabel: 'Mono' },
  { family: 'IBM Plex Mono', category: 'monospace', categoryLabel: 'Mono' },
  { family: 'Source Code Pro', category: 'monospace', categoryLabel: 'Mono' },
  { family: 'Space Mono', category: 'monospace', categoryLabel: 'Mono' },
  { family: 'Courier Prime', category: 'monospace', categoryLabel: 'Mono' }
]

const filteredFonts = computed(() => {
  let list = allFonts
  if (activeCategory.value !== 'all') {
    if (activeCategory.value === 'display') {
      list = list.filter(f => f.categoryLabel === 'Display')
    } else if (activeCategory.value === 'monospace') {
      list = list.filter(f => f.category === 'monospace')
    } else {
      list = list.filter(f => f.category === activeCategory.value && f.categoryLabel !== 'Display')
    }
  }
  if (search.value.trim()) {
    const s = search.value.toLowerCase()
    list = list.filter(f => f.family.toLowerCase().includes(s))
  }
  return list
})

const selectedStyle = computed(() => {
  if (props.modelValue && loadedFonts.value.has(props.modelValue)) {
    const font = allFonts.find(f => f.family === props.modelValue)
    return { fontFamily: `'${props.modelValue}', ${font?.category || 'sans-serif'}` }
  }
  return {}
})

function fontLoaded(family: string): boolean {
  return loadedFonts.value.has(family)
}

function loadFont(family: string) {
  if (loadedFonts.value.has(family)) return
  const id = `gf-${family.replace(/\s+/g, '-')}`
  if (document.getElementById(id)) {
    loadedFonts.value.add(family)
    return
  }
  const encoded = encodeURIComponent(family)
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@400;700&display=swap`
  link.onload = () => loadedFonts.value.add(family)
  document.head.appendChild(link)
}

// Charger la police sélectionnée au démarrage
if (props.modelValue) loadFont(props.modelValue)
watch(() => props.modelValue, (v) => { if (v) loadFont(v) }, { immediate: true })

function observeFont(el: HTMLElement | null, family: string) {
  if (!el || !fontObserver) return
  el.dataset.fontFamily = family
  fontObserver.observe(el)
}

function toggleOpen() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      searchInput.value?.focus()
      setupObserver()
    })
  } else {
    destroyObserver()
  }
}

function setupObserver() {
  fontObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const family = (entry.target as HTMLElement).dataset.fontFamily
          if (family) loadFont(family)
        }
      })
    },
    { root: listRef.value, rootMargin: '100px', threshold: 0.1 }
  )
}

function destroyObserver() {
  fontObserver?.disconnect()
  fontObserver = null
}

function selectFont(family: string) {
  loadFont(family)
  emit('update:modelValue', family)
  isOpen.value = false
  search.value = ''
}

onUnmounted(() => destroyObserver())
</script>

<style scoped>
.font-picker {
  position: relative;
}

.font-picker__label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

/* Bouton principal */
.font-picker__selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  border: 2px solid var(--color-border, rgba(30,26,52,0.1));
  border-radius: 12px;
  background: var(--color-bg, #fff);
  cursor: pointer;
  transition: border-color 0.2s ease;
  min-height: 52px;
}

.font-picker__selected:hover {
  border-color: var(--color-gold, #C9A84C);
}

.font-picker__preview-text {
  font-size: 1.05rem;
  color: var(--color-text, #1e1a34);
  flex: 1;
  transition: font-family 0.3s ease;
}

.font-picker__arrow {
  font-size: 1rem;
  color: var(--color-text-muted, rgba(30,26,52,0.5));
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.font-picker__arrow--open {
  transform: rotate(180deg);
}

/* Dropdown */
.font-picker__dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid rgba(30,26,52,0.12);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(30,26,52,0.15);
  z-index: 200;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Recherche */
.font-picker__search-wrap {
  position: relative;
  padding: 0.875rem;
  border-bottom: 1px solid #f0f0f5;
}

.font-picker__search-icon {
  position: absolute;
  left: 1.625rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(30,26,52,0.4);
  pointer-events: none;
}

.font-picker__search {
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.25rem;
  border: 1.5px solid #e5e5ea;
  border-radius: 10px;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s ease;
  font-family: inherit;
  color: var(--color-text, #1e1a34);
}

.font-picker__search:focus {
  border-color: var(--color-gold, #C9A84C);
}

/* Catégories */
.font-picker__categories {
  display: flex;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid #f0f0f5;
  flex-wrap: wrap;
}

.font-picker__cat-btn {
  padding: 0.3rem 0.875rem;
  border-radius: 100px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid #e5e5ea;
  background: transparent;
  color: rgba(30,26,52,0.6);
  transition: all 0.2s ease;
  font-family: inherit;
}

.font-picker__cat-btn:hover {
  border-color: var(--color-gold, #C9A84C);
  color: var(--color-gold, #C9A84C);
}

.font-picker__cat-btn--active {
  background: var(--color-gold, #C9A84C);
  border-color: var(--color-gold, #C9A84C);
  color: #fff !important;
}

/* Barre de prévisualisation */
.font-picker__preview-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.875rem;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f5;
  font-size: 0.78rem;
  color: rgba(30,26,52,0.5);
}

.font-picker__preview-input {
  flex: 1;
  padding: 0.3rem 0.75rem;
  border: 1px solid #e5e5ea;
  border-radius: 8px;
  font-size: 0.8rem;
  outline: none;
  font-family: inherit;
  color: var(--color-text, #1e1a34);
  background: #fff;
}

.font-picker__preview-input:focus {
  border-color: var(--color-gold, #C9A84C);
}

/* Liste */
.font-picker__list {
  overflow-y: auto;
  max-height: 380px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.font-picker__item {
  padding: 0.875rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease;
  border: 1.5px solid transparent;
}

.font-picker__item:hover {
  background: #f5f5f7;
}

.font-picker__item--selected {
  background: rgba(201,168,76,0.08);
  border-color: rgba(201,168,76,0.3);
}

.font-picker__item-name {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(30,26,52,0.5);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.375rem;
}

.font-picker__item-preview {
  font-size: 1.2rem;
  color: var(--color-text, #1e1a34);
  line-height: 1.4;
  margin-bottom: 0.375rem;
  min-height: 1.8rem;
  transition: font-family 0.3s ease;
}

.font-picker__item-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.font-picker__item-cat {
  font-size: 0.7rem;
  color: rgba(30,26,52,0.35);
  background: #f0f0f5;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.font-picker__item-check {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-gold, #C9A84C);
}

.font-picker__empty {
  text-align: center;
  padding: 2rem;
  color: rgba(30,26,52,0.4);
  font-size: 0.875rem;
}

/* Overlay */
.font-picker__overlay {
  position: fixed;
  inset: 0;
  z-index: 199;
}
</style>
