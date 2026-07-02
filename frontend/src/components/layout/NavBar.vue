<template>
  <header class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <div class="navbar__container">
      <!-- Logo -->
      <a href="#" class="navbar__logo" @click.prevent="scrollToTop">
        <img :src="resolveAssetUrl(config?.logoUrl || '/assets/logo.png')" :alt="config?.siteName || 'Cabinet OEFIC'" />
      </a>

      <!-- Nav Links (desktop) -->
      <nav class="navbar__nav" :class="{ 'navbar__nav--open': menuOpen }">
        <a href="#services" class="navbar__link" @click="closeMenu">Nos services</a>
        <a href="#about" class="navbar__link" @click="closeMenu">À propos</a>
        <a href="#stats" class="navbar__link" @click="closeMenu">Chiffres clés</a>
        <a href="#contact" class="navbar__link" @click="closeMenu">Contact</a>
        <a href="#contact" class="btn btn-primary navbar__cta" @click="closeMenu">
          Prendre rendez-vous
        </a>
      </nav>

      <!-- Hamburger (mobile) -->
      <button
        class="navbar__burger"
        :class="{ 'navbar__burger--open': menuOpen }"
        @click="toggleMenu"
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSiteConfigStore } from '@/stores/siteConfig'
import { resolveAssetUrl } from '@/utils/asset'

const { config } = storeToRefs(useSiteConfigStore())

const isScrolled = ref(false)
const menuOpen = ref(false)

function onScroll() {
  isScrolled.value = window.scrollY > 60
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1.25rem 0;
  transition: all 0.35s ease;
}

.navbar--scrolled {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 2px 24px rgba(30, 26, 52, 0.1);
  padding: 0.875rem 0;
  border-bottom: 1px solid rgba(201, 168, 76, 0.15);
}

.navbar__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.navbar__logo {
  flex-shrink: 0;
}

.navbar__logo img {
  height: 80px;
  width: auto;
  object-fit: contain;
  transition: height 0.35s ease, opacity 0.2s ease;
}

.navbar--scrolled .navbar__logo img {
  height: 52px;
}

.navbar__logo:hover img {
  opacity: 0.85;
}

.navbar__nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navbar__link {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.01em;
  transition: color 0.2s ease;
  position: relative;
}

.navbar--scrolled .navbar__link {
  color: var(--color-text);
}

.navbar__link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-gold);
  border-radius: 1px;
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.navbar__link:hover {
  color: var(--color-gold);
}

.navbar__link:hover::after {
  transform: scaleX(1);
}

.navbar__cta {
  padding: 0.625rem 1.5rem;
  font-size: 0.875rem;
}

/* Hamburger */
.navbar__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
  cursor: pointer;
}

.navbar__burger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text);
  border-radius: 1px;
  transition: all 0.3s ease;
}

.navbar__burger--open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.navbar__burger--open span:nth-child(2) {
  opacity: 0;
}

.navbar__burger--open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* ===========================
   Responsive Mobile
   =========================== */
@media (max-width: 768px) {
  .navbar__burger {
    display: flex;
  }

  .navbar__burger span {
    background: #fff;
  }

  .navbar--scrolled .navbar__burger span {
    background: var(--color-text);
  }

  .navbar__nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background: var(--color-bg);
    flex-direction: column;
    align-items: flex-start;
    padding: 5rem 2rem 2rem;
    gap: 1.5rem;
    box-shadow: -4px 0 24px rgba(30, 26, 52, 0.15);
    transition: right 0.35s ease;
    z-index: 99;
  }

  .navbar__nav--open {
    right: 0;
  }

  .navbar__link {
    font-size: 1.1rem;
  }

  .navbar__cta {
    width: 100%;
    justify-content: center;
    margin-top: 1rem;
  }
}
</style>
