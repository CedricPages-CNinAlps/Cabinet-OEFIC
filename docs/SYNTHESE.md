# Cabinet OEFIC — Fiche de synthèse

_Mise à jour : 10/10/2026 — branche `feature/setup`_

---

## 1. Liens

| Usage | Local (développement) | En ligne (GitHub Pages) |
|---|---|---|
| **Site public (front office)** | http://localhost:5173/Cabinet-OEFIC/ | https://cedricpages-cninalps.github.io/Cabinet-OEFIC/ |
| **Backoffice — connexion** | http://localhost:5173/Cabinet-OEFIC/admin | _(non fonctionnel : pas d'API, voir §4)_ |
| **Backoffice — tableau de bord** | http://localhost:5173/Cabinet-OEFIC/admin/dashboard | — |
| **API — état de santé** | http://localhost:3001/api/health | — |
| **Dépôt GitHub** | https://github.com/CedricPages-CNinAlps/Cabinet-OEFIC | |
| **Domaine cible (SEO / canonical)** | https://cabinet-oefic.fr | _(à brancher)_ |

> Le préfixe `/Cabinet-OEFIC/` vient du réglage `base` de `frontend/vite.config.ts`, imposé par GitHub Pages. Sur un serveur avec domaine propre, il disparaît (voir §4.2).

---

## 2. Procédure d'accès

### Prérequis
- Node.js 18 ou plus (20 recommandé), npm 8 ou plus
- Le fichier `backend/.env` (non versionné), qui contient `CRYPTO_KEY` et `JWT_SECRET`

### Démarrer en local
```bash
cd Cabinet-OEFIC
npm install          # première fois uniquement
npm run dev          # lance l'API (port 3001) et le site (port 5173)
```

### Se connecter au backoffice
1. Ouvrir http://localhost:5173/Cabinet-OEFIC/admin, ou cliquer sur la petite roue crantée en bas à droite du footer, après « Gestion des cookies »
2. Saisir le mot de passe administrateur. Le mot de passe initial `oefic2024` est créé au premier démarrage, **sauf s'il a déjà été changé**.
3. **Changer immédiatement ce mot de passe** : onglet **Mot de passe** du backoffice.
4. La session dure 8 heures (jeton JWT). Ensuite, il faut se reconnecter.

