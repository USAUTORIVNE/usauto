import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { QuizProvider } from "@/components/quiz/quiz-provider";
import { SeoFaq } from "@/components/seo-faq";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buildHomeJsonLd, buildHomeMetadata } from "@/lib/seo";

export const metadata = buildHomeMetadata();

export default function Home() {
  return (
    <QuizProvider>
      <JsonLd data={buildHomeJsonLd()} />
      <div className="landing-compact">
        <SiteHeader />
        <main>
          <Hero />
          <SeoFaq />
        </main>
        <SiteFooter />
      </div>
    </QuizProvider>
  );
}
