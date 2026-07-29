import Image from "next/image";
import type { MediaSlot } from "@/lib/media";

export function ImageSlot({
  slot,
  className = "",
  sizes = "100vw",
  priority = false,
  tone = "light",
  fit = "cover",
}: {
  slot: MediaSlot;
  className?: string;
  sizes?: string;
  priority?: boolean;
  tone?: "light" | "dark";
  fit?: "cover" | "contain";
}) {
  const isDark = tone === "dark";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {slot.src ? (
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={fit === "contain" ? "object-contain" : "object-cover"}
        />
      ) : (
        <div
          className={`absolute inset-0 grid place-items-center p-6 text-center ${
            isDark ? "bg-graphite-soft" : "bg-paper-deep"
          }`}
        >
          <div className={isDark ? "text-bone/45" : "text-ink/45"}>
            <svg
              viewBox="0 0 24 24"
              className="mx-auto size-7 opacity-70"
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2.5" y="4.5" width="19" height="15" />
              <circle cx="8.5" cy="10" r="1.5" />
              <path d="m3.5 19 6-6.5 4 4 3-3 4.5 5.5" />
            </svg>
            <p className="label-caps mt-3">{slot.alt}</p>
            <p className="mt-1.5 text-[11px] tracking-wide opacity-70">{slot.hint}</p>
          </div>
        </div>
      )}
    </div>
  );
}
