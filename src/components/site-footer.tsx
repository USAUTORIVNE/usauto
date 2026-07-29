import Image from "next/image";
import { QuizButton } from "@/components/quiz-button";
import { SocialLinks } from "@/components/social-links";
import { formatYear } from "@/lib/format";
import { media } from "@/lib/media";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-graphite-soft">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 sm:gap-11 lg:grid-cols-3 lg:gap-12">
        <div>
          {media.logo.src ? (
            <span className="relative block h-11 w-40 overflow-hidden bg-white">
              <Image
                src={media.logo.src}
                alt={media.logo.alt}
                fill
                sizes="176px"
                className="object-contain p-2"
              />
            </span>
          ) : (
            <p className="font-display text-2xl font-extrabold italic uppercase">
              {site.name}
            </p>
          )}
          <p className="mt-4 max-w-xs text-[0.8125rem] leading-relaxed text-bone/50 sm:mt-5 sm:text-sm">
            {site.tagline}. Пригін авто з аукціонів США під ключ — від ставки до
            номерних знаків.
          </p>
          <SocialLinks className="mt-5 flex sm:mt-6" tone="dark" />
        </div>

        <div>
          <p className="label-caps text-accent-soft">Контакти</p>
          <a
            href={site.phoneHref}
            className="mt-4 block font-display text-2xl font-extrabold italic tabular-nums transition-colors duration-300 hover:text-accent-soft sm:mt-5 sm:text-3xl"
          >
            {site.phone}
          </a>
        </div>

        <div className="border-t-2 border-accent pt-5 lg:border-t-0 lg:border-l-2 lg:pt-0 lg:pl-9">
          <p className="font-display text-2xl leading-none font-extrabold italic uppercase sm:text-3xl">
            Готові пригнати
            <br />
            своє авто?
          </p>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-bone/55 sm:mt-4 sm:text-sm">
            П’ять коротких питань — і ми надішлемо варіанти з цінами під ключ.
          </p>
          <QuizButton variant="accent" className="mt-5 w-full px-7 py-3.5 sm:mt-6 sm:w-auto">
            Підібрати авто
          </QuizButton>
        </div>
      </div>

      <div className="border-t border-bone/10">
        <p className="container-page py-5 text-xs tracking-wide text-bone/35">
          © {formatYear()} {site.name}. Дані заявок використовуються лише
          для зв’язку з вами.
        </p>
      </div>
    </footer>
  );
}
