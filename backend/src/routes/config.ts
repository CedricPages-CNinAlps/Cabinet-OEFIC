import { Router, Request, Response } from 'express';
import { readStore, writeStore } from '../services/storageService.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import type { SiteConfig, SeoConfig, TrackingConfig } from '../types/index.js';

const router = Router();

// Valeurs par défaut — miroir de frontend/src/data/config.json et seo.json
const defaultConfig: SiteConfig = {
  "siteName": "Cabinet OEFIC",
  "slogan": "Gestion de patrimoine & Family Office depuis {annee_creation}",
  "foundingYear": "1987",
  "yearsOfExpertise": "40",
  "logoUrl": "/assets/logo.png",
  "colors": {
    "bg": "#FFFFFF",
    "bgSoft": "#F5F5F7",
    "text": "#1e1a34",
    "gold": "#C9A84C",
    "goldDark": "#A8873E"
  },
  "fonts": {
    "heading": "Parisienne",
    "body": "Inter",
    "weights": [
      "400",
      "500",
      "600",
      "700"
    ]
  },
  "socialLinks": {},
  "legalInfo": {
    "orias": "07 02 58 11",
    "siret": "313 598 344 00064",
    "rcs": "RCS Grenoble 313 598 344",
    "address": "Inovallée, 29 chemin du Vieux Chêne",
    "city": "38240 Meylan",
    "phone": "+33 (0)4 76 90 18 77",
    "email": "cedric.pages@oefic.com",
    "cif": "F1035585",
    "cifAssociation": "",
    "coa": "Courtier en assurance (COA)",
    "iobsp": "Intermédiaire en opérations de banque et en services de paiement (IOBSP)",
    "carteT": "CPI6161681856",
    "rcPro": "182.2253",
    "rcProInsurer": "",
    "mediator": "",
    "tvaIntra": "FR313598344"
  }
};

const defaultSeo: SeoConfig = {
  "title": "Cabinet OEFIC — Conseil en Gestion de Patrimoine & Family Office à Meylan (Grenoble)",
  "description": "{nom_cabinet}, conseil indépendant en gestion de patrimoine et Family Office depuis {annee_creation} à Meylan (Grenoble) : bilan patrimonial, conseil en investissements financiers (CIF), transmission, retraite, optimisation fiscale, immobilier, financement (IOBSP) et levée de fonds.",
  "keywords": "family office, conseil en gestion de patrimoine, CGP Grenoble, CGP Meylan, gestion de patrimoine Isère, conseiller en investissements financiers, CIF, bilan patrimonial, transmission, succession, retraite, PER, assurance-vie, optimisation fiscale, IFI, holding, dirigeant, immobilier, IOBSP, courtier, levée de fonds",
  "ogImage": "/assets/og-image.jpg",
  "canonicalUrl": "https://cabinet-oefic.fr"
};

const defaultTracking: TrackingConfig = {
  gtmId: '',
  ga4Id: '',
  uaId: '',
  matomoUrl: '',
  matomoSiteId: '',
  matomoTagManagerUrl: '',
  tiktokId: '',
  googleMapsKey: '',
  enabledServices: {
    googletagmanager: false,
    gtag: false,
    analytics: false,
    googlemaps: false,
    matomo: false,
    matomotm: false,
    facebook: false,
    twitter: false,
    tiktok: false
  }
};

// Public endpoints (no auth needed for front)
router.get('/', (_req: Request, res: Response): void => {
  res.json(readStore<SiteConfig>('config', defaultConfig));
});

router.get('/seo', (_req: Request, res: Response): void => {
  res.json(readStore<SeoConfig>('seo', defaultSeo));
});

router.get('/tracking', (_req: Request, res: Response): void => {
  res.json(readStore<TrackingConfig>('tracking', defaultTracking));
});

// Protected endpoints
router.put('/', requireAuth, (req: Request, res: Response): void => {
  const current = readStore<SiteConfig>('config', defaultConfig);
  const updated = { ...current, ...(req.body as Partial<SiteConfig>) };
  writeStore<SiteConfig>('config', updated);
  res.json(updated);
});

router.put('/seo', requireAuth, (req: Request, res: Response): void => {
  const current = readStore<SeoConfig>('seo', defaultSeo);
  const updated = { ...current, ...(req.body as Partial<SeoConfig>) };
  writeStore<SeoConfig>('seo', updated);
  res.json(updated);
});

router.put('/tracking', requireAuth, (req: Request, res: Response): void => {
  const current = readStore<TrackingConfig>('tracking', defaultTracking);
  const updated = { ...current, ...(req.body as Partial<TrackingConfig>) } as TrackingConfig;
  if ((req.body as Partial<TrackingConfig>).enabledServices) {
    updated.enabledServices = {
      ...current.enabledServices,
      ...(req.body as Partial<TrackingConfig>).enabledServices
    };
  }
  writeStore<TrackingConfig>('tracking', updated);
  res.json(updated);
});

export default router;
