/**
 * Site-wide constants. Single source of truth for the Org/LocalBusiness schema,
 * navigation, contact data, and recurring strings used across pages.
 */

export const SITE = {
  name: 'GEO Marketing Group',
  shortName: 'GEO',
  legalName: 'GEO Marketing Group',
  tagline: 'Full-service marketing for professional-services firms.',
  url: 'https://geomarketinggroup.org',
  description:
    'GEO Marketing Group is a full-service marketing agency for professional-services firms — law, CPA, consulting, financial advisors, and A&E. We combine Generative Engine Optimization (GEO), SEO & content, web design, and paid media to make serious firms impossible to overlook, online and in AI.',
  founder: {
    name: 'Chris Skerritt',
    role: 'Founder',
    email: 'chris@geomarketinggroup.org',
    bioShort:
      'Chris Skerritt is the founder of GEO Marketing Group, a full-service marketing agency for professional-services firms in Providence, RI.',
  },
  address: {
    streetAddress: 'Providence, RI',
    addressLocality: 'Providence',
    addressRegion: 'RI',
    addressCountry: 'US',
    postalCode: '02903',
  },
  email: 'hello@geomarketinggroup.org',
  phone: '+1-401-555-0100',
  social: {
    linkedin: 'https://www.linkedin.com/company/geomarketinggroup',
    twitter: 'https://twitter.com/geomktgroup',
  },
} as const;

export const NAV = [
  { label: 'Services', href: '/services' },
  { label: 'Industries', href: '/industries' },
  { label: 'Work', href: '/work' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
] as const;

export const INDUSTRIES = [
  {
    slug: 'law-firms',
    label: 'Law firms',
    title: 'Marketing for Law Firms',
    description:
      'Win the clients who ask AI and Google for a firm like yours — bar-rule-compliant GEO, SEO, web, and paid.',
    schemaType: 'LegalService',
  },
  {
    slug: 'cpa-firms',
    label: 'CPA & accounting',
    title: 'Marketing for CPA & Accounting Firms',
    description:
      'Turn your expertise into demand: citation-ready content, search rankings, and campaigns that reach the right businesses.',
    schemaType: 'AccountingService',
  },
  {
    slug: 'consulting',
    label: 'Consulting',
    title: 'Marketing for Consulting Firms',
    description:
      'Make your frameworks and case studies findable — in AI answers, in search, and in front of the buyers you want.',
    schemaType: 'ProfessionalService',
  },
  {
    slug: 'financial-advisors',
    label: 'Financial advisors',
    title: 'Marketing for Financial Advisors & RIAs',
    description:
      'Compliance-friendly marketing that grows AUM — without violating SEC marketing rules.',
    schemaType: 'FinancialService',
  },
  {
    slug: 'architecture-engineering',
    label: 'Architecture & engineering',
    title: 'Marketing for Architecture & Engineering Firms',
    description:
      'Win the RFPs you weren\'t invited to. Project work becomes citable, searchable, pipeline-building content.',
    schemaType: 'ProfessionalService',
  },
] as const;

export const SERVICES = [
  {
    slug: 'geo',
    label: 'GEO',
    title: 'Generative Engine Optimization',
    description:
      'Get cited and recommended by ChatGPT, Claude, Perplexity, and Google AI Overviews.',
    price: 'From $1,500',
  },
  {
    slug: 'aeo',
    label: 'AEO',
    title: 'Answer Engine Optimization',
    description:
      'FAQ scaffolding, schema markup, and structured answers AI engines lift directly.',
    price: 'From $1,500',
  },
  {
    slug: 'seo-content',
    label: 'SEO',
    title: 'SEO & Content',
    description:
      'Rank for the searches that bring qualified clients — and build the content that earns the citations.',
  },
  {
    slug: 'web',
    label: 'Web',
    title: 'Web Design & Development',
    description:
      'Fast, credible, conversion-focused websites built on a GEO-ready foundation from day one.',
    price: 'From $7,500',
  },
  {
    slug: 'paid',
    label: 'Paid',
    title: 'Paid Ads & Lead Gen',
    description:
      'Targeted Google and LinkedIn campaigns that fill the pipeline with qualified, ready-to-talk prospects.',
  },
] as const;

export type Industry = (typeof INDUSTRIES)[number];
export type Service = {
  slug: string;
  label: string;
  title: string;
  description: string;
  price?: string;
};
