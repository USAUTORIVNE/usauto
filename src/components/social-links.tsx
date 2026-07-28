import { site, type SocialIcon } from "@/lib/site";

const icons: Record<SocialIcon, React.ReactNode> = {
  instagram: (
    <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.7 2.2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z" />
  ),
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
      {site.socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className={`grid size-9 place-items-center border-2 transition-colors duration-300 ${toneClass}`}
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
            {icons[social.icon]}
          </svg>
        </a>
      ))}
    </div>
  );
}
