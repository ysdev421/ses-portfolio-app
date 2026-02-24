import { useEffect } from 'react';

const upsertMeta = (attr, key, value) => {
  if (!value) return;
  let element = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
};

const upsertLink = (rel, href) => {
  if (!href) return;
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const upsertJsonLd = (id, data) => {
  if (!data) return;
  let element = document.head.querySelector(`script[data-seo-id="${id}"]`);
  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.setAttribute('data-seo-id', id);
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);
};

export const useSeo = ({
  enabled = true,
  title,
  description,
  path = '/',
  image = '/logo512.png',
  type = 'website',
  jsonLd,
}) => {
  useEffect(() => {
    if (!enabled) return undefined;

    const baseUrl = window.location.origin;
    const canonicalUrl = new URL(path, baseUrl).toString();
    const imageUrl = new URL(image, baseUrl).toString();
    const previousTitle = document.title;

    if (title) document.title = title;
    upsertMeta('name', 'description', description);
    upsertLink('canonical', canonicalUrl);

    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:locale', 'ja_JP');
    upsertMeta('property', 'og:site_name', 'SESキャリア記録');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', imageUrl);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', imageUrl);

    if (jsonLd) {
      upsertJsonLd('page', jsonLd);
    }

    return () => {
      if (previousTitle) {
        document.title = previousTitle;
      }
    };
  }, [description, enabled, image, jsonLd, path, title, type]);
};
