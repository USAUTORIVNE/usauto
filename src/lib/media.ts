/**
 * Усі картинки сайту в одному місці.
 *
 * Щоб вставити своє зображення:
 *   1. поклади файл у `public/assets/`
 *   2. впиши шлях у поле `src` (напр. "/assets/hero.jpg")
 *
 * Поки `src` = null, на сайті показується плейсхолдер із підказкою розміру.
 */
export type MediaSlot = {
  src: string | null;
  alt: string;
  hint: string;
};

export const media = {
  logo: {
    src: "/assets/us-auto-rivne-logo.png",
    alt: "US Auto Rivne",
    hint: "логотип",
  },
  hero: {
    src: null,
    alt: "Авто, пригнане з США",
    hint: "1200×1500 · JPG",
  },
  heroSecondary: {
    src: null,
    alt: "Завантаження авто в контейнер",
    hint: "600×600 · JPG",
  },
} satisfies Record<string, MediaSlot>;
