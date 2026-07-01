# Cabinet OEFIC — Site Vitrine & Backoffice

Site vitrine professionnel du Cabinet OEFIC, 40 ans d'expertise en gestion de patrimoine et conseil financier.

## Stack Technique

- **Frontend** : Vue.js 3 + TypeScript + Vite
- **Backend** : Node.js + TypeScript + Express
- **Base de données** : JSON chiffré AES-256-GCM
- **Cookies** : Tarte au Citron
- **Contact** : EmailJS

## Démarrage rapide

### Prérequis
- Node.js 18+
- npm 8+

### Installation

```bash
npm install
```

### Configuration

```bash
# Copier les fichiers d'environnement
cp backend/.env.example backend/.env

# Générer une clé de chiffrement
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# → Copier la valeur dans CRYPTO_KEY dans backend/.env
```

### Lancement

```bash
# Démarrer frontend + backend simultanément
npm run dev

# Frontend seul : http://localhost:5173
# Backend API seul : http://localhost:3001
```

### Backoffice

Accès : `http://localhost:5173/admin`

Mot de passe initial : `oefic2024` (à changer immédiatement dans le backoffice)

## Branches Git

| Branche | Contenu |
|---|---|
| `main` | Production |
| `feature/setup` | Structure monorepo |
| `feature/hero` | Hero section glass morphism |
| `feature/frontoffice` | Sections principales |
| `feature/contact` | Formulaire EmailJS |
| `feature/footer` | Footer |
| `feature/seo` | SEO + Schema.org |
| `feature/cookies` | Tarte au Citron |
| `feature/backoffice` | Espace d'administration |

## Structure

```
Cabinet-OEFIC/
├── frontend/   # Vue.js 3 + TypeScript
├── backend/    # Node.js + TypeScript API
└── README.md
```
