"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { QuizModal } from "@/components/quiz/quiz-modal";
import type { LeadType } from "@/lib/leads";

type QuizContextValue = {
  open: (mode: LeadType) => void;
  close: () => void;
};

const QuizContext = createContext<QuizContextValue | null>(null);

export function useQuiz() {
  const context = useContext(QuizContext);

  if (!context) {
    throw new Error("useQuiz must be used inside <QuizProvider>");
  }

  return context;
}

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<LeadType | null>(null);

  const open = useCallback((next: LeadType) => setMode(next), []);
  const close = useCallback(() => setMode(null), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <QuizContext.Provider value={value}>
      {children}
      {mode ? <QuizModal mode={mode} onClose={close} /> : null}
    </QuizContext.Provider>
  );
}
