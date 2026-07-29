import type { Metadata } from "next";
import { Fira_Sans_Extra_Condensed, Inter_Tight } from "next/font/google";
import { MetaPixel } from "@/components/meta-pixel";
import { buildRootMetadata } from "@/lib/seo";
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

export const metadata: Metadata = buildRootMetadata();

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
      <body className="flex min-h-full flex-col">
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
