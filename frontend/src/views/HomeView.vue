<template>
  <!-- Rien avant le chargement du contenu : le statut (maintenance…) n'est pas encore connu -->
  <div v-if="content" class="home">
    <div v-if="statusMode !== 'online' && auth.isAuthenticated" class="home__status-banner" role="status">
      <template v-if="statusPage">{{ statusLabel }} — page vue par les visiteurs</template>
      <template v-else>Site visible uniquement par vous (connecté au backoffice)</template>
      <button type="button" @click="adminBypass = !adminBypass">
        {{ statusPage ? 'Voir le site quand même' : 'Revenir à la page visiteurs' }}
      </button>
    </div>

    <SiteStatusPage v-if="statusPage" :mode="statusPage" />
    <NavBar v-if="!statusPage" />
    <main v-if="!statusPage">
      <HeroSection v-if="content?.sectionsVisible?.hero !== false" />
      <ServicesSection
        v-if="content?.sectionsVisible?.services !== false"
        id="services"
      />
      <FamilyOfficeSection
        v-if="content?.sectionsVisible?.familyOffice !== false"
        id="family-office"
      />
      <AboutSection
        v-if="content?.sectionsVisible?.about !== false"
        id="about"
      />
      <StatsSection
        v-if="content?.sectionsVisible?.stats !== false"
        id="stats"
      />
      <LogoSliderSection
        v-for="slider in visibleSliders"
        :key="slider.id"
        :id="`slider-${slider.id}`"
        :slider="slider"
      />
      <ContactSection
        v-if="content?.sectionsVisible?.contact !== false"
        id="contact"
      />
    </main>
    <SiteFooter />
    <TrackingManager />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { startSmoothScroll } from '@/animations/motion'
import { storeToRefs } from 'pinia'
import { useSiteConfigStore } from '@/stores/siteConfig'
import NavBar from '@/components/layout/NavBar.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import FamilyOfficeSection from '@/components/sections/FamilyOfficeSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import StatsSection from '@/components/sections/StatsSection.vue'
import LogoSliderSection from '@/components/sections/LogoSliderSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import SiteStatusPage from '@/components/sections/SiteStatusPage.vue'
import TrackingManager from '@/components/utils/TrackingManager.vue'
import { useAuthStore } from '@/stores/auth'

const { displayContent: content } = storeToRefs(useSiteConfigStore())
const auth = useAuthStore()

const statusMode = computed(() => content.value?.siteStatus?.mode ?? 'online')
const statusLabel = computed(() => statusMode.value === 'maintenance' ? 'Site en maintenance' : 'Site en reconstruction')
// Tout le monde voit la page d'information ; l'admin connecté peut afficher le vrai site pour le vérifier
const adminBypass = ref(false)
const statusPage = computed(() =>
  statusMode.value !== 'online' && !(auth.isAuthenticated && adminBypass.value) ? statusMode.value : null
)

// Sliders affichés à la suite, dans l'ordre du backoffice ; un slider sans logo est masqué
const visibleSliders = computed(() =>
  (content.value?.sliders ?? []).filter(s => s.visible && s.logos.length)
)

let stopSmoothScroll = () => {}
onMounted(() => { stopSmoothScroll = startSmoothScroll() })
onUnmounted(() => stopSmoothScroll())
</script>

<style scoped>
.home__status-banner {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  padding: 0.6rem 1.25rem;
  border-radius: 100px;
  background: var(--color-gold);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: calc(100% - 2rem);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.home__status-banner button {
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  background: #fff;
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
}
</style>
