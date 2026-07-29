import { ImageSlot } from "@/components/image-slot";
import { QuizButton } from "@/components/quiz-button";
import { media } from "@/lib/media";
import { site } from "@/lib/site";

const facts = [
  { value: "6+", label: "років досвіду в пригоні" },
  { value: "1000+", label: "задоволених клієнтів" },
  { value: "100%", label: "від покупки до реєстрації" },
];

const route = [
  "Copart · IAAI",
  "Огляд і ставка",
  "Порт США",
  "Морський фрахт",
  "Розмитнення",
  "СТО і підготовка",
  "Реєстрація",
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* акцентне світло позаду фото */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_78%_18%,rgba(232,69,42,0.18),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="container-page relative grid gap-10 pt-10 pb-12 sm:gap-12 sm:pt-12 sm:pb-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pt-16 lg:pb-14">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2.5">
            <span className="hatch h-2.5 w-12 -skew-x-12" aria-hidden="true" />
            <p className="label-caps text-accent-soft">Пригін під ключ</p>
          </div>

          <h1 className="display-title mt-5 text-[2.875rem] leading-[0.92] sm:mt-6 sm:text-[4rem] lg:text-[5.125rem]">
            Ваше авто
            <br />
            з США —
            <br />
            <span className="text-accent">наша турбота</span>
          </h1>

          <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-bone/65 sm:mt-7 sm:text-base">
            Викуповуємо на аукціонах Copart та IAAI, перевіряємо історію до ставки,
            веземо, розмитнюємо й ставимо на облік. Ціну «під ключ» фіксуємо до
            купівлі — без доплат у процесі.
          </p>

          <ul className="mt-7 grid gap-x-6 gap-y-3 sm:mt-8 sm:grid-cols-3 sm:gap-x-8">
            {facts.map((fact) => (
              <li key={fact.label} className="border-t-2 border-accent pt-2.5">
                <p className="font-display text-[2rem] font-extrabold italic tabular-nums sm:text-3xl">
                  {fact.value}
                </p>
                <p className="mt-1 text-[0.6875rem] leading-snug text-bone/55 sm:text-xs">
                  {fact.label}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:items-center sm:gap-3">
            <QuizButton variant="accent" className="px-7 py-3.5">
              Підібрати авто
            </QuizButton>
            <QuizButton mode="callback" variant="outlineDark" className="px-7 py-3.5">
              Замовити дзвінок
            </QuizButton>
          </div>

          <a
            href={site.phoneHref}
            className="mt-6 inline-flex w-fit items-center gap-2.5 text-bone/70 transition-colors duration-300 hover:text-accent-soft sm:mt-7"
          >
            <span className="label-caps text-bone/40">Телефон</span>
            <span className="font-display text-xl font-bold italic tabular-nums sm:text-2xl">
              {site.phone}
            </span>
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
          <ImageSlot
            slot={media.hero}
            className="aspect-4/5 w-full"
            sizes="(min-width: 1024px) 46vw, 88vw"
            priority
            tone="dark"
            fit="contain"
          />

          <div className="absolute -top-2.5 -left-2.5 hidden size-14 border-t-4 border-l-4 border-accent lg:block" />

          <p className="label-caps absolute right-0 -bottom-6 text-bone/35 sm:-bottom-7">
            Комплексні послуги під ключ
          </p>
        </div>
      </div>

      {/* біжуча смуга з етапами пригону */}
      <div className="flex overflow-hidden border-y border-bone/12 bg-graphite-soft py-3 select-none">
        <div className="flex shrink-0 animate-ticker items-center gap-7 pr-7 motion-reduce:animate-none">
          {[...route, ...route, ...route, ...route].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-7">
              <span className="label-caps whitespace-nowrap text-bone/55">{item}</span>
              <span className="size-1.5 shrink-0 rotate-45 bg-accent" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
