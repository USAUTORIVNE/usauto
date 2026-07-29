export const site = {
  name: "USAUTO",
  tagline: "Ваше авто з США — наша турбота",
  phone: "+38 (073) 981-01-56",
  phoneHref: "tel:+380739810156",
  socials: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/_usauto_rv/",
      icon: "instagram" as const,
    },
    {
      label: "Telegram",
      href: "https://t.me/usauto_rv",
      icon: "telegram" as const,
    },
    {
      label: "Threads",
      href: "https://www.threads.net/@_usauto_rv",
      icon: "threads" as const,
    },
  ],
} as const;

export type SocialIcon = (typeof site.socials)[number]["icon"];
