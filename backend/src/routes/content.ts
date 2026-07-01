import { Router, Request, Response } from 'express';
import { readStore, writeStore } from '../services/storageService.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import type { SiteContent, Service } from '../types/index.js';

const router = Router();

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

const defaultContent: SiteContent = {
  hero: {
    title: '40 ans d\'expertise\nau service de votre patrimoine',
    subtitle: 'Cabinet OEFIC vous accompagne dans la gestion, la protection et le développement de votre patrimoine avec une approche personnalisée et indépendante.',
    cta1Text: 'Prendre rendez-vous',
    cta1Link: '#contact',
    cta2Text: 'Nos services',
    cta2Link: '#services',
    bgColor: ''
  },
  services: [
    {
      id: generateId(),
      title: 'Gestion de Patrimoine',
      description: 'Optimisation et valorisation de votre patrimoine financier et immobilier avec une stratégie sur mesure adaptée à vos objectifs de vie.',
      icon: 'patrimoine',
      bgColor: '',
      link: '#contact',
      order: 1,
      visible: true
    },
    {
      id: generateId(),
      title: 'Conseil en Investissements Financiers',
      description: 'Analyse approfondie des marchés et sélection rigoureuse des supports d\'investissement pour optimiser vos rendements selon votre profil de risque.',
      icon: 'investissement',
      bgColor: '',
      link: '#contact',
      order: 2,
      visible: true
    },
    {
      id: generateId(),
      title: 'Assurances Vie & Retraite',
      description: 'Solutions d\'assurance vie, prévoyance et retraite adaptées pour protéger vos proches et préparer sereinement votre avenir.',
      icon: 'assurance',
      bgColor: '',
      link: '#contact',
      order: 3,
      visible: true
    },
    {
      id: generateId(),
      title: 'Intermédiaire en Banque et Crédit',
      description: 'Accompagnement dans vos opérations de financement, restructuration de dettes et optimisation de vos conditions bancaires.',
      icon: 'banque',
      bgColor: '',
      link: '#contact',
      order: 4,
      visible: true
    },
    {
      id: generateId(),
      title: 'Levée de Fonds',
      description: 'Accompagnement stratégique pour structurer et réussir vos levées de fonds, des premières réflexions jusqu\'à la signature.',
      icon: 'fonds',
      bgColor: '',
      link: '#contact',
      order: 5,
      visible: true
    }
  ],
  about: {
    title: '40 ans d\'excellence au service de vos ambitions',
    text: 'Fondé en 1984, le Cabinet OEFIC est un acteur indépendant reconnu dans le conseil en gestion de patrimoine. Depuis quatre décennies, nous accompagnons particuliers, chefs d\'entreprise et institutionnels dans la structuration, la protection et le développement de leur patrimoine.\n\nNotre approche repose sur une analyse globale de votre situation, une parfaite indépendance vis-à-vis des établissements financiers et un engagement total dans la durée à vos côtés.',
    imageUrl: '',
    bgColor: '',
    milestones: [
      { year: '1984', label: 'Création du Cabinet OEFIC' },
      { year: '1995', label: 'Développement de l\'activité assurances' },
      { year: '2005', label: 'Agrément IOBSP' },
      { year: '2015', label: 'Expansion levée de fonds' },
      { year: '2024', label: '40 ans d\'expertise' }
    ]
  },
  stats: {
    bgColor: '#F5F5F7',
    stats: [
      { id: generateId(), value: 40, suffix: ' ans', label: 'D\'expertise' },
      { id: generateId(), value: 500, suffix: '+', label: 'Clients accompagnés' },
      { id: generateId(), value: 98, suffix: '%', label: 'Taux de satisfaction' },
      { id: generateId(), value: 5, suffix: '', label: 'Domaines d\'expertise' }
    ]
  },
  contact: {
    title: 'Prenons contact',
    subtitle: 'Notre équipe est à votre disposition pour étudier votre situation et vous proposer les solutions les mieux adaptées à vos objectifs.',
    bgColor: '',
    emailjs: {
      serviceId: '',
      templateId: '',
      publicKey: ''
    },
    address: '',
    phone: '',
    email: '',
    googleMapsUrl: ''
  },
  footer: {
    description: 'Cabinet OEFIC — 40 ans d\'expertise indépendante en gestion de patrimoine, conseil financier et accompagnement sur mesure.',
    quickLinks: [
      { label: 'Nos services', href: '#services' },
      { label: 'À propos', href: '#about' },
      { label: 'Contact', href: '#contact' }
    ],
    legalLinks: [
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Politique de confidentialité', href: '/confidentialite' },
      { label: 'CGU', href: '/cgu' }
    ],
    bgColor: '#1e1a34'
  },
  sectionsOrder: ['hero', 'services', 'about', 'stats', 'contact'],
  sectionsVisible: {
    hero: true,
    services: true,
    about: true,
    stats: true,
    contact: true
  }
};

router.get('/', (_req: Request, res: Response): void => {
  res.json(readStore<SiteContent>('content', defaultContent));
});

router.put('/', requireAuth, (req: Request, res: Response): void => {
  const current = readStore<SiteContent>('content', defaultContent);
  const updated: SiteContent = { ...current, ...(req.body as Partial<SiteContent>) };
  writeStore<SiteContent>('content', updated);
  res.json(updated);
});

router.put('/services', requireAuth, (req: Request, res: Response): void => {
  const current = readStore<SiteContent>('content', defaultContent);
  current.services = req.body as Service[];
  writeStore<SiteContent>('content', current);
  res.json(current.services);
});

router.post('/services', requireAuth, (req: Request, res: Response): void => {
  const current = readStore<SiteContent>('content', defaultContent);
  const newService: Service = {
    id: generateId(),
    order: current.services.length + 1,
    visible: true,
    ...req.body as Omit<Service, 'id' | 'order' | 'visible'>
  };
  current.services.push(newService);
  writeStore<SiteContent>('content', current);
  res.status(201).json(newService);
});

router.delete('/services/:id', requireAuth, (req: Request, res: Response): void => {
  const current = readStore<SiteContent>('content', defaultContent);
  current.services = current.services.filter(s => s.id !== req.params.id);
  writeStore<SiteContent>('content', current);
  res.json({ success: true });
});

export default router;
