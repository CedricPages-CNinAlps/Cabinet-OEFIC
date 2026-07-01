<template>
  <div class="admin">
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="admin-sidebar__logo">
        <img src="/assets/logo.png" alt="OEFIC" />
      </div>
      <nav class="admin-sidebar__nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="admin-sidebar__item"
          :class="{ 'admin-sidebar__item--active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="admin-sidebar__icon" v-html="tab.icon"></span>
          <span>{{ tab.label }}</span>
        </button>
      </nav>
      <div class="admin-sidebar__bottom">
        <a href="/" target="_blank" class="admin-sidebar__preview">
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
      <div class="admin-main__header">
        <h1>{{ currentTabLabel }}</h1>
        <div class="admin-main__save" v-if="saveMessage">
          <span :class="`save-msg save-msg--${saveType}`">{{ saveMessage }}</span>
        </div>
      </div>

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
          </div>
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
          <h3>Informations légales & Contact</h3>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>N° ORIAS</label>
              <input v-model="localConfig.legalInfo.orias" type="text" class="form-control" placeholder="00 00 00 00" />
            </div>
            <div class="form-group">
              <label>SIRET</label>
              <input v-model="localConfig.legalInfo.siret" type="text" class="form-control" />
            </div>
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
              placeholder="Cabinet spécialisé en gestion de patrimoine depuis 1984..."></textarea>
          </div>

          <div class="admin-section__header" style="margin-top:1.25rem">
            <label class="form-label-bold">Liens de navigation</label>
            <button class="btn-add" @click="addQuickLink">+ Ajouter</button>
          </div>
          <div v-for="(link, i) in localContent.footer.quickLinks" :key="i" class="link-row">
            <input v-model="link.label" type="text" class="form-control form-control--sm" placeholder="Libellé" />
            <input v-model="link.href" type="text" class="form-control" placeholder="#section ou /page" />
            <button class="btn-delete" @click="localContent.footer.quickLinks.splice(i, 1)">×</button>
          </div>
          <p v-if="!localContent.footer.quickLinks?.length" class="admin-empty-hint">Aucun lien. Cliquez "+ Ajouter".</p>

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

        <button class="btn btn-primary" @click="saveConfigAndFooter">Enregistrer</button>
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
        <button class="btn btn-primary" @click="saveContent">Enregistrer</button>
      </div>

      <!-- ===========================
           ONGLET : Services
           =========================== -->
      <div v-if="activeTab === 'services'" class="admin-panel">
        <div class="admin-section">
          <div class="admin-section__header">
            <h3>Services ({{ localContent.services.length }})</h3>
            <button class="btn-add" @click="addService">+ Ajouter un service</button>
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
                  <span class="service-editor__num">Service {{ i + 1 }}</span>
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
                      <option value="patrimoine">🏛 Patrimoine</option>
                      <option value="investissement">📈 Investissement</option>
                      <option value="assurance">🛡 Assurance</option>
                      <option value="banque">🏦 Banque/Crédit</option>
                      <option value="fonds">💰 Levée de Fonds</option>
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
                    <label>Lien (optionnel)</label>
                    <input v-model="svc.link" type="text" class="form-control" placeholder="#contact" />
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
        <button class="btn btn-primary" @click="saveContent">Enregistrer</button>
      </div>

      <!-- ===========================
           ONGLET : À propos
           =========================== -->
      <div v-if="activeTab === 'about'" class="admin-panel">
        <div class="admin-section">
          <h3>Section À propos</h3>
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
        <button class="btn btn-primary" @click="saveContent">Enregistrer</button>
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
          <div v-for="(stat, i) in localContent.stats.stats" :key="stat.id" class="stat-editor">
            <div class="admin-grid-3">
              <div class="form-group">
                <label>Valeur</label>
                <input v-model.number="stat.value" type="number" class="form-control" />
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
        <button class="btn btn-primary" @click="saveContent">Enregistrer</button>
      </div>

      <!-- ===========================
           ONGLET : Contact & EmailJS
           =========================== -->
      <div v-if="activeTab === 'contact'" class="admin-panel">
        <div class="admin-section">
          <h3>Textes de la section</h3>
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
          <h3>Coordonnées affichées</h3>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>Téléphone</label>
              <input v-model="localContent.contact.phone" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="localContent.contact.email" type="email" class="form-control" />
            </div>
            <div class="form-group">
              <label>Adresse</label>
              <input v-model="localContent.contact.address" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label>Couleur de fond</label>
              <div class="color-picker-row">
                <input type="color" v-model="localContent.contact.bgColor" class="color-input" />
                <input type="text" v-model="localContent.contact.bgColor" class="form-control form-control--sm" />
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-primary" @click="saveContent">Enregistrer</button>
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
            <input v-model="localSeo.keywords" type="text" class="form-control" placeholder="gestion patrimoine, conseil financier, ..." />
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
        <button class="btn btn-primary" @click="saveSeo">Enregistrer</button>
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
        <button class="btn btn-primary" @click="saveTracking">Enregistrer</button>
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
import type { SiteConfig, SiteContent, SeoConfig, TrackingConfig, MediaFile } from '@/types'
import FontPicker from '@/components/admin/FontPicker.vue'

