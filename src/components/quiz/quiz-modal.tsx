"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { QuizIcon } from "@/components/quiz/quiz-icons";
import {
  BUDGET_PRESETS,
  MIN_BUDGET_USD,
  POPULAR_BRANDS,
  quizSteps,
  UNDECIDED,
  type QuizStep,
} from "@/lib/quiz-config";
import type { LeadType } from "@/lib/leads";
import { normalizePhone } from "@/lib/phone";
import { buildThankYouUrl, readUtmFromSearch } from "@/lib/utm";
import { parseLeadInput } from "@/lib/validation/parse-lead";

type Answers = Record<string, string[]>;

type FormErrors = {
  name?: string;
  phone?: string;
  general?: string;
};

type StepErrors = {
  budget?: string;
  car_wish?: string;
};

function collectUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  return readUtmFromSearch(window.location.search);
}

function toggleValue(current: string[], value: string): string[] {
  if (current.includes(value)) {
    return current.filter((item) => item !== value);
  }

  if (value === UNDECIDED) {
    return [UNDECIDED];
  }

  return [...current.filter((item) => item !== UNDECIDED), value];
}

function getOptionImageClass(stepId: string, value: string): string {
  if (value === UNDECIDED) {
    return stepId === "fuel_type"
      ? "h-[52%] w-auto max-w-[52%] object-contain"
      : "h-[55%] w-auto max-w-[55%] object-contain";
  }

  if (stepId === "fuel_type") {
    return "h-[72%] w-auto max-w-[72%] object-contain";
  }

  return "h-[115%] w-auto max-w-[115%] object-contain";
}

function parseBudgetInput(value: string): number | null {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return null;
  const amount = Number.parseInt(digits, 10);
  return Number.isFinite(amount) ? amount : null;
}

function formatBudgetAmount(amount: number): string {
  return amount.toLocaleString("uk-UA");
}

function canProceedStep(
  step: QuizStep,
  answers: Answers,
  budgetCustom: string,
  carWishBrandCustom: string,
  carWishNotes: string,
): boolean {
  if (step.layout === "budget") {
    const preset = answers.budget ?? [];
    if (preset.length > 0) return true;
    const amount = parseBudgetInput(budgetCustom);
    return amount !== null && amount >= MIN_BUDGET_USD;
  }

  if (step.layout === "car_wish") {
    const brands = answers.brand ?? [];
    const hasBrand =
      brands.length > 0 || carWishBrandCustom.trim().length >= 2;
    const hasNotes = carWishNotes.trim().length >= 5;
    return hasBrand && hasNotes;
  }

  return (answers[step.id] ?? []).length > 0;
}

function validateStepInput(
  step: QuizStep,
  answers: Answers,
  budgetCustom: string,
  carWishBrandCustom: string,
  carWishNotes: string,
): StepErrors {
  if (step.layout === "budget") {
    const preset = answers.budget ?? [];
    if (preset.length > 0) return {};

    const amount = parseBudgetInput(budgetCustom);
    if (amount === null) {
      return { budget: "Вкажіть бюджет або оберіть варіант із списку" };
    }
    if (amount < MIN_BUDGET_USD) {
      return { budget: `Мінімальний бюджет — ${formatBudgetAmount(MIN_BUDGET_USD)} $` };
    }
    return {};
  }

  if (step.layout === "car_wish") {
    const brands = answers.brand ?? [];
    const hasBrand =
      brands.length > 0 || carWishBrandCustom.trim().length >= 2;

    if (!hasBrand) {
      return { car_wish: "Оберіть марку зі списку або вкажіть свою" };
    }
    if (carWishNotes.trim().length < 5) {
      return { car_wish: "Опишіть побажання — марку, модель, комплектацію…" };
    }
    return {};
  }

  return {};
}

function syncStepAnswers(
  step: QuizStep,
  answers: Answers,
  budgetCustom: string,
  carWishBrandCustom: string,
  carWishNotes: string,
): Answers {
  if (step.layout === "budget") {
    const preset = answers.budget ?? [];
    if (preset.length > 0) return answers;

    const amount = parseBudgetInput(budgetCustom);
    if (amount === null) return answers;

    return {
      ...answers,
      budget: [`${formatBudgetAmount(amount)} $ (свій)`],
    };
  }

  if (step.layout === "car_wish") {
    const brands = answers.brand ?? [];
    const customBrand = carWishBrandCustom.trim();
    const notes = carWishNotes.trim();
    const brandValues = [...brands];
    if (customBrand && !brandValues.includes(customBrand)) {
      brandValues.push(customBrand);
    }

    return {
      ...answers,
      brand: brandValues,
      car_wish: [notes],
    };
  }

  return answers;
}

