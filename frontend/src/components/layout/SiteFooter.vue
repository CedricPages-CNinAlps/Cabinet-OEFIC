<template>
  <footer v-milk="!legalOnly" class="footer" :class="{ 'footer--legal-only': legalOnly }" :style="footerStyle">
    <div class="footer__main container">
      <div v-if="!legalOnly" class="footer__brand">
        <img
          :src="resolveAssetUrl(config?.logoUrl || '/assets/logo.png')"
          :alt="config?.siteName"
          class="footer__logo"
        />
        <p class="footer__desc">{{ footer?.description }}</p>
        <!-- Réseaux sociaux -->
        <div class="footer__socials" v-if="hasSocials">
          <a v-if="config?.socialLinks?.linkedin" :href="config.socialLinks.linkedin" target="_blank" rel="noopener" aria-label="LinkedIn" class="footer__social">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          <a v-if="config?.socialLinks?.twitter" :href="config.socialLinks.twitter" target="_blank" rel="noopener" aria-label="Twitter/X" class="footer__social">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a v-if="config?.socialLinks?.facebook" :href="config.socialLinks.facebook" target="_blank" rel="noopener" aria-label="Facebook" class="footer__social">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          </a>
        </div>
      </div>

      <div v-if="!legalOnly" class="footer__col">
        <h4>{{ footer?.navTitle }}</h4>
        <ul>
          <li v-for="link in content?.nav?.links" :key="link.label + link.href">
            <a :href="link.href">{{ link.label }}</a>
          </li>
        </ul>
      </div>

      <div v-if="!legalOnly" class="footer__col">
        <h4>{{ footer?.servicesTitle }}</h4>
        <ul>
          <li v-for="svc in footerServices" :key="svc.id">
            <a :href="svc.link || '#services'">{{ svc.title }}</a>
          </li>
        </ul>
      </div>

      <div v-if="!legalOnly" class="footer__col">
        <h4>{{ footer?.contactTitle }}</h4>
        <ul>
          <li v-if="config?.legalInfo?.phone">
            <a :href="telHref(config.legalInfo.phone)">{{ config.legalInfo.phone }}</a>
          </li>
          <li v-if="config?.legalInfo?.email">
            <a :href="`mailto:${config.legalInfo.email}`">{{ config.legalInfo.email }}</a>
          </li>
          <li v-if="config?.legalInfo?.address || config?.legalInfo?.city">
            <a :href="mapsUrl" target="_blank" rel="noopener">
              {{ config.legalInfo.address }}<span v-if="config.legalInfo.address && config.legalInfo.city">, </span>{{ config.legalInfo.city }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Numéros réglementaires -->
      <div v-if="hasLegalNumbers" class="footer__legal-numbers">
        <h4 v-if="footer?.legalNumbersTitle" class="footer__legal-numbers-title">{{ footer.legalNumbersTitle }}</h4>
        <span v-if="config?.legalInfo?.orias">Immatriculé à l'ORIAS (www.orias.fr) sous le n° {{ config.legalInfo.orias }}</span>
        <span v-if="config?.legalInfo?.cif">
          Conseiller en Investissements Financiers (CIF) n° {{ config.legalInfo.cif }}<template v-if="config.legalInfo.cifAssociation">, adhérent de {{ config.legalInfo.cifAssociation }}</template>, association agréée par l'AMF
        </span>
        <span v-if="config?.legalInfo?.coa">{{ config.legalInfo.coa }} — sous le contrôle de l'ACPR</span>
        <span v-if="config?.legalInfo?.iobsp">{{ config.legalInfo.iobsp }} — sous le contrôle de l'ACPR</span>
        <span v-if="config?.legalInfo?.carteT">Carte professionnelle T (transaction immobilière) n° {{ config.legalInfo.carteT }}</span>
        <span v-if="config?.legalInfo?.rcPro">
          RC Professionnelle et garantie financière n° {{ config.legalInfo.rcPro }}<template v-if="config.legalInfo.rcProInsurer"> — {{ config.legalInfo.rcProInsurer }}</template>
        </span>
        <span v-if="config?.legalInfo?.mediator">Médiateur de la consommation : {{ config.legalInfo.mediator }}</span>
        <span v-if="config?.legalInfo?.siret">SIRET : {{ config.legalInfo.siret }}<template v-if="config.legalInfo.rcs"> — {{ config.legalInfo.rcs }}</template></span>
        <span v-if="config?.legalInfo?.tvaIntra">TVA intracommunautaire : {{ config.legalInfo.tvaIntra }}</span>
      </div>
    </div>

    <!-- Bottom bar -->
    <div v-if="!legalOnly" class="footer__bottom">
      <div class="container footer__bottom-inner">
        <p class="footer__copyright" v-html="copyrightHtml"></p>
        <div class="footer__legal-links">
          <a
            v-for="link in footer?.legalLinks"
            :key="link.label"
            :href="link.href"
          >{{ link.label }}</a>
          <button id="tarteaucitronPersonalize2" class="footer__cookie-btn">
            {{ footer?.cookiesText || 'Gestion des cookies' }}
          </button>
          <RouterLink :to="{ name: 'admin-login' }" class="footer__admin" title="Administration" aria-label="Administration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSiteConfigStore } from '@/stores/siteConfig'
import { resolveAssetUrl } from '@/utils/asset'
import { telHref } from '@/utils/contact'

// legalOnly : uniquement les numéros réglementaires, sur le fond de la section parente (pages maintenance / reconstruction)
const props = defineProps<{ legalOnly?: boolean }>()

const { displayConfig: config, displayContent: content } = storeToRefs(useSiteConfigStore())
const footer = computed(() => content.value?.footer)

const footerServices = computed(() =>
  (content.value?.services ?? [])
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order)
    .slice(0, 6)
)

