/**
 * Schema.org JSON-LD builders. All page-level structured data flows through here.
 * Critical for GEO: structured data is a 2-3x weight multiplier in AI citation reranking.
 */
import { SITE } from './site';

export type Schema = Record<string, unknown>;

export function organization(): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    description: SITE.description,
    email: SITE.email,
    founder: {
      '@type': 'Person',
      name: SITE.founder.name,
      jobTitle: SITE.founder.role,
      email: SITE.founder.email,
    },
    address: {
      '@type': 'PostalAddress',
      ...SITE.address,
    },
    sameAs: [SITE.social.linkedin, SITE.social.twitter],
  };
}

export function localBusiness(): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      '@type': 'PostalAddress',
      ...SITE.address,
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Rhode Island' },
      { '@type': 'AdministrativeArea', name: 'Massachusetts' },
      { '@type': 'AdministrativeArea', name: 'Connecticut' },
      { '@type': 'Country', name: 'United States' },
    ],
    priceRange: '$$',
  };
}

export function person(): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.founder.name,
    jobTitle: SITE.founder.role,
    email: SITE.founder.email,
    worksFor: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
    description: SITE.founder.bioShort,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Providence',
      addressRegion: 'RI',
      addressCountry: 'US',
    },
  };
}

export function service(opts: {
  name: string;
  description: string;
  schemaType?: string;
  price?: string;
}): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': opts.schemaType ?? 'Service',
    name: opts.name,
    description: opts.description,
    provider: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    ...(opts.price ? { offers: { '@type': 'Offer', price: opts.price, priceCurrency: 'USD' } } : {}),
  };
}

export type FaqItem = { q: string; a: string };

export function faqPage(faqs: FaqItem[]): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };
}

export function article(opts: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: {
      '@type': 'Person',
      name: opts.authorName ?? SITE.founder.name,
      url: `${SITE.url}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: `${SITE.url}/insights/${opts.slug}`,
    image: opts.image ?? `${SITE.url}/og-default.png`,
  };
}

export function breadcrumbs(items: { label: string; href: string }[]): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.href.startsWith('http') ? item.href : `${SITE.url}${item.href}`,
    })),
  };
}
