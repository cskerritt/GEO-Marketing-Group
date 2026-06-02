/**
 * Site-wide constants. Single source of truth for the Org/LocalBusiness schema,
 * navigation, contact data, and recurring strings used across pages.
 */

export const SITE = {
  name: 'GEO',
  legalName: 'GEO',
  tagline: 'GEO & AEO for Professional Services.',
  url: 'https://geostudio.io',
  description:
    'GEO is a Generative Engine Optimization and Answer Engine Optimization agency for professional services firms — law, CPA, consulting, financial advisors, and A&E. We make your firm citable to AI: ChatGPT, Claude, Perplexity, Google AI Overviews, and Gemini.',
  founder: {
    name: 'Chris Skerritt',
    role: 'Founder',
    email: 'chris@geostudio.io',
    bioShort:
      'Chris Skerritt is the founder of GEO, a generative engine optimization agency for professional services firms in Providence, RI.',
  },
  address: {
    streetAddress: 'Providence, RI',
    addressLocality: 'Providence',
    addressRegion: 'RI',
    addressCountry: 'US',
    postalCode: '02903',
  },
  email: 'hello@geostudio.io',
  phone: '+1-401-555-0100',
  social: {
    linkedin: 'https://www.linkedin.com/company/geostudio',
    twitter: 'https://twitter.com/geostudio_io',
  },
} as const;

export const NAV = [
  { label: 'Services', href: '/services' },
  { label: 'Industries', href: '/industries' },
  { label: 'Process', href: '/process' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
] as const;

export const INDUSTRIES = [
  {
    slug: 'law-firms',
    label: 'Law firms',
    title: 'GEO for Law Firms',
    description:
      'Get cited by ChatGPT, Claude, and Perplexity for the practice areas you actually want to be hired for.',
    schemaType: 'LegalService',
  },
  {
    slug: 'cpa-firms',
    label: 'CPA & accounting',
    title: 'GEO for CPA & Accounting Firms',
    description:
      'Convert your white papers and tax-update content into structured, citation-ready answers.',
    schemaType: 'AccountingService',
  },
  {
    slug: 'consulting',
    label: 'Consulting',
    title: 'GEO for Consulting Firms',
    description:
      'Turn your frameworks, case studies, and methodology essays into citable AI-search content.',
    schemaType: 'ProfessionalService',
  },
  {
    slug: 'financial-advisors',
    label: 'Financial advisors',
    title: 'GEO for Financial Advisors & RIAs',
    description:
      'Compliance-friendly GEO. Get cited by AI without violating SEC marketing rules.',
    schemaType: 'FinancialService',
  },
  {
    slug: 'architecture-engineering',
    label: 'Architecture & engineering',
    title: 'GEO for Architecture & Engineering Firms',
    description:
      'Win the RFPs you weren\'t invited to. Project case studies become citable content.',
    schemaType: 'ProfessionalService',
  },
] as const;

export const SERVICES = [
  {
    slug: 'geo',
    label: 'GEO',
    title: 'Generative Engine Optimization',
    description:
      'Make your content citable by ChatGPT, Claude, Perplexity, and Google AI Overviews.',
    price: 'From $1,500',
  },
  {
    slug: 'aeo',
    label: 'AEO',
    title: 'Answer Engine Optimization',
    description:
      'FAQ scaffolding, schema markup, and structured answers that AI engines lift directly.',
    price: 'From $1,500',
  },
  {
    slug: 'build',
    label: 'Build',
    title: 'GEO-Native Website Build',
    description:
      'A new site, built on a GEO/AEO foundation from day one. 12–15 pages, deployed.',
    price: 'From $7,500',
  },
] as const;

export type Industry = (typeof INDUSTRIES)[number];
export type Service = (typeof SERVICES)[number];
