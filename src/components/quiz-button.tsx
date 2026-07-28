"use client";

import { useQuiz } from "@/components/quiz/quiz-provider";
import type { LeadType } from "@/lib/leads";

const variants = {
  accent: "bg-accent text-white hover:bg-accent-soft",
  light: "bg-bone text-ink hover:bg-white",
  outline: "border-2 border-ink/20 text-ink hover:border-accent hover:text-accent",
  outlineDark: "border-2 border-bone/25 text-bone hover:border-accent hover:text-accent",
} as const;

export function QuizButton({
  mode = "quiz",
  variant = "accent",
  className = "",
  children,
}: {
  mode?: LeadType;
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useQuiz();

  return (
    <button
      type="button"
      onClick={() => open(mode)}
      className={`label-caps clip-notch inline-flex items-center justify-center gap-2.5 px-8 py-4 transition-colors duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
