import Image from "next/image";
import {
  formatReviewDate,
  reviewInitials,
  reviews,
  reviewsSource,
  type Review,
} from "@/lib/reviews";

function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.4l2.94 6.02 6.62.92-4.82 4.63 1.16 6.62L12 17.47l-5.9 3.12 1.16-6.62L2.44 9.34l6.62-.92z" />
    </svg>
  );
}

function Stars({ value, className = "" }: { value: number; className?: string }) {
  const stars = Array.from({ length: 5 });

  return (
    <span
      className={`relative inline-flex w-fit ${className}`}
      role="img"
      aria-label={`Оцінка ${value.toLocaleString("uk-UA")} з 5`}
    >
      <span className="flex gap-0.5 text-bone/15">
        {stars.map((_, index) => (
          <Star key={index} className="size-3.5 shrink-0" />
        ))}
      </span>

      <span
        className="absolute inset-y-0 left-0 flex gap-0.5 overflow-hidden text-accent"
        style={{ width: `${(value / 5) * 100}%` }}
        aria-hidden="true"
      >
        {stars.map((_, index) => (
          <Star key={index} className="size-3.5 shrink-0" />
        ))}
      </span>
    </span>
  );
}

function ReviewPhotos({ review }: { review: Review }) {
  if (!review.photos?.length) return null;

  return (
    <div className="mt-4 flex gap-2">
      {review.photos.map((photo) => (
        <span
          key={photo.src}
          className="relative aspect-4/3 flex-1 overflow-hidden bg-graphite-soft"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 130px, (min-width: 640px) 180px, 30vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="mb-4 break-inside-avoid lg:mb-5">
      <a
        href={review.href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="group block border border-bone/12 bg-graphite p-5 transition-colors duration-300 hover:border-accent lg:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="grid size-10 shrink-0 place-items-center bg-accent/12 font-display text-sm font-extrabold italic text-accent-soft"
              aria-hidden="true"
            >
              {reviewInitials(review.author)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold transition-colors duration-300 group-hover:text-accent-soft">
                {review.author}
              </p>
              <p className="label-caps mt-1 text-bone/35">
                {formatReviewDate(review.date)}
              </p>
            </div>
          </div>

          <Stars value={review.rating} className="mt-1 shrink-0" />
        </div>

        <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-bone/65">
          {review.text}
        </p>

        <ReviewPhotos review={review} />
      </a>
    </article>
  );
}

export function Reviews() {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="border-t border-bone/10 bg-graphite-soft"
    >
      <div className="container-page py-14 sm:py-16 lg:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="hatch h-2.5 w-12 -skew-x-12" aria-hidden="true" />
              <p className="label-caps text-accent-soft">Реальні історії</p>
            </div>

            <h2
              id="reviews-heading"
              className="display-title mt-5 text-[2.25rem] sm:text-[3rem] lg:text-[3.75rem]"
            >
              Відгуки
              <br />
              <span className="text-accent">про нас</span>
            </h2>

            <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-bone/60 sm:text-base">
              Нижче — відгуки клієнтів із каталогу {reviewsSource.label} разом із
              фото пригнаних авто. Кожен відгук відкривається на першоджерелі —
              можете перевірити самостійно.
            </p>
          </div>

          <a
            href={reviewsSource.href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="clip-notch flex w-fit shrink-0 items-center gap-4 border-2 border-bone/15 px-5 py-4 transition-colors duration-300 hover:border-accent"
          >
            <p className="font-display text-[2.75rem] leading-none font-extrabold italic tabular-nums">
              {reviewsSource.rating.toLocaleString("uk-UA")}
            </p>
            <span className="block h-11 w-px bg-bone/15" aria-hidden="true" />
            <span className="block">
              <Stars value={reviewsSource.rating} />
              <span className="label-caps mt-2 block text-bone/45">
                {reviewsSource.total} відгуків
              </span>
              <span className="label-caps mt-1 block text-accent-soft">
                {reviewsSource.label}
              </span>
            </span>
          </a>
        </div>

        <div className="mt-10 gap-4 sm:columns-2 lg:mt-12 lg:columns-3 lg:gap-5">
          {reviews.map((review) => (
            <ReviewCard key={review.href} review={review} />
          ))}
        </div>

        <div className="mt-6 flex justify-center sm:mt-8">
          <a
            href={reviewsSource.href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="clip-notch group inline-flex items-center gap-3.5 border-2 border-bone/25 px-6 py-4 transition-colors duration-300 hover:border-accent sm:gap-4 sm:px-8"
          >
            <span className="font-display text-xl leading-none font-extrabold italic uppercase transition-colors duration-300 group-hover:text-accent-soft sm:text-2xl">
              Усі {reviewsSource.total} відгуків на {reviewsSource.label}
            </span>
            <span
              className="size-2 shrink-0 rotate-45 bg-accent transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
