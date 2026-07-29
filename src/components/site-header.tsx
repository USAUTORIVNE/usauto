import Image from "next/image";
import { QuizButton } from "@/components/quiz-button";
import { SocialLinks } from "@/components/social-links";
import { media } from "@/lib/media";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-graphite/95 backdrop-blur-md">
      <div className="h-[3px] w-full bg-accent" aria-hidden="true" />

      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4 border-b border-bone/10 sm:gap-6">
        <a href="#top" className="flex shrink-0 items-center" aria-label={site.name}>
          {media.logo.src ? (
            <span className="relative block h-9 w-[7.75rem] overflow-hidden bg-white px-2 sm:h-10 sm:w-36">
              <Image
                src={media.logo.src}
                alt={media.logo.alt}
                fill
                sizes="160px"
                priority
                className="object-contain p-1.5"
              />
            </span>
          ) : (
            <span className="font-display text-xl font-extrabold italic uppercase sm:text-2xl">
              {site.name}
            </span>
          )}
        </a>

        <div className="flex items-center gap-3 sm:gap-4">
          <SocialLinks className="hidden md:flex" tone="dark" />
          <a
            href={site.phoneHref}
            className="hidden font-display text-lg font-bold italic tabular-nums text-bone/85 transition-colors duration-300 hover:text-accent-soft sm:block"
          >
            {site.phone}
          </a>
          <QuizButton mode="callback" variant="accent" className="px-5 py-2.5 sm:px-6 sm:py-3">
            Зв’язатися
          </QuizButton>
        </div>
      </div>
    </header>
  );
}
