import type { LeadInput, LeadType } from "@/lib/leads";
import { zodFieldErrors } from "@/lib/validation/errors";
import { leadPayloadSchema } from "@/lib/validation/schemas";
import {
  sanitizeAnswers,
  validateQuizAnswers,
} from "@/lib/validation/quiz-answers";

export function parseLeadInput(
  raw: unknown,
): { ok: true; data: LeadInput } | { ok: false; errors: Record<string, string> } {
  const parsed = leadPayloadSchema.safeParse(raw);

  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const answers = sanitizeAnswers(parsed.data.answers);
  const leadType = parsed.data.leadType as LeadType;

  if (leadType === "quiz") {
    const quizErrors = validateQuizAnswers(answers);
    if (Object.keys(quizErrors).length > 0) {
      return { ok: false, errors: quizErrors };
    }
  } else if (Object.keys(answers).length > 0) {
    return { ok: false, errors: { answers: "Зайві дані у заявці на дзвінок" } };
  }

  return {
    ok: true,
    data: {
      leadType,
      name: parsed.data.name,
      phone: parsed.data.phone,
      comment: parsed.data.comment,
      answers,
      pageUrl: parsed.data.pageUrl,
      utm: parsed.data.utm,
    },
  };
}
