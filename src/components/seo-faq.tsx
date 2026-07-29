import { faqItems } from "@/lib/seo";

export function SeoFaq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-t border-bone/10 bg-graphite"
    >
      <div className="container-page py-12 sm:py-14">
        <div className="max-w-3xl">
          <p className="label-caps text-accent-soft">Часті питання</p>
          <h2
            id="faq-heading"
            className="display-title mt-4 text-[2rem] leading-none sm:text-[2.75rem]"
          >
            Пригін авто зі США — відповіді на головне
          </h2>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-bone/60 sm:text-base">
            Коротко про вартість, терміни, аукціони та те, що входить у послугу
            «під ключ» від USAUTO.
          </p>
        </div>

        <dl className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
          {faqItems.map((item) => (
            <div
              key={item.question}
              className="border border-bone/10 bg-graphite-soft p-5 sm:p-6"
            >
              <dt className="font-display text-lg font-bold italic leading-snug text-bone sm:text-xl">
                {item.question}
              </dt>
              <dd className="mt-3 text-[0.875rem] leading-relaxed text-bone/60 sm:text-[0.9375rem]">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
