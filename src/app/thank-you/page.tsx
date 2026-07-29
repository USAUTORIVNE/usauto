import type { Metadata } from "next";
import { QuizProvider } from "@/components/quiz/quiz-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThankYouTracking } from "@/components/thank-you-tracking";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Дякуємо — ${site.name}`,
  description: "Вашу заявку отримано. Менеджер зв’яжеться з вами найближчим часом.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string }>;
}) {
  const params = await searchParams;
  const leadType = params.lead === "callback" ? "callback" : "quiz";

  return (
    <QuizProvider>
      <div className="landing-compact flex min-h-full flex-col">
        <ThankYouTracking leadType={leadType} />
        <SiteHeader />

        <main className="flex flex-1 items-center">
        <section className="container-page w-full py-16 sm:py-20">
          <div className="mx-auto max-w-xl text-center">
            <div className="mx-auto grid size-14 place-items-center bg-accent text-white">
              <svg
                viewBox="0 0 16 16"
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m3 8.5 3.2 3.2L13 4.8" />
              </svg>
            </div>

            <p className="label-caps mt-6 text-accent-soft">Заявку прийнято</p>

            <h1 className="display-title mt-4 text-[2.875rem] sm:text-[4rem]">
              Дякуємо
              <br />
              <span className="text-accent">за заявку</span>
            </h1>

            <p className="mt-6 text-[0.9375rem] leading-relaxed text-bone/65 sm:text-base">
              {leadType === "callback"
                ? "Ми отримали ваші контакти. Зв’яжемося з вами в робочі години, зазвичай протягом 15 хвилин."
                : "Ми отримали ваші відповіді. Менеджер надішле варіанти авто з прорахунком ціни «під ключ»."}
            </p>

            <div className="mt-8 border-t border-bone/12 pt-8">
              <p className="label-caps text-bone/40">Телефон</p>
              <a
                href={site.phoneHref}
                className="mt-3 inline-block font-display text-2xl font-extrabold italic tabular-nums text-bone transition-colors duration-300 hover:text-accent-soft sm:text-3xl"
              >
                {site.phone}
              </a>
            </div>
          </div>
        </section>
      </main>

        <SiteFooter />
      </div>
    </QuizProvider>
  );
}
