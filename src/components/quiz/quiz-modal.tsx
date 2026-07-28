"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { QuizIcon } from "@/components/quiz/quiz-icons";
import { quizSteps, UNDECIDED, type QuizStep } from "@/lib/quiz-config";
import type { LeadType } from "@/lib/leads";
import { isValidPhone, normalizePhone } from "@/lib/phone";

type Answers = Record<string, string[]>;

type FormErrors = {
  name?: string;
  phone?: string;
  general?: string;
};

function collectUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};

  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ]) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }

  return utm;
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

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

  const progress = useMemo(() => {
    const total = quizSteps.length + 1;
    return Math.round(((isCallback ? total : stepIndex + 1) / total) * 100);
  }, [isCallback, stepIndex]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (name.trim().length < 2) nextErrors.name = "Вкажіть ім’я";
    if (!isValidPhone(phone)) nextErrors.phone = "Перевірте номер телефону";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadType: mode,
          name,
          phone: normalizePhone(phone),
          comment,
          answers: isCallback ? {} : answers,
          pageUrl: window.location.href,
          utm: collectUtm(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      setDone(true);
    } catch {
      setErrors({
        general: "Не вдалося надіслати заявку. Спробуйте ще раз або подзвоніть нам.",
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
              {done
                ? "Заявку прийнято"
                : isCallback
                  ? "Замовити дзвінок"
                  : "Підбір авто"}
            </p>
            {!done && !isCallback ? (
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

        {!done ? (
          <div className="h-1 w-full bg-ink/10">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-7 py-8">
          {done ? (
            <SuccessState onClose={onClose} />
          ) : isFormStage ? (
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
                  <Field label="Коментар (необов’язково)">
                    <textarea
                      name="comment"
                      rows={3}
                      placeholder="Марка, побажання, спосіб оплати…"
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
                        <span className="mt-1 flex h-20 w-full items-center justify-center">
                          {option.image ? (
                            <Image
                              src={option.image}
                              alt={option.value}
                              width={180}
                              height={120}
                              className="h-full w-auto object-contain"
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

        {!done && !isFormStage ? (
          <footer className="flex items-center justify-between gap-3 border-t border-ink-line px-7 py-5">
            <button
              type="button"
              onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
              className={`label-caps border-2 border-ink/20 px-6 py-3.5 transition-colors duration-200 hover:border-accent hover:text-accent ${
                stepIndex === 0 ? "invisible" : ""
              }`}
            >
              Назад
            </button>

            <button
              type="button"
              disabled={selected.length === 0}
              onClick={() => setStepIndex((prev) => prev + 1)}
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

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div className="mx-auto max-w-md py-8 text-center">
      <div className="mx-auto grid size-14 place-items-center bg-accent text-white">
        <CheckIcon className="size-6" />
      </div>
      <h3 className="mt-7 font-display text-4xl leading-none font-extrabold italic uppercase">
        Дякуємо за заявку
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-ink/60">
        Ми отримали ваші відповіді. Менеджер зв’яжеться з вами найближчим часом.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="label-caps clip-notch mt-8 bg-accent px-8 py-3.5 text-white transition-colors duration-200 hover:bg-accent-soft"
      >
        Закрити
      </button>
    </div>
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
