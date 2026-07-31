import type { Metadata } from "next";
import { reviews, reviewsSource } from "@/lib/reviews";
import { site } from "@/lib/site";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

const defaultDescription =
  "Пригін авто зі США під ключ: Copart, IAAI, доставка, розмитнення та реєстрація. 6+ років досвіду, понад 1000 клієнтів. Фіксована ціна до купівлі.";

export const seo = {
  defaultTitle: `${site.name} — пригін авто зі США під ключ`,
  titleTemplate: `%s | ${site.name}`,
  description: defaultDescription,
  keywords: [
    "пригін авто з США",
    "авто з США під ключ",
    "купити авто з США",
    "доставка авто з США",
    "Copart Україна",
    "IAAI Україна",
    "розмитнення авто",
    "авто з аукціонів США",
    "USAUTO",
    "пригон авто США",
  ],
  locale: "uk_UA",
  ogImagePath: "/assets/compressed_f931cf0b8e3ab9240765832327107acb.webp",
  ogImageAlt: "USAUTO — пригін авто зі США під ключ",
} as const;

export function buildRootMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  const ogImage = `${siteUrl}${seo.ogImagePath}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: seo.defaultTitle,
      template: seo.titleTemplate,
    },
    description: seo.description,
    keywords: [...seo.keywords],
    authors: [{ name: site.name }],
    creator: site.name,
    publisher: site.name,
    category: "automotive",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: seo.locale,
      url: siteUrl,
      siteName: site.name,
      title: seo.defaultTitle,
      description: seo.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 1500,
          alt: seo.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.defaultTitle,
      description: seo.description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    formatDetection: {
      telephone: true,
    },
  };
}

export function buildHomeMetadata(): Metadata {
  return {
    title: seo.defaultTitle,
    description: seo.description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: seo.defaultTitle,
      description: seo.description,
      url: getSiteUrl(),
    },
  };
}

export function buildHomeJsonLd() {
  const siteUrl = getSiteUrl();
  const phone = site.phoneHref.replace("tel:", "");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: site.name,
        description: seo.description,
        inLanguage: "uk-UA",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "AutoDealer",
        "@id": `${siteUrl}/#organization`,
        name: site.name,
        url: siteUrl,
        description: seo.description,
        telephone: phone,
        image: `${siteUrl}${seo.ogImagePath}`,
        logo: `${siteUrl}/assets/us-auto-rivne-logo.png`,
        areaServed: {
          "@type": "Country",
          name: "Україна",
        },
        sameAs: [...site.socials.map((item) => item.href), reviewsSource.href],
        priceRange: "$$",
        knowsAbout: [
          "пригін авто з США",
          "Copart",
          "IAAI",
          "розмитнення авто",
          "доставка авто з США",
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: reviewsSource.rating,
          reviewCount: reviewsSource.total,
          bestRating: 5,
          worstRating: 1,
        },
        review: reviews.map((item) => ({
          "@type": "Review",
          url: item.href,
          datePublished: `${item.date}-01`,
          inLanguage: "uk-UA",
          author: {
            "@type": "Person",
            name: item.author,
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: item.rating,
            bestRating: 5,
            worstRating: 1,
          },
          reviewBody: item.text,
        })),
      },
    ],
  };
}
