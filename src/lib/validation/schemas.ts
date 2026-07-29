import { z } from "zod";
import { isValidPhone, normalizePhone } from "@/lib/phone";

const PERIODS = ["all", "today", "7d", "30d"] as const;
const SORTS = ["new", "old", "name"] as const;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const trimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max, "Занадто довгий текст");

export const utmSchema = z
  .object(
    Object.fromEntries(UTM_KEYS.map((key) => [key, trimmedString(200).optional()])) as Record<
      (typeof UTM_KEYS)[number],
      z.ZodOptional<z.ZodString>
    >,
  )
  .strict()
  .transform((utm) => {
    const cleaned: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = utm[key]?.trim();
      if (value) cleaned[key] = value;
    }
    return cleaned;
  });

export const answersSchema = z.record(
  z.string().trim().max(60),
  z.array(trimmedString(500)).max(20),
);

export const leadPayloadSchema = z.object({
  leadType: z.enum(["quiz", "callback"]).default("quiz"),
  name: trimmedString(120).min(2, "Вкажіть ім’я"),
  phone: trimmedString(20).transform(normalizePhone).refine(isValidPhone, {
    message: "Вкажіть коректний номер телефону",
  }),
  comment: trimmedString(500).optional().default(""),
  answers: answersSchema.optional().default({}),
  pageUrl: trimmedString(500)
    .optional()
    .default("")
    .refine(
      (value) =>
        !value ||
        (() => {
          try {
            const url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
          } catch {
            return false;
          }
        })(),
      { message: "Некоректне посилання сторінки" },
    ),
  utm: utmSchema.optional().default({}),
});

export const adminPasswordSchema = z
  .string()
  .trim()
  .min(1, "Введіть пароль")
  .max(200, "Занадто довгий пароль");

export const adminFiltersSchema = z.object({
  q: trimmedString(100).optional().default(""),
  period: z.enum(PERIODS).default("all"),
  sort: z.enum(SORTS).default("new"),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
});
