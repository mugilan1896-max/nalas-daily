import React, { useEffect } from 'react';
import { BUSINESS_INFO } from '../../constants/businessInfo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
  type?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Nala's Daily | Homely Meal Subscription and Food Delivery",
  description = "Affordable home-style breakfast, lunch and dinner with individual orders, weekly packages and monthly meal plans.",
  path = "",
  type = "website"
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Helper to set/update meta tags
    const setMetaTag = (attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Update Standard Meta
    setMetaTag('name', 'description', description);

    // 4. Update OpenGraph
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', `${BUSINESS_INFO.websiteUrl}${path}`);
    setMetaTag('property', 'og:site_name', BUSINESS_INFO.name);

    // 5. Update Twitter
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);

    // 6. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${BUSINESS_INFO.websiteUrl}${path}`);

    // 7. Inject JSON-LD Structured Data
    const schemaScriptId = 'schema-local-business';
    let script = document.getElementById(schemaScriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = schemaScriptId;
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": BUSINESS_INFO.name,
      "image": BUSINESS_INFO.logoUrl,
      "@id": BUSINESS_INFO.websiteUrl,
      "url": BUSINESS_INFO.websiteUrl,
      "telephone": BUSINESS_INFO.phone,
      "email": BUSINESS_INFO.email,
      "priceRange": BUSINESS_INFO.priceRange,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": BUSINESS_INFO.address.split(',')[0],
        "addressLocality": BUSINESS_INFO.address.split(',')[1]?.trim(),
        "addressRegion": "Tamil Nadu",
        "postalCode": "600001",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": BUSINESS_INFO.latitude,
        "longitude": BUSINESS_INFO.longitude
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "07:00",
        "closes": "22:00"
      },
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": BUSINESS_INFO.latitude,
          "longitude": BUSINESS_INFO.longitude
        },
        "geoRadius": "10000"
      }
    };

    script.textContent = JSON.stringify(schemaData);

    return () => {
      // Optional: Cleanup specific tags on unmount if needed, though they get overridden on next mount anyway.
    };
  }, [title, description, path, type]);

  return null;
};