const router = useRouter()
const store = useSiteConfigStore()
const auth = useAuthStore()
const api = useApi()

const { config, content, seo, tracking } = storeToRefs(store)

const activeTab = ref('config')
const saveMessage = ref('')
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
  legalInfo: { orias: '', siret: '', address: '', city: '', phone: '', email: '' }
})))

const localContent = reactive<SiteContent>(JSON.parse(JSON.stringify(content.value || {})))
const localSeo = reactive<SeoConfig>(JSON.parse(JSON.stringify(seo.value || { title: '', description: '', keywords: '', ogImage: '', canonicalUrl: '' })))
const localTracking = reactive<TrackingConfig>(JSON.parse(JSON.stringify(tracking.value || { gtmId: '', ga4Id: '', uaId: '', matomoUrl: '', matomoSiteId: '', matomoTagManagerUrl: '', tiktokId: '', googleMapsKey: '', enabledServices: {} })))

// Formulaire mot de passe
const pwForm = reactive({ current: '', newPw: '', confirm: '' })
const pwError = ref('')
const pwSuccess = ref('')

const tabs = [
  { id: 'config', label: 'Configuration', icon: '⚙️' },
  { id: 'hero', label: 'Hero', icon: '🖼' },
  { id: 'services', label: 'Services', icon: '🏛' },
  { id: 'about', label: 'À propos', icon: '📖' },
  { id: 'stats', label: 'Statistiques', icon: '📊' },
  { id: 'contact', label: 'Contact / EmailJS', icon: '✉️' },
  { id: 'seo', label: 'SEO', icon: '🔍' },
  { id: 'tracking', label: 'Tracking & Cookies', icon: '📍' },
  { id: 'media', label: 'Médias', icon: '🖼' },
  { id: 'password', label: 'Mot de passe', icon: '🔐' }
]

const currentTabLabel = computed(() => tabs.find(t => t.id === activeTab.value)?.label || '')

function showSave(msg: string, type: 'ok' | 'err' = 'ok') {
  saveMessage.value = msg
  saveType.value = type
  setTimeout(() => { saveMessage.value = '' }, 3000)
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
    title: 'Nouveau service',
    description: '',
    icon: 'patrimoine',
    bgColor: '',
    link: '',
    order: localContent.services.length + 1,
    visible: true
  })
}

function removeService(i: number) {
  localContent.services.splice(i, 1)
}

function addMilestone() {
  localContent.about.milestones.push({ year: '', label: '' })
}

function addQuickLink() {
  if (!localContent.footer.quickLinks) localContent.footer.quickLinks = []
  localContent.footer.quickLinks.push({ label: '', href: '' })
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

async function uploadFile(file: File) {
  uploading.value = true
  const formData = new FormData()
  formData.append('file', file)
  const token = localStorage.getItem('oefic_admin_token')
  const res = await fetch('/api/media/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  })
  if (res.ok) {
    const f = await res.json() as MediaFile
    mediaFiles.value.unshift(f)
    showSave('✓ Fichier uploadé : ' + f.originalName)
  } else {
    showSave('Erreur lors de l\'upload', 'err')
  }
  uploading.value = false
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
</style>
