import { Router, Request, Response } from 'express';
import { readStore, writeStore } from '../services/storageService.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import type { SiteConfig, SeoConfig, TrackingConfig } from '../types/index.js';

const router = Router();

const defaultConfig: SiteConfig = {
  siteName: 'Cabinet OEFIC',
  slogan: '40 ans d\'expertise au service de votre patrimoine',
  logoUrl: '/assets/logo.png',
  colors: {
    bg: '#FFFFFF',
    bgSoft: '#F5F5F7',
    text: '#1e1a34',
    gold: '#C9A84C',
    goldDark: '#A8873E'
  },
  fonts: {
    heading: 'Playfair Display',
    body: 'Inter',
    weights: ['400', '500', '600', '700']
  },
  socialLinks: {},
  legalInfo: {
    orias: '',
    siret: '',
    address: '',
    city: '',
    phone: '',
    email: ''
  }
};

const defaultSeo: SeoConfig = {
  title: 'Cabinet OEFIC — Gestion de Patrimoine & Conseil Financier',
  description: 'Cabinet OEFIC, 40 ans d\'expertise en gestion de patrimoine, conseil en investissements financiers, assurances vie et retraite, IOBSP et levée de fonds.',
  keywords: 'gestion patrimoine, conseil financier, assurance vie, retraite, IOBSP, levée de fonds, cabinet conseil',
  ogImage: '/assets/og-image.jpg',
  canonicalUrl: 'https://cabinet-oefic.fr'
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