const currentYear = new Date().getFullYear()

const footerStyle = computed(() => ({
  backgroundColor: props.legalOnly ? 'transparent' : footer.value?.bgColor || '#1e1a34',
  '--footer-text': footer.value?.textColor || 'rgba(255,255,255,0.7)'
}))

const hasSocials = computed(() => {
  const s = config.value?.socialLinks || {}
  return Object.values(s).some(Boolean)
})

const mapsUrl = computed(() => {
  const parts = [config.value?.legalInfo?.address, config.value?.legalInfo?.city].filter(Boolean).join(', ')
  const query = encodeURIComponent(parts)
  const ua = navigator.userAgent
  const isApple = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
  return isApple
    ? `https://maps.apple.com/?q=${query}`
    : `https://www.google.com/maps/search/?api=1&query=${query}`
})

const copyrightHtml = computed(() => {
  const raw = footer.value?.copyrightText
    || `© ${currentYear} ${config.value?.siteName || 'Cabinet OEFIC'}. Tous droits réservés.`
  return raw.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>'
  )
})

const hasLegalNumbers = computed(() => {
  const l = config.value?.legalInfo
  return l && (l.orias || l.cif || l.coa || l.iobsp || l.carteT || l.rcPro || l.mediator || l.tvaIntra || l.siret)
})
</script>

<style scoped>
.footer {
  color: var(--footer-text, rgba(255, 255, 255, 0.7));
}

.footer__main {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  padding-top: 5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--footer-text, white) 10%, transparent);
}

.footer--legal-only .footer__main {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 0;
}

/* Brand */
.footer__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
}

.footer__logo {
  height: 100px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.9;
  align-self: center;
}

.footer__desc {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--footer-text, rgba(255, 255, 255, 0.7));
  max-width: 300px;
}

/* Socials */
.footer__socials {
  display: flex;
  gap: 0.75rem;
}

.footer__social {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--footer-text, white) 10%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--footer-text, rgba(255, 255, 255, 0.7));
  opacity: 0.75;
  transition: all 0.2s ease;
}

.footer__social:hover {
  background: var(--color-gold);
  color: #fff;
  opacity: 1;
}

.footer__social svg {
  width: 16px;
  height: 16px;
}

/* Colonnes */
.footer__col h4 {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 0.8rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-gold);
  margin-bottom: 1.25rem;
}

.footer__col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.footer__col li a,
.footer__col li {
  font-size: 0.875rem;
  color: var(--footer-text, rgba(255, 255, 255, 0.7));
  transition: color 0.2s ease;
}

.footer__col li a:hover {
  color: var(--color-gold);
  opacity: 1;
}

/* Numéros réglementaires */
.footer__legal-numbers-title {
  flex: 0 0 100%;
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 0.8rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-gold);
  margin-bottom: 0.25rem;
  text-align: center;
}

.footer__legal-numbers {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 2rem;
  padding-top: 0.25rem;
  padding-bottom: 0.5rem;
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 0.75rem;
  color: #ffffff;
  text-align: center;
}

/* Bottom */
.footer__bottom {
  padding: 1.5rem 0;
}

.footer__bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.footer__copyright {
  font-size: 0.8rem;
  color: var(--footer-text, rgba(255, 255, 255, 0.7));
}

.footer__copyright :deep(a) {
  color: var(--color-gold);
  transition: opacity 0.2s ease;
}

.footer__copyright :deep(a:hover) {
  opacity: 0.8;
}

.footer__legal-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.footer__legal-links a,
.footer__cookie-btn {
  font-size: 0.8rem;
  color: var(--footer-text, rgba(255, 255, 255, 0.7));
  transition: color 0.2s ease;
  cursor: pointer;
  background: none;
  border: none;
  font-family: inherit;
  padding: 0;
}

.footer__legal-links a:hover,
.footer__cookie-btn:hover {
  color: var(--color-gold);
  opacity: 1;
}

/* Accès discret au backoffice */
.footer__admin {
  display: inline-flex;
  align-items: center;
  color: var(--footer-text, rgba(255, 255, 255, 0.7));
  opacity: 0.25;
  transition: opacity 0.2s ease, color 0.2s ease, transform 0.4s ease;
}

.footer__admin svg {
  width: 13px;
  height: 13px;
}

.footer__admin:hover,
.footer__admin:focus-visible {
  opacity: 1;
  color: var(--color-gold);
  transform: rotate(90deg);
}

@media (max-width: 900px) {
  .footer__main {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .footer__brand {
    grid-column: 1 / -1;
  }

  .footer__legal-numbers {
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.3rem;
    text-align: center;
  }

  .footer__legal-numbers-title {
    flex: 0 0 auto;
  }
}

@media (max-width: 580px) {
  .footer__main {
    grid-template-columns: 1fr;
    padding-top: 3rem;
  }

  .footer__col {
    text-align: center;
  }

  .footer__col ul {
    align-items: center;
  }

  .footer__bottom-inner {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer__legal-links {
    justify-content: center;
  }
}
</style>
