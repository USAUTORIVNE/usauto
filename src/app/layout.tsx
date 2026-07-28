import type { Metadata } from "next";
import { Fira_Sans_Extra_Condensed, Inter_Tight } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Inter_Tight({
  variable: "--font-sans-src",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const display = Fira_Sans_Extra_Condensed({
  variable: "--font-display-src",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} — авто зі США під ключ`,
  description:
    "Ваше авто з США — наша турбота. 6+ років досвіду, більше 1000 задоволених клієнтів. Комплексні послуги від покупки до реєстрації.",
  openGraph: {
    title: `${site.name} — ваше авто з США, наша турбота`,
    description:
      "Підбір, купівля, доставка та реєстрація авто зі США. Повний супровід під ключ.",
    locale: "uk_UA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${sans.variable} ${display.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
