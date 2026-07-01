<template>
  <div class="home">
    <NavBar />
    <main>
      <HeroSection v-if="content?.sectionsVisible?.hero !== false" />
      <ServicesSection
        v-if="content?.sectionsVisible?.services !== false"
        id="services"
      />
      <AboutSection
        v-if="content?.sectionsVisible?.about !== false"
        id="about"
      />
      <StatsSection
        v-if="content?.sectionsVisible?.stats !== false"
        id="stats"
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
import { storeToRefs } from 'pinia'
import { useSiteConfigStore } from '@/stores/siteConfig'
import NavBar from '@/components/layout/NavBar.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import StatsSection from '@/components/sections/StatsSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import TrackingManager from '@/components/utils/TrackingManager.vue'

const { content } = storeToRefs(useSiteConfigStore())
</script>
