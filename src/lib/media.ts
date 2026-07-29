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
    alt: "USAUTO — пригін авто зі США",
    hint: "логотип",
  },
  hero: {
    src: "/assets/compressed_f931cf0b8e3ab9240765832327107acb.webp",
    alt: "Преміальне авто з США — послуги пригону під ключ від USAUTO",
    hint: "1200×1500 · JPG",
  },
} satisfies Record<string, MediaSlot>;
