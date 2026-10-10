<template>
  <div class="admin">
    <!-- Toast notification -->
    <transition name="toast">
      <div v-if="saveMessage" class="admin-toast" :class="`admin-toast--${saveType}`">
        <svg v-if="saveType === 'ok'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {{ saveMessage }}
      </div>
    </transition>

    <!-- Overlay mobile -->
    <div
      v-if="sidebarOpen"
      class="admin-overlay"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ 'admin-sidebar--open': sidebarOpen }">
      <div class="admin-sidebar__logo">
        <img :src="resolveAssetUrl('/assets/logo.png')" alt="OEFIC" />
        <button class="admin-sidebar__close" @click="sidebarOpen = false" aria-label="Fermer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <nav class="admin-sidebar__nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="admin-sidebar__item"
          :class="{ 'admin-sidebar__item--active': activeTab === tab.id }"
          @click="selectTab(tab.id)"
        >
          <span class="admin-sidebar__icon" v-html="tab.icon"></span>
          <span>{{ tab.label }}</span>
        </button>
      </nav>
      <div class="admin-sidebar__bottom">
        <a :href="siteUrl" target="_blank" class="admin-sidebar__preview">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Voir le site
        </a>
        <button class="admin-sidebar__logout" @click="handleLogout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Déconnexion
        </button>
      </div>
    </aside>

    <!-- Contenu principal -->
    <main class="admin-main">
      <!-- Top bar mobile -->
      <div class="admin-topbar">
        <button class="admin-topbar__burger" @click="sidebarOpen = true" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <span class="admin-topbar__title">{{ currentTabLabel }}</span>
        <div class="admin-topbar__save" v-if="saveMessage">
          <span :class="`save-msg save-msg--${saveType}`">{{ saveMessage }}</span>
        </div>
      </div>

      <div class="admin-main__header">
        <h1>{{ currentTabLabel }}</h1>
        <div class="admin-main__save" v-if="saveMessage">
          <span :class="`save-msg save-msg--${saveType}`">{{ saveMessage }}</span>
        </div>
      </div>

      <details v-if="['config', 'nav', 'hero', 'services', 'familyOffice', 'about', 'stats', 'sliders', 'contact', 'seo'].includes(activeTab)" class="admin-vars">
        <summary>Variables utilisables dans tous les textes — saisies une seule fois, reprises partout</summary>
        <p>Écrivez la variable entre accolades dans n'importe quel champ texte : elle sera remplacée sur le site.</p>
        <ul>
          <li v-for="v in textVarList" :key="v.key">
            <code>{{ '{' + v.key + '}' }}</code>
            <span>{{ v.label }}</span>
            <em>→ {{ store.textVars[v.key] || '(vide)' }}</em>
          </li>
        </ul>
      </details>

      <!-- ===========================
           ONGLET : Config Générale
           =========================== -->
      <div v-if="activeTab === 'config'" class="admin-panel">
        <div class="admin-section">
          <h3>Identité du site</h3>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>Nom du cabinet</label>
              <input v-model="localConfig.siteName" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Slogan</label>
              <input v-model="localConfig.slogan" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Année de création <code>{annee_creation}</code></label>
              <input v-model="localConfig.foundingYear" type="text" class="form-control" placeholder="1987" />
            </div>
            <div class="form-group">
              <label>Années d'expertise affichées <code>{anciennete}</code></label>
              <input v-model="localConfig.yearsOfExpertise" type="text" class="form-control" placeholder="40" />
            </div>
          </div>
          <p class="admin-section-hint">Le nom du cabinet <code>{nom_cabinet}</code>, l'année de création et l'ancienneté sont repris automatiquement dans le hero, les expertises, « Le cabinet », les chiffres clés, le footer et le SEO.</p>
        </div>

        <div class="admin-section">
          <h3>Couleurs</h3>
          <div class="admin-grid-3">
            <div class="form-group">
              <label>Fond principal</label>
              <div class="color-picker-row">
                <input type="color" v-model="localConfig.colors.bg" class="color-input" />
                <input type="text" v-model="localConfig.colors.bg" class="form-control form-control--sm" />
              </div>
            </div>
            <div class="form-group">
              <label>Fond secondaire</label>
              <div class="color-picker-row">
                <input type="color" v-model="localConfig.colors.bgSoft" class="color-input" />
                <input type="text" v-model="localConfig.colors.bgSoft" class="form-control form-control--sm" />
              </div>
            </div>
            <div class="form-group">
              <label>Couleur texte</label>
              <div class="color-picker-row">
                <input type="color" v-model="localConfig.colors.text" class="color-input" />
                <input type="text" v-model="localConfig.colors.text" class="form-control form-control--sm" />
              </div>
            </div>
            <div class="form-group">
              <label>Or principal</label>
              <div class="color-picker-row">
                <input type="color" v-model="localConfig.colors.gold" class="color-input" />
                <input type="text" v-model="localConfig.colors.gold" class="form-control form-control--sm" />
              </div>
            </div>
            <div class="form-group">
              <label>Or foncé</label>
              <div class="color-picker-row">
                <input type="color" v-model="localConfig.colors.goldDark" class="color-input" />
                <input type="text" v-model="localConfig.colors.goldDark" class="form-control form-control--sm" />
              </div>
            </div>
          </div>
        </div>

        <div class="admin-section">
          <h3>Typographie (Google Fonts)</h3>
          <p class="admin-section-hint">Chaque police est prévisualisée dans sa propre typographie. Utilisez la barre de recherche ou filtrez par catégorie.</p>
          <div class="admin-grid-2">
            <FontPicker
              v-model="localConfig.fonts.heading"
              label="Police des titres"
            />
            <FontPicker
              v-model="localConfig.fonts.body"
              label="Police du corps de texte"
            />
          </div>
        </div>

        <div class="admin-section">
          <h3>Numéros réglementaires</h3>
          <div class="form-group" style="margin-bottom:1rem">
            <label>Titre affiché dans le footer</label>
            <input v-model="localContent.footer.legalNumbersTitle" type="text" class="form-control"
              placeholder="Numéros réglementaires" />
          </div>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>N° d'immatriculation ORIAS</label>
              <input v-model="localConfig.legalInfo.orias" type="text" class="form-control" placeholder="00 000 000" />
            </div>
            <div class="form-group">
              <label>CIF — N° d'adhérent</label>
              <input v-model="localConfig.legalInfo.cif" type="text" class="form-control" placeholder="Conseiller en Investissements Financiers" />
            </div>
            <div class="form-group">
              <label>CIF — Association agréée AMF</label>
              <input v-model="localConfig.legalInfo.cifAssociation" type="text" class="form-control" placeholder="CNCGP, ANACOFI-CIF, La Compagnie des CGP…" />
            </div>
            <div class="form-group">
              <label>Statut d'intermédiaire en assurance</label>
              <input v-model="localConfig.legalInfo.coa" type="text" class="form-control" placeholder="Courtier en assurance (COA)" />
            </div>
            <div class="form-group">
              <label>Statut IOBSP</label>
              <input v-model="localConfig.legalInfo.iobsp" type="text" class="form-control" placeholder="Courtier en opérations de banque (COBSP)" />
            </div>
            <div class="form-group">
              <label>N° Carte professionnelle T</label>
              <input v-model="localConfig.legalInfo.carteT" type="text" class="form-control" placeholder="Transaction immobilière (CCI)" />
            </div>
            <div class="form-group">
              <label>N° police RC Pro / garantie financière</label>
              <input v-model="localConfig.legalInfo.rcPro" type="text" class="form-control" placeholder="Responsabilité Civile Professionnelle" />
            </div>
            <div class="form-group">
              <label>Assureur RC Pro</label>
              <input v-model="localConfig.legalInfo.rcProInsurer" type="text" class="form-control" placeholder="Nom de l'assureur" />
            </div>
            <div class="form-group">
              <label>Médiateur de la consommation</label>
              <input v-model="localConfig.legalInfo.mediator" type="text" class="form-control" placeholder="Nom et site du médiateur" />
            </div>
            <div class="form-group">
              <label>RCS</label>
              <input v-model="localConfig.legalInfo.rcs" type="text" class="form-control" placeholder="RCS Grenoble 000 000 000" />
            </div>
            <div class="form-group">
              <label>N° TVA Intracommunautaire</label>
              <input v-model="localConfig.legalInfo.tvaIntra" type="text" class="form-control" placeholder="FR00 000000000" />
            </div>
            <div class="form-group">
              <label>SIRET</label>
              <input v-model="localConfig.legalInfo.siret" type="text" class="form-control" />
            </div>
          </div>
        </div>

        <div class="admin-section">
          <h3>Coordonnées</h3>
          <p class="admin-section-hint">Source unique : reprises dans la section Contact, le footer et les variables <code>{telephone}</code>, <code>{email}</code>, <code>{ville}</code>.</p>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>Téléphone</label>
              <input v-model="localConfig.legalInfo.phone" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="localConfig.legalInfo.email" type="email" class="form-control" />
            </div>
            <div class="form-group">
              <label>Adresse</label>
              <input v-model="localConfig.legalInfo.address" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Ville</label>
              <input v-model="localConfig.legalInfo.city" type="text" class="form-control" />
            </div>
          </div>
        </div>

        <div class="admin-section">
          <h3>Réseaux sociaux</h3>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>LinkedIn</label>
              <input v-model="localConfig.socialLinks.linkedin" type="url" class="form-control" placeholder="https://linkedin.com/company/..." />
            </div>
            <div class="form-group">
              <label>Twitter / X</label>
              <input v-model="localConfig.socialLinks.twitter" type="url" class="form-control" placeholder="https://twitter.com/..." />
            </div>
            <div class="form-group">
              <label>Facebook</label>
              <input v-model="localConfig.socialLinks.facebook" type="url" class="form-control" />
            </div>
            <div class="form-group">
              <label>Instagram</label>
              <input v-model="localConfig.socialLinks.instagram" type="url" class="form-control" />
            </div>
          </div>
        </div>
        <!-- Footer -->
        <div class="admin-section">
          <h3>Footer</h3>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>Titre colonne « Navigation »</label>
              <input v-model="localContent.footer.navTitle" type="text" class="form-control" placeholder="Navigation" />
            </div>
            <div class="form-group">
              <label>Titre colonne « Expertises »</label>
              <input v-model="localContent.footer.servicesTitle" type="text" class="form-control" placeholder="Nos expertises" />
            </div>
            <div class="form-group">
              <label>Titre colonne « Contact »</label>
              <input v-model="localContent.footer.contactTitle" type="text" class="form-control" placeholder="Contact" />
            </div>
            <div class="form-group">
              <label>Texte du lien cookies</label>
              <input v-model="localContent.footer.cookiesText" type="text" class="form-control" placeholder="Gestion des cookies" />
            </div>
          </div>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>Couleur de fond</label>
              <div class="color-picker-row">
                <input type="color" v-model="localContent.footer.bgColor" class="color-input" />
                <input type="text" v-model="localContent.footer.bgColor" class="form-control form-control--sm" />
              </div>
            </div>
            <div class="form-group">
              <label>Couleur du texte</label>
              <div class="color-picker-row">
                <input type="color" v-model="localContent.footer.textColor" class="color-input" />
                <input type="text" v-model="localContent.footer.textColor" class="form-control form-control--sm" />
              </div>
            </div>
          </div>
          <div class="form-group" style="margin-top:0.75rem">
            <label>Texte de présentation</label>
            <textarea v-model="localContent.footer.description" class="form-control" rows="3"
              placeholder="Cabinet indépendant de conseil en gestion de patrimoine et Family Office depuis 1987..."></textarea>
          </div>
          <div class="form-group" style="margin-top:0.75rem">
            <label>Mention copyright</label>
            <input v-model="localContent.footer.copyrightText" type="text" class="form-control"
              :placeholder="`© ${new Date().getFullYear()} Cabinet OEFIC. Tous droits réservés.`" />
            <p class="admin-section-hint" style="margin-top:0.4rem">
              Pour ajouter un lien : <code>[texte affiché](https://url.fr)</code><br>
              Ex. : <code>© 2026 [Cabinet OEFIC](https://cabinet-oefic.fr). Tous droits réservés.</code>
            </p>
          </div>

          <p class="admin-section-hint" style="margin-top:1.25rem">La colonne « Navigation » reprend les liens de l'onglet <strong>Menu</strong>, la colonne « Expertises » les expertises visibles et la colonne « Contact » les coordonnées ci-dessus.</p>

          <div class="admin-section__header" style="margin-top:1.25rem">
            <label class="form-label-bold">Liens légaux</label>
            <button class="btn-add" @click="addLegalLink">+ Ajouter</button>
          </div>
          <div v-for="(link, i) in localContent.footer.legalLinks" :key="i" class="link-row">
            <input v-model="link.label" type="text" class="form-control form-control--sm" placeholder="Libellé" />
            <input v-model="link.href" type="text" class="form-control" placeholder="/mentions-legales" />
            <button class="btn-delete" @click="localContent.footer.legalLinks.splice(i, 1)">×</button>
          </div>
          <p v-if="!localContent.footer.legalLinks?.length" class="admin-empty-hint">Aucun lien légal. Cliquez "+ Ajouter".</p>
        </div>

        <button class="btn btn-primary btn-save" @click="saveConfigAndFooter">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
            Enregistrer
</button>
      </div>

      <!-- ===========================
           ONGLET : Menu
           =========================== -->
      <div v-if="activeTab === 'nav'" class="admin-panel">
        <div class="admin-section">
          <div class="admin-section__header">
            <h3>Liens du menu</h3>
            <button class="btn-add" @click="localContent.nav.links.push({ label: '', href: '' })">+ Ajouter</button>
          </div>
          <p class="admin-section-hint">Ancres disponibles : #services, #family-office, #about, #stats, #contact, et #slider-… (ancre indiquée dans l'onglet Slider).</p>
          <draggable v-model="localContent.nav.links" :item-key="foItemKey" handle=".drag-handle">
            <template #item="{ element: link, index: i }">
              <div class="link-row">
                <span class="drag-handle" title="Déplacer">⠿</span>
                <input v-model="link.label" type="text" class="form-control form-control--sm" placeholder="Libellé" />
                <input v-model="link.href" type="text" class="form-control" placeholder="#section ou /page" />
                <button class="btn-delete" @click="localContent.nav.links.splice(i, 1)">×</button>
              </div>
            </template>
          </draggable>
        </div>
        <div class="admin-section">
          <h3>Bouton du menu</h3>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>Texte (vide = pas de bouton)</label>
              <input v-model="localContent.nav.ctaText" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Lien</label>
              <input v-model="localContent.nav.ctaLink" type="text" class="form-control" placeholder="#contact" />
            </div>
          </div>
        </div>
        <button class="btn btn-primary btn-save" @click="saveContent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
            Enregistrer
          </button>
      </div>

      <!-- ===========================
           ONGLET : Hero
           =========================== -->
      <div v-if="activeTab === 'hero'" class="admin-panel">
        <div class="admin-section">
          <h3>Contenu Hero</h3>
          <div class="form-group">
            <label>Titre principal (utilisez \n pour un saut de ligne)</label>
            <textarea v-model="localContent.hero.title" class="form-control" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Sous-titre</label>
            <textarea v-model="localContent.hero.subtitle" class="form-control" rows="3"></textarea>
          </div>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>CTA 1 — Texte</label>
              <input v-model="localContent.hero.cta1Text" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>CTA 1 — Lien</label>
              <input v-model="localContent.hero.cta1Link" type="text" class="form-control" placeholder="#contact" />
            </div>
            <div class="form-group">
              <label>CTA 2 — Texte</label>
              <input v-model="localContent.hero.cta2Text" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>CTA 2 — Lien</label>
              <input v-model="localContent.hero.cta2Link" type="text" class="form-control" placeholder="#services" />
            </div>
          </div>
          <div class="form-group">
            <label>Couleur de fond (laisser vide = défaut)</label>
            <div class="color-picker-row">
              <input type="color" v-model="localContent.hero.bgColor" class="color-input" />
              <input type="text" v-model="localContent.hero.bgColor" class="form-control form-control--sm" placeholder="vide = dégradé par défaut" />
            </div>
          </div>
        </div>

        <div class="admin-section">
          <h3>Badge et indicateur de défilement</h3>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>Badge au-dessus du titre (vide = masqué)</label>
              <input v-model="localContent.hero.badgeText" type="text" class="form-control" placeholder="Depuis 1987" />
            </div>
            <div class="form-group">
              <label>Texte de l'indicateur de défilement</label>
              <input v-model="localContent.hero.scrollText" type="text" class="form-control" placeholder="Découvrir" />
            </div>
          </div>
        </div>

        <div class="admin-section">
          <div class="admin-section__header">
            <h3>Chiffres rapides sous les boutons</h3>
            <button class="btn-add" @click="localContent.hero.quickStats.push({ statId: localContent.stats.stats[0]?.id ?? '', label: '' })">+ Ajouter</button>
          </div>
          <p class="admin-section-hint">Les valeurs viennent de l'onglet <strong>Statistiques</strong> : modifiez-les là-bas, elles seront mises à jour ici aussi.</p>
          <draggable v-model="localContent.hero.quickStats" :item-key="foItemKey" handle=".drag-handle">
            <template #item="{ element: qs, index: i }">
              <div class="link-row">
                <span class="drag-handle" title="Déplacer">⠿</span>
                <select v-model="qs.statId" class="form-control">
                  <option v-for="st in localContent.stats.stats" :key="st.id" :value="st.id">
                    {{ statPreview(st) }} — {{ st.label }}
                  </option>
                </select>
                <input v-model="qs.label" type="text" class="form-control form-control--sm" placeholder="Libellé court" />
                <button class="btn-delete" @click="localContent.hero.quickStats.splice(i, 1)">×</button>
              </div>
            </template>
          </draggable>
        </div>
        <button class="btn btn-primary btn-save" @click="saveContent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
            Enregistrer
          </button>
      </div>

      <!-- ===========================
           ONGLET : Services
           =========================== -->
      <div v-if="activeTab === 'services'" class="admin-panel">
        <div class="admin-section">
          <h3>En-tête de la section</h3>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>Sur-titre</label>
              <input v-model="localContent.servicesHeader.eyebrow" type="text" class="form-control" placeholder="Nos expertises" />
            </div>
            <div class="form-group">
              <label>Texte du lien des cartes</label>
              <input v-model="localContent.servicesHeader.cardCta" type="text" class="form-control" placeholder="En savoir plus" />
            </div>
          </div>
          <div class="form-group">
            <label>Titre (un retour à la ligne = saut de ligne)</label>
            <textarea v-model="localContent.servicesHeader.title" class="form-control" rows="2"></textarea>
          </div>
          <div class="form-group">
            <label>Introduction</label>
            <textarea v-model="localContent.servicesHeader.intro" class="form-control" rows="3"></textarea>
          </div>
        </div>
        <div class="admin-section">
          <div class="admin-section__header">
            <h3>Expertises ({{ localContent.services.length }})</h3>
            <button class="btn-add" @click="addService">+ Ajouter une expertise</button>
          </div>
          <draggable
            v-model="localContent.services"
            item-key="id"
            handle=".drag-handle"
            class="services-list"
          >
            <template #item="{ element: svc, index: i }">
              <div class="service-editor">
                <div class="service-editor__header">
                  <span class="drag-handle" title="Déplacer">⠿</span>
                  <span class="service-editor__num">Expertise {{ i + 1 }}</span>
                  <label class="toggle">
                    <input type="checkbox" v-model="svc.visible" />
                    <span>Visible</span>
                  </label>
                  <button class="btn-delete" @click="removeService(i)" title="Supprimer">×</button>
                </div>
                <div class="admin-grid-2">
                  <div class="form-group">
                    <label>Titre</label>
                    <input v-model="svc.title" type="text" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label>Icône</label>
                    <select v-model="svc.icon" class="form-control">
                      <optgroup label="Patrimoine & Investissement">
                        <option value="patrimoine">🏛 Gestion de Patrimoine</option>
                        <option value="investissement">📈 Investissement</option>
                        <option value="placement">🥧 Placements Financiers</option>
                        <option value="bourse">📊 Bourse & Marchés</option>
                        <option value="epargne">💳 Épargne</option>
                        <option value="immobilier">🏢 Investissement Immobilier</option>
                        <option value="scpi">🏘 SCPI / Pierre-Papier</option>
                      </optgroup>
                      <optgroup label="Assurance & Prévoyance">
                        <option value="assurance">🛡 Assurance Vie</option>
                        <option value="prevoyance">✅ Prévoyance</option>
                        <option value="retraite">👤 Retraite</option>
                        <option value="sante">🩺 Santé & Mutuelle</option>
                      </optgroup>
                      <optgroup label="Banque & Crédit">
                        <option value="banque">🏦 Banque</option>
                        <option value="credit">💳 Crédit & Financement</option>
                      </optgroup>
                      <optgroup label="Fiscalité & Optimisation">
                        <option value="fiscalite">📄 Optimisation Fiscale</option>
                        <option value="defiscalisation">➖ Défiscalisation</option>
                      </optgroup>
                      <optgroup label="Transmission & Entreprise">
                        <option value="succession">👥 Succession & Transmission</option>
                        <option value="entreprise">🏢 Gestion d'Entreprise</option>
                        <option value="familyoffice">👪 Family Office</option>
                        <option value="gouvernance">🔗 Gouvernance familiale</option>
                        <option value="fonds">💰 Levée de Fonds</option>
                        <option value="conseil">💬 Conseil</option>
                        <option value="audit">✔ Audit & Bilan</option>
                      </optgroup>
                      <optgroup label="Divers">
                        <option value="crypto">₿ Crypto-actifs</option>
                        <option value="philanthropie">❤ Philanthropie</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <textarea v-model="svc.description" class="form-control" rows="3"></textarea>
                </div>
                <div class="admin-grid-2">
                  <div class="form-group">
                    <label>Couleur de fond de la card</label>
                    <div class="color-picker-row">
                      <input type="color" v-model="svc.bgColor" class="color-input" />
                      <input type="text" v-model="svc.bgColor" class="form-control form-control--sm" placeholder="vide = défaut" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Lien (optionnel, ex. #contact ou #family-office)</label>
                    <input v-model="svc.link" type="text" class="form-control" placeholder="#contact" />
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
        <button class="btn btn-primary btn-save" @click="saveContent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
            Enregistrer
          </button>
      </div>

      <!-- ===========================
           ONGLET : Family Office
           =========================== -->
      <div v-if="activeTab === 'familyOffice'" class="admin-panel">
        <div class="admin-section">
          <div class="admin-section__header">
            <h3>Section Family Office</h3>
            <label class="toggle">
              <input type="checkbox" v-model="localContent.sectionsVisible.familyOffice" />
              <span>Afficher sur le site</span>
            </label>
          </div>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>Sur-titre</label>
              <input v-model="localContent.familyOffice.eyebrow" type="text" class="form-control" placeholder="Family Office" />
            </div>
            <div class="form-group">
              <label>Couleur de fond (vide = bleu nuit)</label>
              <div class="color-picker-row">
                <input type="color" v-model="localContent.familyOffice.bgColor" class="color-input" />
                <input type="text" v-model="localContent.familyOffice.bgColor" class="form-control form-control--sm" placeholder="vide = défaut" />
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Titre</label>
            <input v-model="localContent.familyOffice.title" type="text" class="form-control" />
          </div>
          <div class="form-group">
            <label>Texte d'introduction (séparez les paragraphes par une ligne vide)</label>
            <textarea v-model="localContent.familyOffice.text" class="form-control" rows="6"></textarea>
          </div>
        </div>

        <div class="admin-section">
          <div class="admin-section__header">
            <h3>Piliers ({{ localContent.familyOffice.pillars.length }})</h3>
            <button class="btn-add" @click="localContent.familyOffice.pillars.push({ title: '', description: '' })">+ Ajouter</button>
          </div>
          <draggable
            v-model="localContent.familyOffice.pillars"
            :item-key="foItemKey"
            handle=".drag-handle"
          >
            <template #item="{ element: item, index: i }">
              <div class="fo-item-editor">
                <div class="milestone-row">
                  <span class="drag-handle" title="Déplacer">⠿</span>
                  <span class="service-editor__num">Pilier {{ i + 1 }}</span>
                  <input v-model="item.title" type="text" class="form-control" placeholder="Titre du pilier" />
                  <button class="btn-delete" @click="localContent.familyOffice.pillars.splice(i, 1)">×</button>
                </div>
                <textarea v-model="item.description" class="form-control" rows="2" placeholder="Description"></textarea>
              </div>
            </template>
          </draggable>
        </div>

        <div class="admin-section">
          <div class="admin-section__header">
            <h3>Méthode — étapes ({{ localContent.familyOffice.steps.length }})</h3>
            <button class="btn-add" @click="localContent.familyOffice.steps.push({ title: '', description: '' })">+ Ajouter</button>
          </div>
          <div class="form-group">
            <label>Titre du bloc</label>
            <input v-model="localContent.familyOffice.stepsTitle" type="text" class="form-control" placeholder="Notre méthode" />
          </div>
          <draggable
            v-model="localContent.familyOffice.steps"
            :item-key="foItemKey"
            handle=".drag-handle"
          >
            <template #item="{ element: item, index: i }">
              <div class="fo-item-editor">
                <div class="milestone-row">
                  <span class="drag-handle" title="Déplacer">⠿</span>
                  <span class="service-editor__num">Étape {{ i + 1 }}</span>
                  <input v-model="item.title" type="text" class="form-control" placeholder="Titre de l'étape" />
                  <button class="btn-delete" @click="localContent.familyOffice.steps.splice(i, 1)">×</button>
                </div>
                <textarea v-model="item.description" class="form-control" rows="2" placeholder="Description"></textarea>
              </div>
            </template>
          </draggable>
        </div>

        <div class="admin-section">
          <h3>Bouton d'appel à l'action</h3>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>Texte (vide = pas de bouton)</label>
              <input v-model="localContent.familyOffice.ctaText" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Lien</label>
              <input v-model="localContent.familyOffice.ctaLink" type="text" class="form-control" placeholder="#contact" />
            </div>
          </div>
        </div>
        <button class="btn btn-primary btn-save" @click="saveContent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
            Enregistrer
          </button>
      </div>

      <!-- ===========================
           ONGLET : À propos
           =========================== -->
      <div v-if="activeTab === 'about'" class="admin-panel">
        <div class="admin-section">
          <h3>Section À propos</h3>
          <div class="form-group">
            <label>Sur-titre</label>
            <input v-model="localContent.about.eyebrow" type="text" class="form-control" placeholder="Notre histoire" />
          </div>
          <div class="form-group">
            <label>Titre</label>
            <input v-model="localContent.about.title" type="text" class="form-control" />
          </div>
          <div class="form-group">
            <label>Texte (séparez les paragraphes par une ligne vide)</label>
            <textarea v-model="localContent.about.text" class="form-control" rows="8"></textarea>
          </div>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>URL de l'image</label>
              <input v-model="localContent.about.imageUrl" type="url" class="form-control" placeholder="https://... ou /uploads/..." />
            </div>
            <div class="form-group">
              <label>Couleur de fond</label>
              <div class="color-picker-row">
                <input type="color" v-model="localContent.about.bgColor" class="color-input" />
                <input type="text" v-model="localContent.about.bgColor" class="form-control form-control--sm" />
              </div>
            </div>
          </div>
        </div>

        <div class="admin-section">
          <h3>Badge flottant</h3>
          <p class="admin-section-hint">Cercle doré affiché en haut à droite de l'image.</p>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>Valeur (ex. 40)</label>
              <input v-model="localContent.about.badgeValue" type="text" class="form-control" placeholder="40" />
            </div>
            <div class="form-group">
              <label>Texte sous la valeur</label>
              <input v-model="localContent.about.badgeLabel" type="text" class="form-control" placeholder="ans d'expertise" />
            </div>
          </div>
        </div>

        <div class="admin-section">
          <h3>Cadre sans image</h3>
          <p class="admin-section-hint">Affiché à la place de l'image quand aucune URL n'est renseignée.</p>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>Titre</label>
              <input v-model="localContent.about.placeholderTitle" type="text" class="form-control" placeholder="Cabinet OEFIC" />
            </div>
            <div class="form-group">
              <label>Sous-titre</label>
              <input v-model="localContent.about.placeholderSubtitle" type="text" class="form-control" placeholder="Depuis 1987" />
            </div>
          </div>
        </div>

        <div class="admin-section">
          <div class="admin-section__header">
            <h3>Jalons (timeline)</h3>
            <button class="btn-add" @click="addMilestone">+ Ajouter</button>
          </div>
          <div v-for="(m, i) in localContent.about.milestones" :key="i" class="milestone-row">
            <input v-model="m.year" type="text" class="form-control form-control--sm" placeholder="Année" />
            <input v-model="m.label" type="text" class="form-control" placeholder="Description" />
            <button class="btn-delete" @click="localContent.about.milestones.splice(i, 1)">×</button>
          </div>
        </div>
        <button class="btn btn-primary btn-save" @click="saveContent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
            Enregistrer
          </button>
      </div>

      <!-- ===========================
           ONGLET : Statistiques
           =========================== -->
      <div v-if="activeTab === 'stats'" class="admin-panel">
        <div class="admin-section">
          <h3>Section Statistiques</h3>
          <div class="form-group">
            <label>Couleur de fond</label>
            <div class="color-picker-row">
              <input type="color" v-model="localContent.stats.bgColor" class="color-input" />
              <input type="text" v-model="localContent.stats.bgColor" class="form-control form-control--sm" />
            </div>
          </div>
          <div v-for="stat in localContent.stats.stats" :key="stat.id" class="stat-editor">
            <div class="admin-grid-3">
              <div class="form-group">
                <label>Valeur</label>
                <select v-model="stat.source" class="form-control">
                  <option value="">Saisie manuelle</option>
                  <option value="anciennete">Automatique : années d'expertise</option>
                  <option value="nb_expertises">Automatique : nombre d'expertises</option>
                </select>
                <input v-if="!stat.source" v-model.number="stat.value" type="number" class="form-control" />
                <small v-else class="admin-section-hint">= {{ statPreview({ ...stat, suffix: '' }) }}</small>
              </div>
              <div class="form-group">
                <label>Suffixe</label>
                <input v-model="stat.suffix" type="text" class="form-control" placeholder="%, +, ans..." />
              </div>
              <div class="form-group">
                <label>Libellé</label>
                <input v-model="stat.label" type="text" class="form-control" />
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-primary btn-save" @click="saveContent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
            Enregistrer
          </button>
      </div>

      <!-- ===========================
           ONGLET : Slider (blocs de logos)
           =========================== -->
      <div v-if="activeTab === 'sliders'" class="admin-panel">
        <div class="admin-section">
          <div class="admin-section__header">
            <h3>Sliders de logos ({{ localContent.sliders.length }})</h3>
            <button class="btn-add" @click="addSlider">+ Ajouter un slider</button>
          </div>
          <p class="admin-section-hint">
            Chaque slider est un bloc indépendant affiché sur le site, à la suite des autres et dans cet ordre (avant la section Contact).
            Réorganisez les sliders avec ⠿ et les logos en les faisant glisser par leur image, y compris d'un slider à l'autre.
            Un slider sans logo n'est pas affiché.
          </p>
        </div>

        <draggable v-model="localContent.sliders" item-key="id" handle=".slider-drag" class="services-list">
          <template #item="{ element: slider, index: si }">
            <div
              class="admin-section slider-editor"
              :class="{ 'logo-drop--active': dropTarget === slider.id }"
              @dragover.prevent="onFileDragOver($event, slider.id)"
              @dragleave="dropTarget = ''"
              @drop.prevent="onFileDrop($event, slider)"
            >
              <div class="service-editor__header">
                <span class="drag-handle slider-drag" title="Déplacer le slider">⠿</span>
                <span class="service-editor__num">Slider {{ si + 1 }} — {{ slider.title || 'sans titre' }} · {{ slider.logos.length }} logo(s)</span>
                <label class="toggle">
                  <input type="checkbox" v-model="slider.visible" />
                  <span>Visible</span>
                </label>
                <button class="btn-delete" @click="removeSlider(si)" title="Supprimer le slider">×</button>
              </div>

              <div class="admin-grid-2">
                <div class="form-group">
                  <label>Sur-titre</label>
                  <input v-model="slider.eyebrow" type="text" class="form-control" placeholder="Nos partenaires" />
                </div>
                <div class="form-group">
                  <label>Titre</label>
                  <input v-model="slider.title" type="text" class="form-control" placeholder="Partenaires financiers" />
                </div>
              </div>
              <div class="form-group">
                <label>Texte (optionnel)</label>
                <input v-model="slider.subtitle" type="text" class="form-control" />
              </div>

              <div class="slider-timing">
                <div class="form-group">
                  <label>Type de défilement</label>
                  <select v-model="slider.mode" class="form-control">
                    <option value="continuous">Continu (bande qui défile en permanence)</option>
                    <option value="step">Par étapes (avance d'un logo puis marque une pause)</option>
                  </select>
                </div>
                <div v-if="slider.mode === 'step'" class="form-group">
                  <label>Temps d'affichage entre deux logos (secondes)</label>
                  <input v-model.number="slider.interval" type="number" min="1" max="30" step="0.5" class="form-control" />
                </div>
                <div v-else class="form-group">
                  <label>Durée d'un tour complet (secondes) — plus petit = plus rapide</label>
                  <input v-model.number="slider.speed" type="number" min="5" max="180" step="1" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Couleur de fond</label>
                  <div class="color-picker-row">
                    <input type="color" v-model="slider.bgColor" class="color-input" />
                    <input type="text" v-model="slider.bgColor" class="form-control form-control--sm" placeholder="vide = défaut" />
                  </div>
                </div>
              </div>
              <div class="slider-options">
                <label class="toggle">
                  <input type="checkbox" v-model="slider.reverse" />
                  <span>Défilement vers la droite</span>
                </label>
                <label class="toggle">
                  <input type="checkbox" v-model="slider.grayscale" />
                  <span>Logos en gris (couleur au survol)</span>
                </label>
                <span class="admin-section-hint">Ancre pour le menu : <code>#slider-{{ slider.id }}</code></span>
              </div>

              <draggable
                v-model="slider.logos"
                item-key="id"
                group="logos"
                handle=".logo-card__img"
                class="logo-grid"
              >
                <template #item="{ element: logo, index: li }">
                  <div class="logo-card">
                    <div class="logo-card__img" title="Glisser pour déplacer">
                      <img :src="resolveMediaUrl(logo.url)" :alt="logo.name" />
                    </div>
                    <input v-model="logo.name" type="text" class="form-control form-control--sm" placeholder="Nom du partenaire" />
                    <input v-model="logo.link" type="url" class="form-control form-control--sm" placeholder="Lien (optionnel)" />
                    <button class="logo-card__delete" @click="slider.logos.splice(li, 1)" title="Retirer ce logo">×</button>
                  </div>
                </template>
                <template #footer>
                  <label class="logo-card logo-card--add">
                    <span>{{ uploadingSlider === slider.id ? 'Envoi…' : '+ Importer des logos' }}</span>
                    <small>ou glissez vos fichiers sur ce slider</small>
                    <input type="file" accept="image/*" multiple hidden @change="onLogoInput($event, slider)" />
                  </label>
                </template>
              </draggable>

              <button class="btn-add" style="margin-top:0.75rem" @click="pickerFor = pickerFor === slider.id ? '' : slider.id">
                {{ pickerFor === slider.id ? 'Fermer la médiathèque' : 'Choisir dans la médiathèque' }}
              </button>
              <div v-if="pickerFor === slider.id" class="logo-picker">
                <p v-if="!imageMedia.length" class="admin-empty-hint">Aucune image dans la médiathèque.</p>
                <button
                  v-for="m in imageMedia"
                  :key="m.id"
                  class="logo-picker__item"
                  :title="m.originalName"
                  @click="addLogo(slider, m.url, m.originalName)"
                >
                  <img :src="resolveMediaUrl(m.url)" :alt="m.originalName" />
                </button>
              </div>
            </div>
          </template>
        </draggable>

        <button class="btn-add slider-add-bottom" @click="addSlider">+ Ajouter un slider</button>
        <button class="btn btn-primary btn-save" @click="saveContent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
            Enregistrer
          </button>
      </div>

      <!-- ===========================
           ONGLET : Contact & EmailJS
           =========================== -->
      <div v-if="activeTab === 'contact'" class="admin-panel">
        <div class="admin-section">
          <h3>Textes de la section</h3>
          <div class="form-group">
            <label>Sur-titre</label>
            <input v-model="localContent.contact.eyebrow" type="text" class="form-control" placeholder="Nous contacter" />
          </div>
          <div class="form-group">
            <label>Titre</label>
            <input v-model="localContent.contact.title" type="text" class="form-control" />
          </div>
          <div class="form-group">
            <label>Sous-titre</label>
            <textarea v-model="localContent.contact.subtitle" class="form-control" rows="3"></textarea>
          </div>
        </div>
        <div class="admin-section">
          <h3>Configuration EmailJS</h3>
          <p class="admin-hint">Créez un compte sur <a href="https://emailjs.com" target="_blank">emailjs.com</a>, créez un service et un template, puis renseignez les IDs ci-dessous.</p>
          <div class="admin-grid-3">
            <div class="form-group">
              <label>Service ID</label>
              <input v-model="localContent.contact.emailjs.serviceId" type="text" class="form-control" placeholder="service_xxxxxxx" />
            </div>
            <div class="form-group">
              <label>Template ID</label>
              <input v-model="localContent.contact.emailjs.templateId" type="text" class="form-control" placeholder="template_xxxxxxx" />
            </div>
            <div class="form-group">
              <label>Public Key</label>
              <input v-model="localContent.contact.emailjs.publicKey" type="text" class="form-control" placeholder="xxxxxxxxxxxx" />
            </div>
          </div>
        </div>
        <div class="admin-section">
          <h3>Carte coordonnées & horaires</h3>
          <p class="admin-section-hint">Téléphone, email et adresse sont ceux de l'onglet <strong>Configuration → Coordonnées</strong> (source unique).</p>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>Titre de la carte</label>
              <input v-model="localContent.contact.cardTitle" type="text" class="form-control" placeholder="Nos coordonnées" />
            </div>
            <div class="form-group">
              <label>Libellé de l'adresse</label>
              <input v-model="localContent.contact.addressLabel" type="text" class="form-control" placeholder="Adresse" />
            </div>
            <div class="form-group">
              <label>Titre des horaires</label>
              <input v-model="localContent.contact.hoursTitle" type="text" class="form-control" placeholder="Horaires d'ouverture" />
            </div>
          </div>
          <div class="form-group">
            <label>Horaires (une ligne par horaire, vide = bloc masqué)</label>
            <textarea v-model="localContent.contact.hours" class="form-control" rows="4"
              placeholder="Lundi — Vendredi : 9h00 — 18h00"></textarea>
          </div>
        </div>

        <div class="admin-section">
          <h3>Formulaire de contact</h3>
          <p class="admin-section-hint">Les sujets proposés sont les expertises visibles, suivis de l'option « autre ». L'astérisque des champs obligatoires est ajouté automatiquement.</p>
          <div class="admin-grid-2">
            <div class="form-group"><label>Libellé — Nom</label><input v-model="localContent.contact.form.nameLabel" type="text" class="form-control" /></div>
            <div class="form-group"><label>Exemple — Nom</label><input v-model="localContent.contact.form.namePlaceholder" type="text" class="form-control" /></div>
            <div class="form-group"><label>Libellé — Email</label><input v-model="localContent.contact.form.emailLabel" type="text" class="form-control" /></div>
            <div class="form-group"><label>Exemple — Email</label><input v-model="localContent.contact.form.emailPlaceholder" type="text" class="form-control" /></div>
            <div class="form-group"><label>Libellé — Téléphone</label><input v-model="localContent.contact.form.phoneLabel" type="text" class="form-control" /></div>
            <div class="form-group"><label>Exemple — Téléphone</label><input v-model="localContent.contact.form.phonePlaceholder" type="text" class="form-control" /></div>
            <div class="form-group"><label>Libellé — Sujet</label><input v-model="localContent.contact.form.subjectLabel" type="text" class="form-control" /></div>
            <div class="form-group"><label>Choix par défaut — Sujet</label><input v-model="localContent.contact.form.subjectPlaceholder" type="text" class="form-control" /></div>
            <div class="form-group"><label>Option « autre » (vide = masquée)</label><input v-model="localContent.contact.form.otherSubject" type="text" class="form-control" /></div>
            <div class="form-group"><label>Libellé — Message</label><input v-model="localContent.contact.form.messageLabel" type="text" class="form-control" /></div>
            <div class="form-group"><label>Bouton d'envoi</label><input v-model="localContent.contact.form.submitText" type="text" class="form-control" /></div>
            <div class="form-group"><label>Bouton pendant l'envoi</label><input v-model="localContent.contact.form.sendingText" type="text" class="form-control" /></div>
          </div>
          <div class="form-group"><label>Exemple — Message</label><input v-model="localContent.contact.form.messagePlaceholder" type="text" class="form-control" /></div>
          <div class="form-group"><label>Message de succès</label><textarea v-model="localContent.contact.form.successMessage" class="form-control" rows="2"></textarea></div>
          <div class="form-group"><label>Message d'erreur d'envoi</label><textarea v-model="localContent.contact.form.errorMessage" class="form-control" rows="2"></textarea></div>
          <div class="form-group"><label>Message « champs obligatoires »</label><textarea v-model="localContent.contact.form.requiredMessage" class="form-control" rows="2"></textarea></div>
          <div class="form-group"><label>Message « formulaire non configuré » (EmailJS absent)</label><textarea v-model="localContent.contact.form.notConfiguredMessage" class="form-control" rows="2"></textarea></div>
        </div>

        <div class="admin-section">
          <h3>Apparence</h3>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>Couleur de fond</label>
              <div class="color-picker-row">
                <input type="color" v-model="localContent.contact.bgColor" class="color-input" />
                <input type="text" v-model="localContent.contact.bgColor" class="form-control form-control--sm" />
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-primary btn-save" @click="saveContent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
            Enregistrer
          </button>
      </div>

      <!-- ===========================
           ONGLET : SEO
           =========================== -->
      <div v-if="activeTab === 'seo'" class="admin-panel">
        <div class="admin-section">
          <h3>Référencement (SEO & GEO)</h3>
          <div class="form-group">
            <label>Titre de la page (balise title)</label>
            <input v-model="localSeo.title" type="text" class="form-control" />
            <span class="form-hint">{{ localSeo.title.length }}/60 caractères recommandés</span>
          </div>
          <div class="form-group">
            <label>Description méta</label>
            <textarea v-model="localSeo.description" class="form-control" rows="3"></textarea>
            <span class="form-hint">{{ localSeo.description.length }}/160 caractères recommandés</span>
          </div>
          <div class="form-group">
            <label>Mots-clés</label>
            <input v-model="localSeo.keywords" type="text" class="form-control" placeholder="family office, conseil en gestion de patrimoine, CGP Grenoble, ..." />
          </div>
          <div class="form-group">
            <label>URL canonique</label>
            <input v-model="localSeo.canonicalUrl" type="url" class="form-control" placeholder="https://cabinet-oefic.fr" />
          </div>
          <div class="form-group">
            <label>Image Open Graph (URL)</label>
            <input v-model="localSeo.ogImage" type="url" class="form-control" placeholder="/assets/og-image.jpg" />
          </div>
        </div>
        <button class="btn btn-primary btn-save" @click="saveSeo">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
            Enregistrer
          </button>
      </div>

      <!-- ===========================
           ONGLET : Tracking & Cookies
           =========================== -->
      <div v-if="activeTab === 'tracking'" class="admin-panel">
        <div class="admin-section">
          <h3>Google Tag Manager</h3>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>GTM ID</label>
              <input v-model="localTracking.gtmId" type="text" class="form-control" placeholder="GTM-XXXX" />
            </div>
            <div class="form-group">
              <label>Activer</label>
              <label class="toggle toggle--block">
                <input type="checkbox" v-model="localTracking.enabledServices.googletagmanager" />
                <span>Google Tag Manager</span>
              </label>
            </div>
          </div>
        </div>
        <div class="admin-section">
          <h3>Google Analytics</h3>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>GA4 Measurement ID</label>
              <input v-model="localTracking.ga4Id" type="text" class="form-control" placeholder="G-XXXXXXXXX" />
            </div>
            <div class="form-group">
              <label>Universal Analytics (UA)</label>
              <input v-model="localTracking.uaId" type="text" class="form-control" placeholder="UA-XXXXXXXX-X" />
            </div>
          </div>
          <div class="tracking-toggles">
            <label class="toggle">
              <input type="checkbox" v-model="localTracking.enabledServices.gtag" />
              <span>GA4 (gtag)</span>
            </label>
            <label class="toggle">
              <input type="checkbox" v-model="localTracking.enabledServices.analytics" />
              <span>Universal Analytics</span>
            </label>
          </div>
        </div>
        <div class="admin-section">
          <h3>Matomo</h3>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>URL Matomo</label>
              <input v-model="localTracking.matomoUrl" type="url" class="form-control" placeholder="https://matomo.exemple.fr" />
            </div>
            <div class="form-group">
              <label>Site ID</label>
              <input v-model="localTracking.matomoSiteId" type="text" class="form-control" placeholder="1" />
            </div>
            <div class="form-group">
              <label>Matomo Tag Manager URL</label>
              <input v-model="localTracking.matomoTagManagerUrl" type="url" class="form-control" />
            </div>
          </div>
          <div class="tracking-toggles">
            <label class="toggle">
              <input type="checkbox" v-model="localTracking.enabledServices.matomo" />
              <span>Matomo</span>
            </label>
            <label class="toggle">
              <input type="checkbox" v-model="localTracking.enabledServices.matomotm" />
              <span>Matomo Tag Manager</span>
            </label>
          </div>
        </div>
        <div class="admin-section">
          <h3>Google Maps</h3>
          <div class="form-group">
            <label>Clé API Google Maps</label>
            <input v-model="localTracking.googleMapsKey" type="text" class="form-control" />
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="localTracking.enabledServices.googlemaps" />
            <span>Activer Google Maps</span>
          </label>
        </div>
        <div class="admin-section">
          <h3>Réseaux sociaux</h3>
          <div class="form-group">
            <label>TikTok Pixel ID</label>
            <input v-model="localTracking.tiktokId" type="text" class="form-control" />
          </div>
          <div class="tracking-toggles">
            <label class="toggle">
              <input type="checkbox" v-model="localTracking.enabledServices.facebook" />
              <span>Facebook Pixel</span>
            </label>
            <label class="toggle">
              <input type="checkbox" v-model="localTracking.enabledServices.twitter" />
              <span>Twitter/X</span>
            </label>
            <label class="toggle">
              <input type="checkbox" v-model="localTracking.enabledServices.tiktok" />
              <span>TikTok</span>
            </label>
          </div>
        </div>
        <button class="btn btn-primary btn-save" @click="saveTracking">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
            Enregistrer
          </button>
      </div>

      <!-- ===========================
           ONGLET : Médias
           =========================== -->
      <div v-if="activeTab === 'media'" class="admin-panel">
        <div class="admin-section">
          <h3>Uploader un fichier</h3>
          <div
            class="upload-zone"
            @dragover.prevent="dragOver = true"
            @dragleave="dragOver = false"
            @drop.prevent="handleDrop"
            :class="{ 'upload-zone--active': dragOver }"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="40" height="40">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p>Glissez un fichier ici ou <label class="upload-browse">cliquez pour parcourir<input type="file" accept="image/*,video/*" @change="handleFileInput" hidden /></label></p>
            <span class="upload-hint">Images (JPG, PNG, WebP, SVG) et vidéos (MP4, WebM) — max 50 Mo</span>
          </div>
          <div v-if="uploading" class="upload-progress">Upload en cours...</div>
        </div>

        <div class="admin-section">
          <h3>Bibliothèque de médias ({{ mediaFiles.length }} fichiers)</h3>
          <div class="media-grid">
            <div v-for="file in mediaFiles" :key="file.id" class="media-item">
              <div class="media-item__preview">
                <img v-if="isImage(file)" :src="file.url" :alt="file.originalName" />
                <div v-else class="media-item__video-icon">🎬</div>
              </div>
              <div class="media-item__info">
                <span class="media-item__name">{{ file.originalName }}</span>
                <span class="media-item__size">{{ formatSize(file.size) }}</span>
              </div>
              <div class="media-item__actions">
                <button class="media-btn" @click="copyUrl(file.url)" title="Copier l'URL">📋</button>
                <button class="media-btn media-btn--danger" @click="deleteMedia(file.id)" title="Supprimer">🗑</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===========================
           ONGLET : Mot de passe
           =========================== -->
      <div v-if="activeTab === 'password'" class="admin-panel">
        <div class="admin-section">
          <h3>Changer le mot de passe</h3>
          <div class="form-group">
            <label>Mot de passe actuel</label>
            <input v-model="pwForm.current" type="password" class="form-control" />
          </div>
          <div class="form-group">
            <label>Nouveau mot de passe</label>
            <input v-model="pwForm.newPw" type="password" class="form-control" />
          </div>
          <div class="form-group">
            <label>Confirmer le nouveau mot de passe</label>
            <input v-model="pwForm.confirm" type="password" class="form-control" />
          </div>
          <div v-if="pwError" class="contact__feedback contact__feedback--error">{{ pwError }}</div>
          <div v-if="pwSuccess" class="contact__feedback contact__feedback--success">{{ pwSuccess }}</div>
          <button class="btn btn-primary" @click="changePassword">Modifier le mot de passe</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import draggable from 'vuedraggable'
import { useSiteConfigStore } from '@/stores/siteConfig'
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/composables/useApi'
import type { SiteConfig, SiteContent, SeoConfig, TrackingConfig, MediaFile, LogoSlider } from '@/types'
import FontPicker from '@/components/admin/FontPicker.vue'
import { resolveAssetUrl, resolveMediaUrl } from '@/utils/asset'

const siteUrl = import.meta.env.BASE_URL

const router = useRouter()
const store = useSiteConfigStore()
const auth = useAuthStore()
const api = useApi()

const { config, content, seo, tracking } = storeToRefs(store)

const activeTab = ref('config')
const sidebarOpen = ref(false)
const saveMessage = ref('')

function selectTab(id: string) {
  activeTab.value = id
  sidebarOpen.value = false
}
const saveType = ref<'ok' | 'err'>('ok')
const dragOver = ref(false)
const uploading = ref(false)
const mediaFiles = ref<MediaFile[]>([])

// Deep clones réactifs
const localConfig = reactive<SiteConfig>(JSON.parse(JSON.stringify(config.value || {
  siteName: 'Cabinet OEFIC',
  slogan: '',
  logoUrl: '/assets/logo.png',
  colors: { bg: '#FFFFFF', bgSoft: '#F5F5F7', text: '#1e1a34', gold: '#C9A84C', goldDark: '#A8873E' },
  fonts: { heading: 'Playfair Display', body: 'Inter', weights: ['400', '600', '700'] },
  socialLinks: {},
  legalInfo: { orias: '', cif: '', cifAssociation: '', coa: '', iobsp: '', carteT: '', rcPro: '', rcProInsurer: '', mediator: '', rcs: '', tvaIntra: '', siret: '', address: '', city: '', phone: '', email: '' }
})))

const localContent = reactive<SiteContent>(JSON.parse(JSON.stringify(content.value || {})))
// Contenu enregistré avant l'ajout de la section Family Office
if (!localContent.familyOffice) {
  localContent.familyOffice = {
    eyebrow: 'Family Office', title: '', text: '', pillars: [], stepsTitle: 'Notre méthode',
    steps: [], ctaText: '', ctaLink: '#contact', bgColor: ''
  }
}
if (!localContent.sectionsVisible) localContent.sectionsVisible = {}
if (localContent.sectionsVisible.familyOffice === undefined) {
  localContent.sectionsVisible.familyOffice = true
}
const localSeo = reactive<SeoConfig>(JSON.parse(JSON.stringify(seo.value || { title: '', description: '', keywords: '', ogImage: '', canonicalUrl: '' })))
const localTracking = reactive<TrackingConfig>(JSON.parse(JSON.stringify(tracking.value || { gtmId: '', ga4Id: '', uaId: '', matomoUrl: '', matomoSiteId: '', matomoTagManagerUrl: '', tiktokId: '', googleMapsKey: '', enabledServices: {} })))

// Formulaire mot de passe
const pwForm = reactive({ current: '', newPw: '', confirm: '' })
const pwError = ref('')
const pwSuccess = ref('')

const tabs = [
  { id: 'config', label: 'Configuration', icon: '⚙️' },
  { id: 'nav', label: 'Menu', icon: '☰' },
  { id: 'hero', label: 'Hero', icon: '🖼' },
  { id: 'services', label: 'Expertises', icon: '🏛' },
  { id: 'familyOffice', label: 'Family Office', icon: '👪' },
  { id: 'about', label: 'À propos', icon: '📖' },
  { id: 'stats', label: 'Statistiques', icon: '📊' },
  { id: 'sliders', label: 'Slider', icon: '🎞' },
  { id: 'contact', label: 'Contact / EmailJS', icon: '✉️' },
  { id: 'seo', label: 'SEO', icon: '🔍' },
  { id: 'tracking', label: 'Tracking & Cookies', icon: '📍' },
  { id: 'media', label: 'Médias', icon: '🖼' },
  { id: 'password', label: 'Mot de passe', icon: '🔐' }
]

const textVarList = [
  { key: 'nom_cabinet', label: 'Nom du cabinet (Configuration)' },
  { key: 'annee_creation', label: 'Année de création (Configuration)' },
  { key: 'anciennete', label: "Années d'expertise (Configuration)" },
  { key: 'nb_expertises', label: 'Nombre d\'expertises visibles (automatique)' },
  { key: 'annee_courante', label: 'Année en cours (automatique)' },
  { key: 'telephone', label: 'Téléphone (Configuration)' },
  { key: 'email', label: 'Email (Configuration)' },
  { key: 'ville', label: 'Ville (Configuration)' }
]

function statPreview(stat: { value: number; suffix: string; source?: string }): string {
  if (stat.source === 'anciennete') return `${localConfig.yearsOfExpertise}${stat.suffix}`
  if (stat.source === 'nb_expertises') return `${localContent.services.filter(s => s.visible).length}${stat.suffix}`
  return `${stat.value}${stat.suffix}`
}

const currentTabLabel = computed(() => tabs.find(t => t.id === activeTab.value)?.label || '')

function showSave(msg: string, type: 'ok' | 'err' = 'ok') {
  saveMessage.value = msg
  saveType.value = type
  setTimeout(() => { saveMessage.value = '' }, 6000)
}

async function saveConfigAndFooter() {
  try {
    await Promise.all([
      store.updateConfig(localConfig),
      store.updateContent(localContent)
    ])
    showSave('✓ Configuration enregistrée')
  } catch (e) {
    showSave('Erreur : ' + (e as Error).message, 'err')
  }
}

async function saveConfig() {
  try {
    await store.updateConfig(localConfig)
    showSave('✓ Configuration enregistrée')
  } catch (e) {
    showSave('Erreur : ' + (e as Error).message, 'err')
  }
}

async function saveContent() {
  try {
    await store.updateContent(localContent)
    showSave('✓ Contenu enregistré')
  } catch (e) {
    showSave('Erreur : ' + (e as Error).message, 'err')
  }
}

async function saveSeo() {
  try {
    await store.updateSeo(localSeo)
    showSave('✓ SEO enregistré')
  } catch (e) {
    showSave('Erreur : ' + (e as Error).message, 'err')
  }
}

async function saveTracking() {
  try {
    await store.updateTracking(localTracking)
    showSave('✓ Tracking enregistré')
  } catch (e) {
    showSave('Erreur : ' + (e as Error).message, 'err')
  }
}

function addService() {
  localContent.services.push({
    id: Math.random().toString(36).slice(2),
    title: 'Nouvelle expertise',
    description: '',
    icon: 'patrimoine',
    bgColor: '',
    link: '',
    order: localContent.services.length + 1,
    visible: true
  })
}

// Piliers et étapes n'ont pas d'id persistant : clé stable par objet pour le drag & drop
const foKeys = new WeakMap<object, string>()
function foItemKey(item: object): string {
  let key = foKeys.get(item)
  if (!key) {
    key = Math.random().toString(36).slice(2)
    foKeys.set(item, key)
  }
  return key
}

function removeService(i: number) {
  localContent.services.splice(i, 1)
}

function addMilestone() {
  localContent.about.milestones.push({ year: '', label: '' })
}

function addLegalLink() {
  if (!localContent.footer.legalLinks) localContent.footer.legalLinks = []
  localContent.footer.legalLinks.push({ label: '', href: '' })
}

// Médias
async function loadMedia() {
  try {
    mediaFiles.value = await api.get<MediaFile[]>('/media')
  } catch {}
}

async function sendToMedia(file: File): Promise<MediaFile | null> {
  const formData = new FormData()
  formData.append('file', file)
  const token = localStorage.getItem('oefic_admin_token')
  const res = await fetch('/api/media/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  })
  if (!res.ok) return null
  const f = await res.json() as MediaFile
  mediaFiles.value.unshift(f)
  return f
}

async function uploadFile(file: File) {
  uploading.value = true
  const f = await sendToMedia(file)
  if (f) showSave('✓ Fichier uploadé : ' + f.originalName)
  else showSave('Erreur lors de l\'upload', 'err')
  uploading.value = false
}

// ---------------------------------------------------------------------------
// Slider : blocs de logos indépendants
// ---------------------------------------------------------------------------
const pickerFor = ref('')
const dropTarget = ref('')
const uploadingSlider = ref('')
const imageMedia = computed(() => mediaFiles.value.filter(f => /image/.test(f.mimetype)))

if (!localContent.sliders) localContent.sliders = []

function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function addSlider() {
  localContent.sliders.push({
    id: newId(), eyebrow: '', title: 'Nouveau slider', subtitle: '', visible: true,
    mode: 'continuous', speed: 30, interval: 3, reverse: false, grayscale: true, bgColor: '', logos: []
  })
}

function removeSlider(i: number) {
  const slider = localContent.sliders[i]
  if (slider.logos.length && !confirm(`Supprimer le slider « ${slider.title} » et ses ${slider.logos.length} logo(s) ?`)) return
  localContent.sliders.splice(i, 1)
}

function addLogo(slider: LogoSlider, url: string, fileName: string) {
  slider.logos.push({ id: newId(), name: fileName.replace(/\.[^.]+$/, ''), url, link: '' })
}

async function uploadLogos(slider: LogoSlider, files: FileList | File[]) {
  const images = Array.from(files).filter(f => f.type.startsWith('image/'))
  if (!images.length) return
  uploadingSlider.value = slider.id
  let ok = 0
  for (const file of images) {
    const media = await sendToMedia(file)
    if (media) {
      addLogo(slider, media.url, media.originalName)
      ok++
    }
  }
  uploadingSlider.value = ''
  if (ok === images.length) showSave(`✓ ${ok} logo(s) ajouté(s) — pensez à enregistrer`)
  else showSave(`${ok}/${images.length} logo(s) importé(s), certains fichiers ont été refusés`, 'err')
}

function onLogoInput(e: Event, slider: LogoSlider) {
  const input = e.target as HTMLInputElement
  if (input.files) uploadLogos(slider, input.files)
  input.value = ''
}

function onFileDragOver(e: DragEvent, id: string) {
  // Ne réagit qu'aux fichiers venant de l'ordinateur, pas au glisser-déposer des logos
  if (e.dataTransfer?.types.includes('Files')) dropTarget.value = id
}

function onFileDrop(e: DragEvent, slider: LogoSlider) {
  dropTarget.value = ''
  const files = e.dataTransfer?.files
  if (files?.length) uploadLogos(slider, files)
}

function handleDrop(e: DragEvent) {
  dragOver.value = false
  const file = e.dataTransfer?.files[0]
  if (file) uploadFile(file)
}

function handleFileInput(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) uploadFile(file)
}

async function deleteMedia(id: string) {
  if (!confirm('Supprimer ce fichier ?')) return
  await api.del(`/media/${id}`)
  mediaFiles.value = mediaFiles.value.filter(f => f.id !== id)
}

function copyUrl(url: string) {
  navigator.clipboard.writeText(url)
  showSave('✓ URL copiée dans le presse-papier')
}

function isImage(file: MediaFile) {
  return /image/.test(file.mimetype)
}

function formatSize(bytes: number) {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} Mo`
  return `${Math.round(bytes / 1024)} Ko`
}

// Mot de passe
async function changePassword() {
  pwError.value = ''
  pwSuccess.value = ''
  if (pwForm.newPw !== pwForm.confirm) {
    pwError.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  try {
    await auth.changePassword(pwForm.current, pwForm.newPw)
    pwSuccess.value = 'Mot de passe modifié avec succès.'
    Object.assign(pwForm, { current: '', newPw: '', confirm: '' })
  } catch (e) {
    pwError.value = (e as Error).message
  }
}

function handleLogout() {
  auth.logout()
  router.push({ name: 'admin-login' })
}

onMounted(() => {
  loadMedia()
})
</script>

<style scoped>
/* ===========================
   Layout Admin
   =========================== */
.admin {
  display: flex;
  min-height: 100vh;
  background: #f0f0f5;
  font-family: var(--font-body);
}

.slider-editor {
  margin-bottom: 1.25rem;
}

.slider-timing {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  padding: 1rem;
  margin: 0.5rem 0 0.75rem;
  background: #f5f5f7;
  border-radius: 10px;
}

.slider-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  align-items: center;
}

.slider-add-bottom {
  display: block;
  margin: 0 0 1.25rem;
}

.logo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.logo-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: #fff;
  border: 1px solid #e5e5ea;
  border-radius: 10px;
  padding: 0.6rem;
}

.logo-card__img {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  border-radius: 6px;
  cursor: grab;
}

.logo-card__img img {
  max-height: 56px;
  max-width: 100%;
  object-fit: contain;
  pointer-events: none;
}

.logo-card__delete {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: rgba(220, 38, 38, 0.9);
  color: #fff;
  cursor: pointer;
  line-height: 1;
}

.logo-card--add {
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 150px;
  border: 2px dashed rgba(201, 168, 76, 0.5);
  color: var(--color-gold-dark);
  font-weight: 600;
  cursor: pointer;
}

.logo-card--add small {
  font-weight: 400;
  color: var(--color-text-muted);
}

.logo-drop--active {
  outline: 2px dashed var(--color-gold);
  outline-offset: 4px;
}

.logo-picker {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 0.5rem;
  margin-top: 0.75rem;
  max-height: 260px;
  overflow-y: auto;
  padding: 0.5rem;
  background: #fff;
  border-radius: 8px;
}

.logo-picker__item {
  height: 70px;
  border: 1px solid #e5e5ea;
  border-radius: 6px;
  background: #fafafa;
  cursor: pointer;
  padding: 0.4rem;
}

.logo-picker__item:hover {
  border-color: var(--color-gold);
}

.logo-picker__item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.admin-vars {
  background: #fff;
  border: 1px solid rgba(201, 168, 76, 0.4);
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
}

.admin-vars summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--color-gold-dark);
}

.admin-vars p {
  margin: 0.75rem 0 0.5rem;
  color: var(--color-text-muted);
}

.admin-vars ul {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 0.35rem 1.5rem;
}

.admin-vars li {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
  flex-wrap: wrap;
}

.admin-vars em {
  color: var(--color-text-muted);
}

.admin-vars code,
.admin-section-hint code,
.form-group label code {
  background: rgba(201, 168, 76, 0.12);
  color: var(--color-gold-dark);
  padding: 0 0.35rem;
  border-radius: 4px;
  font-size: 0.8em;
}

.fo-item-editor .service-editor__num {
  white-space: nowrap;
}

.fo-item-editor {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
}

/* Sidebar */
.admin-sidebar {
  width: 240px;
  background: var(--color-text);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 10;
}

.admin-sidebar__logo {
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.admin-sidebar__logo img {
  height: 40px;
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

.admin-sidebar__nav {
  flex: 1;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.admin-sidebar__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  color: rgba(255,255,255,0.6);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  border: none;
  background: none;
  font-family: inherit;
  width: 100%;
}

.admin-sidebar__item:hover {
  color: #fff;
  background: rgba(255,255,255,0.05);
}

.admin-sidebar__item--active {
  color: var(--color-gold) !important;
  background: rgba(201,168,76,0.1) !important;
  border-left: 3px solid var(--color-gold);
  padding-left: calc(1.25rem - 3px);
}

.admin-sidebar__icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.admin-sidebar__bottom {
  padding: 1rem;
  border-top: 1px solid rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.admin-sidebar__preview,
.admin-sidebar__logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  font-size: 0.825rem;
  color: rgba(255,255,255,0.5);
  transition: all 0.2s ease;
  cursor: pointer;
  font-family: inherit;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.admin-sidebar__preview:hover {
  color: var(--color-gold);
  background: rgba(201,168,76,0.1);
}

.admin-sidebar__logout:hover {
  color: #f87171;
  background: rgba(239,68,68,0.1);
}

/* Main */
.admin-main {
  flex: 1;
  margin-left: 240px;
  padding: 2rem;
  min-height: 100vh;
}

.admin-main__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 2px solid #e5e5ea;
}

.admin-main__header h1 {
  font-size: 1.5rem;
  color: var(--color-text);
}

.save-msg {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.save-msg--ok {
  background: rgba(34,197,94,0.1);
  color: #15803d;
}

.save-msg--err {
  background: rgba(239,68,68,0.1);
  color: #dc2626;
}

/* Bouton enregistrer compact */
.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1.1rem;
  font-size: 0.8rem;
  margin-top: 1.5rem;
  width: fit-content;
  align-self: flex-start;
}

/* Toast fixe */
.admin-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  pointer-events: none;
}

.admin-toast--ok {
  background: #fff;
  color: #15803d;
  border: 1px solid rgba(34,197,94,0.3);
}

.admin-toast--err {
  background: #fff;
  color: #dc2626;
  border: 1px solid rgba(239,68,68,0.3);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* Panel */
.admin-panel {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.admin-section {
  background: #fff;
  border-radius: 16px;
  padding: 1.75rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e5e5ea;
}

.admin-section h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f5;
}

.admin-section-hint {
  font-size: 0.8rem;
  color: rgba(30,26,52,0.45);
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

.admin-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f5;
}

.admin-section__header h3 {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.admin-hint {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}

.admin-hint a {
  color: var(--color-gold);
  font-weight: 600;
}

/* Grids */
.admin-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.admin-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.25rem;
}

/* Color picker */
.color-picker-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.color-input {
  width: 44px;
  height: 44px;
  border: 2px solid var(--color-border);
  border-radius: 10px;
  cursor: pointer;
  padding: 2px;
  background: transparent;
  flex-shrink: 0;
}

.form-control--sm {
  flex: 1;
}

.form-hint {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}

/* Toggle */
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.toggle--block {
  display: flex;
  padding: 0.75rem;
  background: #f5f5f7;
  border-radius: 10px;
}

.toggle input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--color-gold);
  cursor: pointer;
}

/* Service editor */
.services-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.service-editor {
  background: #f5f5f7;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e5e5ea;
}

.service-editor__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.drag-handle {
  cursor: grab;
  color: #aaa;
  font-size: 1.2rem;
  user-select: none;
}

.service-editor__num {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

/* Stat editor */
.stat-editor {
  padding: 1rem;
  background: #f5f5f7;
  border-radius: 10px;
  margin-bottom: 0.75rem;
  border: 1px solid #e5e5ea;
}

/* Milestone */
.milestone-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.milestone-row .form-control {
  flex: 1;
}

/* Footer link rows */
.link-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.link-row .form-control {
  flex: 1;
}

.link-row .form-control--sm {
  flex: 0 0 160px;
}

.form-label-bold {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
}

.admin-empty-hint {
  font-size: 0.82rem;
  color: rgba(30,26,52,0.35);
  font-style: italic;
  padding: 0.5rem 0;
}

.admin-section--info {
  background: rgba(201,168,76,0.06);
  border-color: rgba(201,168,76,0.2);
}

.admin-section--info h3 {
  color: var(--color-gold, #C9A84C);
  border-bottom-color: rgba(201,168,76,0.2);
}

/* Tracking toggles */
.tracking-toggles {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.75rem;
}

/* Buttons */
.btn-add {
  background: var(--color-gold-light, rgba(201,168,76,0.12));
  color: var(--color-gold-dark);
  border: 1px solid rgba(201,168,76,0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add:hover {
  background: var(--color-gold);
  color: #fff;
  border-color: var(--color-gold);
}

.btn-delete {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(239,68,68,0.1);
  color: #dc2626;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  transition: background 0.2s ease;
}

.btn-delete:hover {
  background: rgba(239,68,68,0.2);
}

/* Upload zone */
.upload-zone {
  border: 2px dashed var(--color-border);
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  color: var(--color-text-muted);
  transition: all 0.2s ease;
  cursor: pointer;
}

.upload-zone--active {
  border-color: var(--color-gold);
  background: rgba(201,168,76,0.05);
}

.upload-zone svg {
  color: var(--color-gold);
  margin: 0 auto 1rem;
}

.upload-zone p {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.upload-browse {
  color: var(--color-gold);
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.upload-hint {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.upload-progress {
  text-align: center;
  color: var(--color-gold);
  font-weight: 600;
  padding: 1rem;
}

/* Media grid */
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.media-item {
  background: #f5f5f7;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e5ea;
  transition: all 0.2s ease;
}

.media-item:hover {
  border-color: var(--color-gold);
  box-shadow: 0 4px 16px rgba(201,168,76,0.15);
}

.media-item__preview {
  height: 110px;
  overflow: hidden;
  background: #e5e5ea;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-item__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-item__video-icon {
  font-size: 2rem;
}

.media-item__info {
  padding: 0.625rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.media-item__name {
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.media-item__size {
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

.media-item__actions {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0.625rem;
  border-top: 1px solid #e5e5ea;
}

.media-btn {
  flex: 1;
  padding: 0.25rem;
  border-radius: 6px;
  background: transparent;
  border: 1px solid #e5e5ea;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: center;
}

.media-btn:hover {
  background: var(--color-gold-light, rgba(201,168,76,0.1));
}

.media-btn--danger:hover {
  background: rgba(239,68,68,0.1);
}

/* Feedback classes from global */
.contact__feedback {
  padding: 1rem 1.25rem;
  border-radius: 10px;
  margin: 1rem 0;
  font-size: 0.9rem;
  font-weight: 500;
}

.contact__feedback--success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #15803d;
}

.contact__feedback--error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #dc2626;
}

@media (max-width: 900px) {
  .admin-grid-2,
  .admin-grid-3 {
    grid-template-columns: 1fr;
  }
}

/* Overlay mobile */
.admin-overlay {
  display: none;
}

/* Bouton fermer dans sidebar (caché desktop) */
.admin-sidebar__close {
  display: none;
}

/* Top bar mobile (cachée desktop) */
.admin-topbar {
  display: none;
}

@media (max-width: 768px) {
  /* Overlay */
  .admin-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 19;
  }

  /* Sidebar en drawer */
  .admin-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 260px;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 20;
  }

  .admin-sidebar--open {
    transform: translateX(0);
  }

  .admin-sidebar__logo {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .admin-sidebar__close {
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.6);
    padding: 0.25rem;
    border-radius: 6px;
    transition: color 0.2s;
  }

  .admin-sidebar__close:hover {
    color: #fff;
  }

  /* Top bar */
  .admin-topbar {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--color-text);
    padding: 0.75rem 1rem;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .admin-topbar__burger {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 4px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .admin-topbar__burger span {
    display: block;
    width: 22px;
    height: 2px;
    background: #fff;
    border-radius: 1px;
  }

  .admin-topbar__title {
    font-size: 0.95rem;
    font-weight: 600;
    color: #fff;
    flex: 1;
  }

  .admin-topbar__save {
    font-size: 0.8rem;
  }

  /* Masquer le header desktop sur mobile */
  .admin-main__header {
    display: none;
  }

  .admin-main {
    margin-left: 0;
    padding: 1rem;
    min-height: auto;
  }
}
</style>
