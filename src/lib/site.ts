export const site = {
  name: "US Auto Rivne",
  tagline: "Ваше авто з США — наша турбота",
  phone: "+38 (073) 981-01-56",
  phoneHref: "tel:+380739810156",
  email: "hello@example.com",
  city: "Рівне",
  socials: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/reel/DbNFvyGsJLF/?igsh=ODh1Zmp4cHpoOWRm",
      icon: "instagram" as const,
    },
  ],
} as const;

export type SocialIcon = (typeof site.socials)[number]["icon"];
