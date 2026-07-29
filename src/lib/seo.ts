import type { Metadata } from "next";
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

export const faqItems = [
  {
    question: "Скільки коштує пригін авто з США?",
    answer:
      "Вартість залежить від авто, аукціону та доставки. Ми прораховуємо ціну «під ключ» до купівлі — з доставкою, розмитненням і підготовкою, без прихованих доплат у процесі.",
  },
  {
    question: "Які аукціони ви використовуєте?",
    answer:
      "Працюємо з аукціонами Copart та IAAI. Перед ставкою перевіряємо історію авто, фото та документи, щоб уникнути неприємних сюрпризів після покупки.",
  },
  {
    question: "Скільки триває доставка авто з США в Україну?",
    answer:
      "Термін залежить від порту відправлення та маршруту, зазвичай від кількох тижнів до двох місяців. На кожному етапі — від ставки до реєстрації — ви отримуєте супровід менеджера.",
  },
  {
    question: "Що входить у послугу «під ключ»?",
    answer:
      "Підбір і викуп на аукціоні, доставка в порт США, морський фрахт, митне оформлення, підготовка на СТО за потреби та постановка на облік в Україні.",
  },
] as const;

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
        sameAs: site.socials.map((item) => item.href),
        priceRange: "$$",
        knowsAbout: [
          "пригін авто з США",
          "Copart",
          "IAAI",
          "розмитнення авто",
          "доставка авто з США",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}
