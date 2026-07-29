import {
  BUDGET_PRESETS,
  MIN_BUDGET_USD,
  quizSteps,
  UNDECIDED,
} from "@/lib/quiz-config";

const QUIZ_ANSWER_KEYS = ["body_type", "fuel_type", "year", "budget", "brand", "car_wish"] as const;

const OPTION_VALUES = quizSteps.reduce<Record<string, Set<string>>>((acc, step) => {
  if (step.layout === "cards" || step.layout === "compact") {
    acc[step.id] = new Set(step.options.map((option) => option.value));
  }
  return acc;
}, {});

const REQUIRED_QUIZ_KEYS = ["body_type", "fuel_type", "year", "budget", "brand", "car_wish"] as const;

const CUSTOM_BUDGET_PATTERN = /^([\d\s]+)\s*\$\s*\(свій\)$/;

function parseBudgetAmount(value: string): number | null {
  const match = value.match(CUSTOM_BUDGET_PATTERN);
  if (!match) return null;

  const amount = Number.parseInt(match[1].replace(/\s/g, ""), 10);
  return Number.isFinite(amount) ? amount : null;
}

function isValidBudgetValue(value: string): boolean {
  if ((BUDGET_PRESETS as readonly string[]).includes(value)) return true;

  const amount = parseBudgetAmount(value);
  return amount !== null && amount >= MIN_BUDGET_USD;
}

function isValidOptionValue(stepId: string, value: string): boolean {
  const allowed = OPTION_VALUES[stepId];
  if (!allowed) return true;
  return allowed.has(value);
}

export function sanitizeAnswers(raw: unknown): Record<string, string[]> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const answers: Record<string, string[]> = {};

  for (const key of QUIZ_ANSWER_KEYS) {
    const value = (raw as Record<string, unknown>)[key];
    if (!Array.isArray(value)) continue;

    const cleaned = value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 20)
      .map((item) => item.slice(0, key === "car_wish" ? 500 : 200));

    if (cleaned.length > 0) {
      answers[key] = cleaned;
    }
  }

  return answers;
}

export function validateQuizAnswers(
  answers: Record<string, string[]>,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const key of REQUIRED_QUIZ_KEYS) {
    const values = answers[key] ?? [];

    if (values.length === 0) {
      errors.answers = "Заповніть усі кроки квізу";
      break;
    }
  }

  if (errors.answers) return errors;

  for (const [stepId, values] of Object.entries(answers)) {
    if (stepId === "budget") {
      if (!values.every(isValidBudgetValue)) {
        errors.budget = "Некоректний бюджет";
      }
      continue;
    }

    if (stepId === "brand") {
      if (values.some((value) => value.length < 2 || value.length > 80)) {
        errors.brand = "Некоректна марка авто";
      }
      continue;
    }

    if (stepId === "car_wish") {
      const note = values[0] ?? "";
      if (note.length < 5) {
        errors.car_wish = "Опишіть побажання по авто";
      }
      continue;
    }

    if (OPTION_VALUES[stepId]) {
      const invalid = values.some((value) => !isValidOptionValue(stepId, value));
      if (invalid) {
        errors.answers = "Некоректні відповіді квізу";
        break;
      }

      if (values.includes(UNDECIDED) && values.length > 1) {
        errors.answers = "Некоректні відповіді квізу";
        break;
      }
    }
  }

  return errors;
}