### Onglets du backoffice
| Onglet | Contenu |
|---|---|
| Configuration | Identité, couleurs, polices, **informations réglementaires** (ORIAS, CIF, association, COA, IOBSP, Carte T, RC Pro, médiateur, RCS, TVA), coordonnées, réseaux sociaux, footer (dont titres des colonnes et lien cookies) |
| **Menu** _(nouveau)_ | Liens du menu (ordre par glisser-déposer) et bouton « Prendre rendez-vous » |
| Hero | Titre, sous-titre, boutons, badge, texte « Découvrir », choix des chiffres clés affichés (glisser-déposer) |
| **Expertises** | En-tête de la section (sur-titre, titre, introduction, texte « En savoir plus ») et cartes d'expertise : ordre (glisser-déposer), icône, visibilité. Elles alimentent aussi le footer, les sujets du formulaire de contact et le compteur « expertises » du hero |
| **Family Office** _(nouveau)_ | Afficher ou masquer la section, introduction, piliers et étapes de la méthode (ordre par glisser-déposer), bouton d'appel à l'action |
| À propos | Sur-titre, texte, badge, jalons de la frise |
| Statistiques | Chiffres clés : valeur saisie ou automatique (ancienneté, nombre d'expertises) |
| **Slider** _(nouveau)_ | Autant de sliders de logos que voulu (ex. « Partenaires financiers », « Partenaires assureurs »). Chacun est un bloc indépendant affiché à la suite des autres, avant Contact. Par slider : titres, logos (import par bouton, glisser-déposer de fichiers ou médiathèque, réordonnables y compris d'un slider à l'autre), **réglage du temps** (continu : durée d'un tour en secondes ; par étapes : secondes entre deux logos), sens, gris, fond. Ajout et suppression à volonté |
| Contact / EmailJS | Sur-titre, textes, **horaires d'ouverture**, titres de la carte coordonnées, **tous les libellés et messages du formulaire**, identifiants EmailJS |
| SEO | Titre, description, mots-clés. Ils sont maintenant appliqués au chargement de la page |
| Tracking & Cookies | GTM, GA4, Matomo, Maps, pixels (consentement via Tarte au Citron) |
| Médias | Envoi et bibliothèque d'images et de vidéos |

### Une information = un seul endroit
| Information | Où la saisir | Reprise automatiquement dans |
|---|---|---|
| Nom du cabinet, année de création, années d'expertise | Configuration → Identité | Hero, expertises, « Le cabinet », chiffres clés, footer, SEO (variables) |
| Téléphone, email, adresse | Configuration → Coordonnées | Carte Contact, colonne Contact du footer, variables |
| Chiffres clés (clients, satisfaction…) | Statistiques | Section Chiffres clés et chiffres rapides du hero |
| Ancienneté et nombre d'expertises | _calculés_ | Statistiques réglées sur « Automatique » |
| Expertises | Expertises | Cartes, colonne du footer, sujets du formulaire, variable `{nb_expertises}` |
| Liens du menu | Menu | Menu du haut et colonne Navigation du footer |

**Variables** à écrire entre accolades dans n'importe quel texte : `{nom_cabinet}`, `{annee_creation}`, `{anciennete}`, `{nb_expertises}`, `{annee_courante}`, `{telephone}`, `{email}`, `{ville}`. La liste et les valeurs actuelles s'affichent en haut de chaque onglet du backoffice.

### Où sont stockées les données
- Le contenu modifié dans le backoffice est chiffré (AES-256-GCM) dans `backend/src/data/*.enc`. Ces fichiers ne sont **pas versionnés** : **il faut les sauvegarder**, ainsi que `backend/.env`. Sans la `CRYPTO_KEY`, les données sont illisibles.
- Les logos et médias importés sont stockés dans `backend/uploads/` (non versionné, **à sauvegarder**). Leur adresse est relative (`/uploads/…`). Ils s'affichent en local et sur un serveur, mais **pas sur GitHub Pages**, qui n'a pas d'API.
- `frontend/src/data/*.json` est une **copie statique** du contenu. Le site l'utilise quand aucune API n'est joignable, par exemple sur GitHub Pages.

---

## 3. Modifications de contenu (analyse concurrentielle)

Sites analysés : **sintes-gp.fr** (Perpignan) et **delmasgp.fr** (Aix-en-Provence).

### Ce que proposent les concurrents et qui manquait chez OEFIC
| Élément chez les concurrents | Avant | Maintenant |
|---|---|---|
| Bilan patrimonial global, vision à 360° | absent | Expertise « Bilan & Stratégie patrimoniale » et étape 2 de la méthode |
| Transmission & succession (donation, démembrement, Pacte Dutreil, mandat de protection future) | absent | Nouvelle expertise |
| Structuration du dirigeant (holding, SCI, apport-cession 150-0 B ter) | absent | Nouvelle expertise « Ingénierie patrimoniale du dirigeant » |
| Enveloppes et supports (contrat de capitalisation, PEA, CTO, PER, ETF, private equity, produits structurés) | générique | Détaillés dans l'expertise CIF |
| Retraite et prévoyance (PER, homme-clé, assurance emprunteur) | « Assurances Vie & Retraite » | « Retraite & Prévoyance » |
| Immobilier (LMNP, SCPI, Malraux, déficit foncier) | aucune expertise, alors que la Carte T est détenue | Nouvelle expertise « Immobilier patrimonial » |
| Valeurs : indépendance, globalité, sur-mesure, durée, transparence | partiel | Texte « Le cabinet » réécrit |
| Méthode : premier échange sans engagement → bilan → recommandations → mise en œuvre → suivi | absent | Bloc « Notre méthode » |
| Travail en réseau avec notaires, avocats et experts-comptables | absent | Pilier « Coordination des experts » |
| Mentions réglementaires complètes (autorités de contrôle, association, médiateur) | numéros seuls | Footer conforme (voir ci-dessous) |

### Différenciation : le Family Office
Aucun des deux concurrents n'en propose. OEFIC en propose désormais un :
- **Nouvelle section « Family Office »**, juste après les expertises, avec 6 piliers : vision consolidée et reporting, coordination des experts, gouvernance familiale, transmission multigénérationnelle, patrimoine privé et professionnel, philanthropie.
- Le Family Office est mis en avant dans le hero (« Gestion de patrimoine & Family Office »), le menu, le footer, le texte « Le cabinet », la frise (jalon 2026), le slogan, le SEO et le Schema.org.
- Tout est modifiable dans l'onglet **Family Office** du backoffice.

### Corrections de termes
| Avant | Après | Raison |
|---|---|---|
| « Agrément IOBSP » | « Immatriculation IOBSP à l'ORIAS » | Un IOBSP est immatriculé, pas agréé |
| « Fiscalité — Aide à la préparation de votre fiscalité » | « Optimisation fiscale… dans le strict respect du cadre légal » | Préparer une déclaration relève de l'expertise-comptable, et le conseil fiscal pur relève de l'avocat |
| « Intermédiaire en Banque et Crédit » | « Financement & Courtage en crédit » (IOBSP) | Terme utilisé par la profession |
| « Nos services » / « À propos » | « Nos expertises » / « Le cabinet » | Vocabulaire du secteur, comme chez les concurrents |
| « Clients accompagnés » | « Familles et dirigeants accompagnés » | Cohérent avec le positionnement Family Office |
| « N° CIF » | « Conseiller en Investissements Financiers (CIF) n° …, adhérent de …, association agréée par l'AMF » | Formulation réglementaire attendue |
| « Carte T » | « Carte professionnelle T (transaction immobilière) » | Libellé complet |
| Sujets du formulaire de contact codés en dur | Générés à partir des expertises visibles | Ils restent alignés avec le backoffice |

### ⚠️ À compléter ou vérifier par le cabinet (onglet Configuration)
1. **Association CIF** : CNCGP, ANACOFI-CIF, La Compagnie des CGP… Le n° `F1035585` est affiché comme n° d'adhérent.
2. **Médiateur de la consommation** : nom et site. **Mention obligatoire**, actuellement vide.
3. **Assureur RC Pro / garantie financière** : vide.
4. **Statuts ORIAS exacts** : COA ou MIA, COBSP ou MIOBSP. Les valeurs génériques saisies sont à vérifier sur orias.fr.
5. **RCS** : « RCS Grenoble 313 598 344 » a été déduit du SIRET. À confirmer.
6. **Jalon « 2026 — Lancement du pôle Family Office »** et **chiffres clés** (500+, 98 %) : à valider.
7. Pages **Mentions légales / Confidentialité / CGU** : les liens existent, mais les pages ne sont pas encore créées.

---

## 4. Déploiement

### 4.1 Aujourd'hui : GitHub Pages (site public seul, sans backoffice)
- Workflow : `.github/workflows/deploy-gh-pages.yml`. Il se déclenche à chaque push sur **`master`** qui touche `frontend/**`. Il construit le site et le publie sur la branche `gh-pages`.
- Dans les paramètres GitHub du dépôt (**Settings → Pages**), la source doit être **Deploy from branch : `gh-pages` / (root)**.
- Le contenu affiché vient de `frontend/src/data/*.json`. **Après chaque modification faite dans le backoffice local**, il faut mettre ces fichiers à jour :
  ```bash
  npm run dev   # backend démarré
  curl -s http://localhost:3001/api/config          > frontend/src/data/config.json
  curl -s http://localhost:3001/api/content         > frontend/src/data/content.json
  curl -s http://localhost:3001/api/config/seo      > frontend/src/data/seo.json
  curl -s http://localhost:3001/api/config/tracking > frontend/src/data/tracking.json
  git add frontend/src/data && git commit -m "chore: snapshot contenu" && git push
  ```
  Ensuite, fusionner dans `master` pour déclencher la publication.

### 4.2 Recommandé : serveur Node (VPS) avec domaine `cabinet-oefic.fr`, backoffice inclus
1. **Serveur** : Debian/Ubuntu avec Node.js 20, nginx, pm2 (`npm i -g pm2`) et certbot.
2. **Code** :
   ```bash
   git clone https://github.com/CedricPages-CNinAlps/Cabinet-OEFIC.git /var/www/oefic
   cd /var/www/oefic && npm ci
   ```
3. **Chemin de base** : dans `frontend/vite.config.ts`, remplacer `base: '/Cabinet-OEFIC/'` par `base: '/'`, puisque le site est servi à la racine du domaine.
4. **Configuration** : créer `backend/.env` :
   ```env
   PORT=3001
   JWT_SECRET=<64 caractères aléatoires>
   CRYPTO_KEY=<64 caractères hexadécimaux — reprendre CELLE DU POSTE LOCAL pour relire les données>
   FRONTEND_URL=https://cabinet-oefic.fr
   ```
   Clé aléatoire : `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
5. **Données** : copier `backend/src/data/*.enc` et `backend/uploads/*` depuis le poste local, en scp ou sftp (jamais via Git).
6. **Build** :
   ```bash
   npm run build --workspace=frontend   # → frontend/dist
   npm run build --workspace=backend    # → backend/dist
   ```
7. **Lancer l'API**. Elle doit être lancée **depuis le dossier `backend/`**, car les chemins `src/data` et `uploads` sont relatifs au dossier courant :
   ```bash
   cd /var/www/oefic/backend
   pm2 start dist/index.js --name oefic-api && pm2 save && pm2 startup
   ```
8. **nginx** (`/etc/nginx/sites-available/oefic`) :
   ```nginx
   server {
     server_name cabinet-oefic.fr www.cabinet-oefic.fr;
     root /var/www/oefic/frontend/dist;
     index index.html;
     client_max_body_size 20m;

     location /api/     { proxy_pass http://127.0.0.1:3001; proxy_set_header Host $host; }
     location /uploads/ { proxy_pass http://127.0.0.1:3001; }
     location /         { try_files $uri $uri/ /index.html; }
   }
   ```
   Puis `ln -s` vers `sites-enabled`, `nginx -t && systemctl reload nginx`, et `certbot --nginx -d cabinet-oefic.fr -d www.cabinet-oefic.fr`.
9. **DNS** : enregistrements A et AAAA de `cabinet-oefic.fr` et `www` vers l'IP du serveur.
10. **Mise à jour** du site :
    ```bash
    cd /var/www/oefic && git pull && npm ci
    npm run build --workspace=frontend && npm run build --workspace=backend
    pm2 restart oefic-api
    ```
11. **Sauvegardes** : sauvegarder chaque jour `backend/src/data/`, `backend/uploads/` et `backend/.env`.

### 4.3 Points d'attention
- Sur le poste local, `git push` et `git fetch` en HTTPS échouent (« unable to get local issuer certificate ») à cause de l'inspection TLS du proxy ou de l'antivirus. Il faut corriger le certificat racine plutôt que désactiver la vérification.
- La branche `feature/setup` n'est pas encore fusionnée dans `master`. Le workflow GitHub Pages ne s'exécutera qu'après cette fusion.
- `frontend/public/assets/og-image.jpg` est référencé (Open Graph) mais n'existe pas. Il faut ajouter une image de 1200×630.

---

## 5. Stack technique (rappel)
- **Front** : Vue 3, TypeScript, Vite, Pinia, Vue Router, GSAP, EmailJS, Tarte au Citron
- **Back** : Node.js, Express, TypeScript, JWT, bcrypt, AES-256-GCM, Multer
- **Charte** : bleu nuit `#1e1a34`, or `#C9A84C`, fonds `#FFFFFF` / `#F5F5F7`