export function QuizModal({
  mode,
  onClose,
}: {
  mode: LeadType;
  onClose: () => void;
}) {
  const isCallback = mode === "callback";
  const [stepIndex, setStepIndex] = useState(isCallback ? quizSteps.length : 0);
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [budgetCustom, setBudgetCustom] = useState("");
  const [carWishBrandCustom, setCarWishBrandCustom] = useState("");
  const [carWishNotes, setCarWishNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const step: QuizStep | undefined = quizSteps[stepIndex];
  const isFormStage = !step;
  const selected = step ? (answers[step.id] ?? []) : [];
  const selectedBrands = answers.brand ?? [];
  const canProceed =
    step &&
    canProceedStep(step, answers, budgetCustom, carWishBrandCustom, carWishNotes);

  function goNextStep() {
    if (!step) return;

    const nextStepErrors = validateStepInput(
      step,
      answers,
      budgetCustom,
      carWishBrandCustom,
      carWishNotes,
    );
    setStepErrors(nextStepErrors);
    if (Object.keys(nextStepErrors).length > 0) return;

    setAnswers((prev) =>
      syncStepAnswers(
        step,
        prev,
        budgetCustom,
        carWishBrandCustom,
        carWishNotes,
      ),
    );
    setStepErrors({});
    setStepIndex((prev) => prev + 1);
  }

  const progress = useMemo(() => {
    const total = quizSteps.length + 1;
    return Math.round(((isCallback ? total : stepIndex + 1) / total) * 100);
  }, [isCallback, stepIndex]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      leadType: mode,
      name,
      phone,
      comment,
      answers: isCallback ? {} : answers,
      pageUrl: window.location.href,
      utm: collectUtm(),
    };

    const parsed = parseLeadInput(payload);

    if (!parsed.ok) {
      const nextErrors: FormErrors = {};
      if (parsed.errors.name) nextErrors.name = parsed.errors.name;
      if (parsed.errors.phone) nextErrors.phone = parsed.errors.phone;
      if (parsed.errors.general) nextErrors.general = parsed.errors.general;
      if (
        parsed.errors.answers ||
        parsed.errors.budget ||
        parsed.errors.brand ||
        parsed.errors.car_wish
      ) {
        nextErrors.general =
          parsed.errors.answers ??
          parsed.errors.budget ??
          parsed.errors.brand ??
          parsed.errors.car_wish ??
          "Перевірте відповіді квізу";
      }

      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (response.status === 429) {
        throw new Error("rate-limit");
      }

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      window.location.assign(
        buildThankYouUrl(mode, window.location.search),
      );
      return;
    } catch (error) {
      setErrors({
        general:
          error instanceof Error && error.message === "rate-limit"
            ? "Забагато спроб. Зачекайте хвилину і спробуйте знову."
            : "Не вдалося надіслати заявку. Спробуйте ще раз або подзвоніть нам.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Закрити"
        onClick={onClose}
        className="absolute inset-0 bg-graphite/80 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={isCallback ? "Замовити дзвінок" : "Підбір авто"}
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden bg-paper text-ink shadow-2xl"
      >
        <header className="flex items-center justify-between gap-4 border-b border-ink-line px-7 py-6">
          <div>
            <p className="font-display text-3xl leading-none font-extrabold italic uppercase">
              {isCallback ? "Замовити дзвінок" : "Підбір авто"}
            </p>
            {!isCallback ? (
              <p className="label-caps mt-2.5 text-muted">
                Крок {Math.min(stepIndex + 1, quizSteps.length + 1)} —{" "}
                {quizSteps.length + 1}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити"
            className="grid size-9 shrink-0 place-items-center border-2 border-ink/15 text-lg transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-white"
          >
            ×
          </button>
        </header>

        <div className="h-1 w-full bg-ink/10">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-8">
          {isFormStage ? (
            <form onSubmit={handleSubmit} className="mx-auto max-w-md" noValidate>
              <h3 className="font-display text-3xl leading-tight font-extrabold italic uppercase">
                {isCallback
                  ? "Залиште контакти — і ми подзвонимо"
                  : "Куди надіслати підбірку?"}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">
                {isCallback
                  ? "Телефонуємо в робочі години, зазвичай протягом 15 хвилин."
                  : "Менеджер надішле варіанти авто з повним прорахунком ціни «під ключ»."}
              </p>

              <div className="mt-8 space-y-6">
                <Field label="Ім’я" error={errors.name}>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Олександр"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full border-b border-ink/25 bg-transparent py-2.5 outline-none transition-colors duration-300 placeholder:text-ink/30 focus:border-accent"
                  />
                </Field>

                <Field label="Телефон" error={errors.phone}>
                  <input
                    type="tel"
                    name="phone"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="0671112233"
                    value={phone}
                    onChange={(event) => setPhone(normalizePhone(event.target.value))}
                    className="w-full border-b border-ink/25 bg-transparent py-2.5 tabular-nums outline-none transition-colors duration-300 placeholder:text-ink/30 focus:border-accent"
                  />
                </Field>

                {!isCallback ? (
                  <Field label="Додатковий коментар (необов’язково)">
                    <textarea
                      name="comment"
                      rows={2}
                      placeholder="Спосіб оплати, терміни…"
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      className="w-full resize-none border-b border-ink/25 bg-transparent py-2.5 outline-none transition-colors duration-300 placeholder:text-ink/30 focus:border-accent"
                    />
                  </Field>
                ) : null}
              </div>

              {errors.general ? (
                <p className="mt-6 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {errors.general}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="label-caps clip-notch mt-8 w-full bg-accent px-6 py-4 text-white transition-colors duration-200 hover:bg-accent-soft disabled:opacity-60"
              >
                {submitting
                  ? "Надсилаємо…"
                  : isCallback
                    ? "Замовити дзвінок"
                    : "Отримати підбірку"}
              </button>

              <p className="mt-4 text-center text-xs text-ink/45">
                Ваші дані в безпеці, третім особам не передаємо.
              </p>
            </form>
          ) : step.layout === "budget" ? (
            <BudgetStep
              selectedPreset={(answers.budget ?? [])[0] ?? ""}
              customValue={budgetCustom}
              error={stepErrors.budget}
              onSelectPreset={(value) => {
                setBudgetCustom("");
                setAnswers((prev) => ({ ...prev, budget: [value] }));
                setStepErrors({});
              }}
              onCustomChange={(value) => {
                setBudgetCustom(value);
                setAnswers((prev) => ({ ...prev, budget: [] }));
                setStepErrors({});
              }}
            />
          ) : step.layout === "car_wish" ? (
            <CarWishStep
              selectedBrands={selectedBrands}
              customBrand={carWishBrandCustom}
              notes={carWishNotes}
              error={stepErrors.car_wish}
              onToggleBrand={(brand) => {
                setAnswers((prev) => {
                  const current = prev.brand ?? [];
                  const next = current.includes(brand)
                    ? current.filter((item) => item !== brand)
                    : [...current, brand];
                  return { ...prev, brand: next };
                });
                setStepErrors({});
              }}
              onCustomBrandChange={setCarWishBrandCustom}
              onNotesChange={setCarWishNotes}
            />
          ) : (
            <div>
              <h3 className="font-display text-3xl leading-tight font-extrabold italic uppercase sm:text-4xl">
                {step.question}
              </h3>
              {step.hint ? (
                <p className="mt-3 text-sm text-ink/60">{step.hint}</p>
              ) : null}

              <div
                className={
                  step.layout === "cards"
                    ? "mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3"
                    : "mt-7 grid gap-3 sm:grid-cols-2"
                }
              >
                {step.options.map((option) => {
                  const isSelected = selected.includes(option.value);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [step.id]: toggleValue(prev[step.id] ?? [], option.value),
                        }))
                      }
                      className={`group flex items-center gap-3 border-2 px-4 py-3.5 text-left transition-colors duration-200 ${
                        isSelected
                          ? "border-accent bg-accent text-white"
                          : "border-ink-line bg-white/70 hover:border-accent/50"
                      } ${step.layout === "cards" ? "flex-col items-start" : ""}`}
                    >
                      <span className="flex w-full items-center gap-3">
                        <span
                          className={`grid size-4 shrink-0 place-items-center border-2 transition-colors duration-200 ${
                            isSelected
                              ? "border-white text-white"
                              : "border-ink/30 text-transparent"
                          }`}
                        >
                          <CheckIcon />
                        </span>
                        <span className="text-sm leading-tight font-medium">
                          {option.value}
                        </span>
                      </span>

                      {step.layout === "cards" ? (
                        <span
                          className={`mt-1 flex w-full items-center justify-center overflow-hidden ${
                            step.id === "fuel_type" ? "h-20" : "h-28"
                          }`}
                        >
                          {option.image ? (
                            <Image
                              src={option.image}
                              alt={option.value}
                              width={240}
                              height={160}
                              className={getOptionImageClass(step.id, option.value)}
                            />
                          ) : option.icon ? (
                            <span
                              className={`h-full w-full transition-colors duration-200 ${
                                isSelected ? "text-white" : "text-ink/55"
                              } [&>svg]:h-full [&>svg]:w-full`}
                            >
                              <QuizIcon name={option.icon} />
                            </span>
                          ) : null}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {!isFormStage ? (
          <footer className="flex items-center justify-between gap-3 border-t border-ink-line px-7 py-5">
            <button
              type="button"
              onClick={() => {
                setStepErrors({});
                setStepIndex((prev) => Math.max(0, prev - 1));
              }}
              className={`label-caps border-2 border-ink/20 px-6 py-3.5 transition-colors duration-200 hover:border-accent hover:text-accent ${
                stepIndex === 0 ? "invisible" : ""
              }`}
            >
              Назад
            </button>

            <button
              type="button"
              disabled={!canProceed}
              onClick={goNextStep}
              className="label-caps clip-notch bg-accent px-8 py-3.5 text-white transition-colors duration-200 hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-35"
            >
              {stepIndex === quizSteps.length - 1 ? "До контактів" : "Далі"}
            </button>
          </footer>
        ) : null}
      </div>
    </div>
  );
}

function BudgetStep({
  selectedPreset,
  customValue,
  error,
  onSelectPreset,
  onCustomChange,
}: {
  selectedPreset: string;
  customValue: string;
  error?: string;
  onSelectPreset: (value: string) => void;
  onCustomChange: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="font-display text-3xl leading-tight font-extrabold italic uppercase sm:text-4xl">
        Бюджет на покупку авто
      </h3>
      <p className="mt-3 text-sm text-ink/60">
        Ціна «під ключ», з доставкою та розмитненням. Оберіть варіант або вкажіть
        свій — від {formatBudgetAmount(MIN_BUDGET_USD)} $.
      </p>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {BUDGET_PRESETS.map((preset) => {
          const isSelected = selectedPreset === preset && !customValue;

          return (
            <button
              key={preset}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`flex items-center gap-3 border-2 px-4 py-3.5 text-left transition-colors duration-200 ${
                isSelected
                  ? "border-accent bg-accent text-white"
                  : "border-ink-line bg-white/70 hover:border-accent/50"
              }`}
            >
              <span
                className={`grid size-4 shrink-0 place-items-center border-2 ${
                  isSelected ? "border-white text-white" : "border-ink/30 text-transparent"
                }`}
              >
                <CheckIcon />
              </span>
              <span className="text-sm font-medium">{preset}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 border-t border-ink-line pt-6">
        <label className="block">
          <span className="label-caps mb-2 block text-muted">Або вкажіть свій бюджет</span>
          <div className="flex items-center gap-2 border-b border-ink/25 pb-2 focus-within:border-accent">
            <input
              type="text"
              inputMode="numeric"
              value={customValue}
              onChange={(event) => onCustomChange(event.target.value.replace(/[^\d\s]/g, ""))}
              placeholder={`Наприклад: ${formatBudgetAmount(MIN_BUDGET_USD)}`}
              className="w-full bg-transparent py-2 tabular-nums outline-none placeholder:text-ink/30"
            />
            <span className="shrink-0 text-sm text-muted">$</span>
          </div>
        </label>
      </div>

      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

function CarWishStep({
  selectedBrands,
  customBrand,
  notes,
  error,
  onToggleBrand,
  onCustomBrandChange,
  onNotesChange,
}: {
  selectedBrands: string[];
  customBrand: string;
  notes: string;
  error?: string;
  onToggleBrand: (brand: string) => void;
  onCustomBrandChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="font-display text-3xl leading-tight font-extrabold italic uppercase sm:text-4xl">
        Яка марка або побажання по авто?
      </h3>
      <p className="mt-3 text-sm text-ink/60">
        Обов’язково — оберіть марку зі списку або вкажіть свою, і коротко опишіть
        побажання.
      </p>

      <p className="label-caps mt-7 text-muted">Популярні марки</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {POPULAR_BRANDS.map((brand) => {
          const isSelected = selectedBrands.includes(brand);

          return (
            <button
              key={brand}
              type="button"
              onClick={() => onToggleBrand(brand)}
              className={`label-caps border-2 px-3 py-2 transition-colors duration-200 ${
                isSelected
                  ? "border-accent bg-accent text-white"
                  : "border-ink-line bg-white/70 hover:border-accent/50"
              }`}
            >
              {brand}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <Field label="Інша марка / модель">
          <input
            type="text"
            value={customBrand}
            onChange={(event) => onCustomBrandChange(event.target.value)}
            placeholder="Наприклад: Mazda CX-5"
            className="w-full border-b border-ink/25 bg-transparent py-2.5 outline-none transition-colors duration-300 placeholder:text-ink/30 focus:border-accent"
          />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="Побажання по авто *">
          <textarea
            rows={4}
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder="Марка, модель, комплектація, пробіг, колір, must-have опції…"
            className="w-full resize-none border-b border-ink/25 bg-transparent py-2.5 outline-none transition-colors duration-300 placeholder:text-ink/30 focus:border-accent"
          />
        </Field>
      </div>

      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-caps mb-2 block text-muted">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm text-red-700">{error}</span> : null}
    </label>
  );
}

function CheckIcon({ className = "size-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3 8.5 3.2 3.2L13 4.8" />
    </svg>
  );
}
