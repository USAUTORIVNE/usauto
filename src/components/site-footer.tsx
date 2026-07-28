import Image from "next/image";
import { QuizButton } from "@/components/quiz-button";
import { SocialLinks } from "@/components/social-links";
import { media } from "@/lib/media";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-graphite-soft">
      <div className="container-page grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          {media.logo.src ? (
            <span className="relative block h-12 w-44 overflow-hidden bg-white">
              <Image
                src={media.logo.src}
                alt={media.logo.alt}
                fill
                sizes="176px"
                className="object-contain p-2"
              />
            </span>
          ) : (
            <p className="font-display text-3xl font-extrabold italic uppercase">
              {site.name}
            </p>
          )}
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-bone/50">
            {site.tagline}. Пригін авто з аукціонів США під ключ — від ставки до
            номерних знаків.
          </p>
          <SocialLinks className="mt-6 flex" tone="dark" />
        </div>

        <div>
          <p className="label-caps text-accent-soft">Контакти</p>
          <a
            href={site.phoneHref}
            className="mt-5 block font-display text-3xl font-extrabold italic tabular-nums transition-colors duration-300 hover:text-accent-soft"
          >
            {site.phone}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="mt-3 block text-sm text-bone/55 transition-colors duration-300 hover:text-bone"
          >
            {site.email}
          </a>
          <p className="mt-2 text-sm text-bone/55">{site.city}</p>
        </div>

        <div className="border-t-2 border-accent pt-6 lg:border-t-0 lg:border-l-2 lg:pt-0 lg:pl-10">
          <p className="font-display text-3xl leading-none font-extrabold italic uppercase">
            Готові пригнати
            <br />
            своє авто?
          </p>
          <p className="mt-4 text-sm leading-relaxed text-bone/55">
            П’ять коротких питань — і ми надішлемо варіанти з цінами під ключ.
          </p>
          <QuizButton variant="accent" className="mt-6 w-full sm:w-auto">
            Підібрати авто
          </QuizButton>
        </div>
      </div>

      <div className="border-t border-bone/10">
        <p className="container-page py-5 text-xs tracking-wide text-bone/35">
          © {new Date().getFullYear()} {site.name}. Дані заявок використовуються лише
          для зв’язку з вами.
        </p>
      </div>
    </footer>
  );
}
