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

      <div className="container-page relative grid gap-16 pt-14 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pt-20">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <span className="hatch h-3 w-14 -skew-x-12" aria-hidden="true" />
            <p className="label-caps text-accent-soft">
              США → {site.city} · пригін під ключ
            </p>
          </div>

          <h1 className="display-title mt-7 text-[3.25rem] sm:text-7xl lg:text-[5.75rem]">
            Ваше авто
            <br />
            з США —
            <br />
            <span className="text-accent">наша турбота</span>
          </h1>

          <p className="mt-8 max-w-xl text-[1.0625rem] leading-relaxed text-bone/65">
            Викуповуємо на аукціонах Copart та IAAI, перевіряємо історію до ставки,
            веземо, розмитнюємо й ставимо на облік. Ціну «під ключ» фіксуємо до
            купівлі — без доплат у процесі.
          </p>

          <ul className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-3">
            {facts.map((fact) => (
              <li key={fact.label} className="border-t-2 border-accent pt-3">
                <p className="font-display text-4xl font-extrabold italic tabular-nums">
                  {fact.value}
                </p>
                <p className="mt-1.5 text-xs leading-snug text-bone/55">{fact.label}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <QuizButton variant="accent">Підібрати авто</QuizButton>
            <QuizButton mode="callback" variant="outlineDark">
              Замовити дзвінок
            </QuizButton>
          </div>

          <a
            href={site.phoneHref}
            className="mt-8 inline-flex w-fit items-center gap-3 text-bone/70 transition-colors duration-300 hover:text-accent-soft"
          >
            <span className="label-caps text-bone/40">Телефон</span>
            <span className="font-display text-2xl font-bold italic tabular-nums">
              {site.phone}
            </span>
          </a>
        </div>

        <div className="relative">
          <ImageSlot
            slot={media.hero}
            className="aspect-4/5 w-full border border-bone/12"
            sizes="(min-width: 1024px) 46vw, 100vw"
            priority
            tone="dark"
          />

          <div className="absolute -top-3 -left-3 hidden size-16 border-t-4 border-l-4 border-accent lg:block" />

          <ImageSlot
            slot={media.heroSecondary}
            className="absolute -bottom-8 -left-8 hidden size-44 border-4 border-graphite lg:block"
            sizes="176px"
            tone="dark"
          />

          <p className="label-caps absolute right-0 -bottom-8 text-bone/35">
            Комплексні послуги під ключ
          </p>
        </div>
      </div>

      {/* біжуча смуга з етапами пригону */}
      <div className="flex overflow-hidden border-y border-bone/12 bg-graphite-soft py-3.5 select-none">
        <div className="flex shrink-0 animate-ticker items-center gap-8 pr-8 motion-reduce:animate-none">
          {[...route, ...route, ...route, ...route].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-8">
              <span className="label-caps whitespace-nowrap text-bone/55">{item}</span>
              <span className="size-1.5 shrink-0 rotate-45 bg-accent" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
