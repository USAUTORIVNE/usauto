import { Hero } from "@/components/hero";
import { QuizProvider } from "@/components/quiz/quiz-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <QuizProvider>
      <div className="landing-compact">
        <SiteHeader />
        <main>
          <Hero />
        </main>
        <SiteFooter />
      </div>
    </QuizProvider>
  );
}
