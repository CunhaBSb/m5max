/**
 * Utilitários SEO e meta tags para a aplicação
 */

import { contactInfo } from "@/data/homepage-data";

export interface SEOConfig {
  readonly title: string;
  readonly description: string;
  readonly keywords?: string;
  readonly ogImage?: string;
  readonly ogType?: "website" | "article" | "product";
  readonly canonical?: string;
  readonly noindex?: boolean;
}

export const defaultSEO: SEOConfig = {
  title: "M5 MAX Produções - Shows Pirotécnicos Profissionais | 40+ Anos de Experiência",
  description: "Especialistas em shows pirotécnicos há mais de 40 anos. Transformamos eventos em espetáculos inesquecíveis com segurança total. Casamentos, formaturas, réveillon e eventos corporativos em todo o Brasil.",
  keywords: "shows pirotécnicos, fogos de artifício, pirotecnia profissional, casamentos, formaturas, réveillon, eventos corporativos, espetáculos, M5 MAX Produções",
  ogImage: "/og-image.jpg",
  ogType: "website",
  canonical: "https://m5maxproducoes.com.br"
} as const;

export const generateStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // Organização
      {
        "@type": "Organization",
        "@id": "https://m5maxproducoes.com.br/#organization",
        "name": "M5 MAX Produções",
        "url": "https://m5maxproducoes.com.br",
        "logo": {
          "@type": "ImageObject",
          "url": "https://m5maxproducoes.com.br/logo.png",
          "width": 300,
          "height": 300
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": contactInfo.phoneRaw,
          "contactType": "customer service",
          "availableLanguage": "Portuguese"
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Luziânia",
          "addressRegion": "GO",
          "addressCountry": "BR"
        },
        "sameAs": [
          contactInfo.instagram,
          contactInfo.facebook,
          contactInfo.youtube
        ]
      },
      // Website
      {
        "@type": "WebSite",
        "@id": "https://m5maxproducoes.com.br/#website",
        "url": "https://m5maxproducoes.com.br",
        "name": "M5 MAX Produções",
        "description": defaultSEO.description,
        "publisher": {
          "@id": "https://m5maxproducoes.com.br/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://m5maxproducoes.com.br/?s={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      // Serviços
      {
        "@type": "Service",
        "@id": "https://m5maxproducoes.com.br/#service",
        "name": "Shows Pirotécnicos Profissionais",
        "description": "Espetáculos pirotécnicos personalizados para eventos especiais",
        "provider": {
          "@id": "https://m5maxproducoes.com.br/#organization"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Brasil"
        },
        "category": "Entertainment Services",
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "priceRange": "R$ 750 - R$ 8500"
        }
      },
      // Página Principal
      {
        "@type": "WebPage",
        "@id": "https://m5maxproducoes.com.br/#webpage",
        "url": "https://m5maxproducoes.com.br",
        "name": defaultSEO.title,
        "description": defaultSEO.description,
        "isPartOf": {
          "@id": "https://m5maxproducoes.com.br/#website"
        },
        "about": {
          "@id": "https://m5maxproducoes.com.br/#organization"
        },
        "mainEntity": {
          "@id": "https://m5maxproducoes.com.br/#service"
        }
      }
    ]
  };
};

export const generateMetaTags = (seo: Partial<SEOConfig> = {}) => {
  const config = { ...defaultSEO, ...seo };
  
  return [
    // Basic meta tags
    { name: "description", content: config.description },
    { name: "keywords", content: config.keywords || defaultSEO.keywords },
    { name: "author", content: "M5 MAX Produções" },
    { name: "robots", content: config.noindex ? "noindex,nofollow" : "index,follow" },
    
    // Open Graph
    { property: "og:title", content: config.title },
    { property: "og:description", content: config.description },
    { property: "og:image", content: config.ogImage || defaultSEO.ogImage },
    { property: "og:type", content: config.ogType || defaultSEO.ogType },
    { property: "og:url", content: config.canonical || defaultSEO.canonical },
    { property: "og:site_name", content: "M5 MAX Produções" },
    { property: "og:locale", content: "pt_BR" },
    
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: config.title },
    { name: "twitter:description", content: config.description },
    { name: "twitter:image", content: config.ogImage || defaultSEO.ogImage },
    
    // Technical meta tags
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#f97316" },
    { httpEquiv: "Content-Type", content: "text/html; charset=utf-8" },
    
    // Business specific
    { name: "geo.region", content: "BR-GO" },
    { name: "geo.placename", content: "Luziânia" },
    { name: "geo.position", content: "-16.243569;-47.968870" },
    { name: "ICBM", content: "-16.243569, -47.968870" }
  ];
};

// Hook para injetar meta tags dinamicamente
export const usePageSEO = (seo: Partial<SEOConfig>) => {
  if (typeof document === 'undefined') return;
  
  const metaTags = generateMetaTags(seo);
  
  // Atualizar title
  document.title = seo.title || defaultSEO.title;
  
  // Atualizar meta tags
  metaTags.forEach(({ name, property, content, httpEquiv }) => {
    const selector = name ? `meta[name="${name}"]` : 
                    property ? `meta[property="${property}"]` :
                    httpEquiv ? `meta[http-equiv="${httpEquiv}"]` : null;
    
    if (!selector) return;
    
    let meta = document.querySelector(selector) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      if (name) meta.name = name;
      if (property) meta.setAttribute('property', property);
      if (httpEquiv) meta.httpEquiv = httpEquiv;
      document.head.appendChild(meta);
    }
    
    meta.content = content || '';
  });
  
  // Atualizar canonical
  if (seo.canonical) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = seo.canonical;
  }
};