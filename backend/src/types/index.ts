export interface SiteConfig {
  siteName: string;
  slogan: string;
  /** Année de création — variable {annee_creation} */
  foundingYear: string;
  /** Ancienneté affichée — variable {anciennete} */
  yearsOfExpertise: string;
  logoUrl: string;
  colors: {
    bg: string;
    bgSoft: string;
    text: string;
    gold: string;
    goldDark: string;
  };
  fonts: {
    heading: string;
    body: string;
    weights: string[];
  };
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  legalInfo: {
    orias: string;
    cif: string;
    carteT: string;
    rcPro: string;
    tvaIntra: string;
    siret: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    /** RCS + ville du greffe */
    rcs?: string;
    /** Association professionnelle agréée AMF à laquelle le CIF adhère (CNCGP, ANACOFI-CIF, Compagnie des CGP…) */
    cifAssociation?: string;
    /** Statut d'intermédiaire en assurance (COA, MIA…) */
    coa?: string;
    /** Statut IOBSP (COBSP, MIOBSP…) */
    iobsp?: string;
    /** Assureur RC Pro / garantie financière */
    rcProInsurer?: string;
    /** Médiateur de la consommation */
    mediator?: string;
  };
}

export interface NavContent {
  links: Array<{ label: string; href: string }>;
  ctaText: string;
  ctaLink: string;
}

export interface ServicesHeader {
  eyebrow: string;
  title: string;
  intro: string;
  cardCta: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
  bgColor: string;
  badgeText: string;
  scrollText: string;
  /** Références vers les chiffres clés (onglet Statistiques) */
  quickStats: Array<{ statId: string; label: string }>;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  link?: string;
  order: number;
  visible: boolean;
}

export interface FamilyOfficeItem {
  title: string;
  description: string;
}

export interface FamilyOfficeContent {
  eyebrow: string;
  title: string;
  text: string;
  pillars: FamilyOfficeItem[];
  stepsTitle: string;
  steps: FamilyOfficeItem[];
  ctaText: string;
  ctaLink: string;
  bgColor: string;
}

export interface LogoItem {
  id: string;
  /** Nom du partenaire (texte alternatif) */
  name: string;
  url: string;
  link?: string;
}

export type SliderMode = 'continuous' | 'step';

export interface LogoSlider {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  visible: boolean;
  /** continuous = défilement continu ; step = un logo à la fois */
  mode: SliderMode;
  /** Mode continu : durée d'un tour complet, en secondes */
  speed: number;
  /** Mode par étapes : temps d'affichage entre deux déplacements, en secondes */
  interval: number;
  reverse: boolean;
  grayscale: boolean;
  bgColor: string;
  logos: LogoItem[];
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  text: string;
  imageUrl: string;
  bgColor: string;
  milestones: Array<{ year: string; label: string }>;
  badgeValue: string;
  badgeLabel: string;
  placeholderTitle: string;
  placeholderSubtitle: string;
}

export type StatSource = '' | 'anciennete' | 'nb_expertises';

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
  /** Valeur calculée automatiquement (sinon : value) */
  source?: StatSource;
}

export interface StatsContent {
  bgColor: string;
  stats: Stat[];
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  bgColor: string;
  emailjs: {
    serviceId: string;
    templateId: string;
    publicKey: string;
  };
  googleMapsUrl?: string;
  cardTitle: string;
  addressLabel: string;
  hoursTitle: string;
  /** Une ligne par horaire */
  hours: string;
  form: ContactFormTexts;
}

export interface ContactFormTexts {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  otherSubject: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitText: string;
  sendingText: string;
  successMessage: string;
  errorMessage: string;
  requiredMessage: string;
  notConfiguredMessage: string;
}

export interface FooterContent {
  description: string;
  legalLinks: Array<{ label: string; href: string }>;
  bgColor: string;
  textColor: string;
  copyrightText: string;
  legalNumbersTitle: string;
  navTitle: string;
  servicesTitle: string;
  contactTitle: string;
  cookiesText: string;
}

export interface SiteContent {
  nav: NavContent;
  hero: HeroContent;
  services: Service[];
  servicesHeader: ServicesHeader;
  familyOffice: FamilyOfficeContent;
  about: AboutContent;
  stats: StatsContent;
  sliders: LogoSlider[];
  contact: ContactContent;
  footer: FooterContent;
  sectionsOrder: string[];
  sectionsVisible: Record<string, boolean>;
}

export interface SeoConfig {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface TrackingConfig {
  gtmId: string;
  ga4Id: string;
  uaId: string;
  matomoUrl: string;
  matomoSiteId: string;
  matomoTagManagerUrl: string;
  tiktokId: string;
  googleMapsKey: string;
  enabledServices: {
    googletagmanager: boolean;
    gtag: boolean;
    analytics: boolean;
    googlemaps: boolean;
    matomo: boolean;
    matomotm: boolean;
    facebook: boolean;
    twitter: boolean;
    tiktok: boolean;
  };
}

export interface AuthStore {
  passwordHash: string;
}

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface MediaStore {
  files: MediaFile[];
}

export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}
