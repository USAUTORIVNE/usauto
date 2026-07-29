import type { ComponentType } from "react";
import { SiInstagram, SiTelegram, SiThreads } from "react-icons/si";
import { site, type SocialIcon } from "@/lib/site";

const icons: Record<SocialIcon, ComponentType<{ className?: string }>> = {
  instagram: SiInstagram,
  telegram: SiTelegram,
  threads: SiThreads,
};

export function SocialLinks({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const toneClass =
    tone === "light"
      ? "border-ink/20 text-ink/70 hover:border-accent hover:bg-accent hover:text-white"
      : "border-bone/20 text-bone/70 hover:border-accent hover:bg-accent hover:text-white";

  return (
    <div className={`items-center gap-2 ${className}`}>
      {site.socials.map((social) => {
        const Icon = icons[social.icon];

        return (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className={`grid size-9 place-items-center border-2 transition-colors duration-300 ${toneClass}`}
          >
            <Icon className="size-4" aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}
