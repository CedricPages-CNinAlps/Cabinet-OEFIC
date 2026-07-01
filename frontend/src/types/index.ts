export interface SiteConfig {
  siteName: string
  slogan: string
  logoUrl: string
  colors: {
    bg: string
    bgSoft: string
    text: string
    gold: string
    goldDark: string
  }
  fonts: {
    heading: string
    body: string
    weights: string[]
  }
  socialLinks: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
  legalInfo: {
    orias: string
    siret: string
    address: string
    city: string
    phone: string
    email: string
  }
}

export interface HeroContent {
  title: string
  subtitle: string
  cta1Text: string
  cta1Link: string
  cta2Text: string
  cta2Link: string
  bgColor: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  bgColor: string
  link?: string
  order: number
  visible: boolean
}

export interface AboutContent {
  title: string
  text: string
  imageUrl: string
  bgColor: string
  milestones: Array<{ year: string; label: string }>
}

export interface Stat {
  id: string
  value: number
  suffix: string
  label: string
}

export interface StatsContent {
  bgColor: string
  stats: Stat[]
}

export interface ContactContent {
  title: string
  subtitle: string
  bgColor: string
  emailjs: {
    serviceId: string
    templateId: string
    publicKey: string
  }
  address: string
  phone: string
  email: string
  googleMapsUrl?: string
}

export interface FooterContent {
  description: string
  quickLinks: Array<{ label: string; href: string }>
  legalLinks: Array<{ label: string; href: string }>
  bgColor: string
  textColor: string
}

export interface SiteContent {
  hero: HeroContent
  services: Service[]
  about: AboutContent
  stats: StatsContent
  contact: ContactContent
  footer: FooterContent
  sectionsOrder: string[]
  sectionsVisible: Record<string, boolean>
}

export interface SeoConfig {
  title: string
  description: string
  keywords: string
  ogImage: string
  canonicalUrl: string
}

export interface TrackingConfig {
  gtmId: string
  ga4Id: string
  uaId: string
  matomoUrl: string
  matomoSiteId: string
  matomoTagManagerUrl: string
  tiktokId: string
  googleMapsKey: string
  enabledServices: {
    googletagmanager: boolean
    gtag: boolean
    analytics: boolean
    googlemaps: boolean
    matomo: boolean
    matomotm: boolean
    facebook: boolean
    twitter: boolean
    tiktok: boolean
  }
}

export interface MediaFile {
  id: string
  filename: string
  originalName: string
  mimetype: string
  size: number
  url: string
  uploadedAt: string
}
