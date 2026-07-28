/**
 * Приймає українські формати: 0671112233, 380671112233, +380671112233.
 */
export function normalizePhone(value: string): string {
  const raw = String(value ?? "").trim();
  const hasPlus = raw.startsWith("+");
  const digits = raw.replace(/\D/g, "").slice(0, 12);

  return hasPlus ? `+${digits}` : digits;
}

export function isValidPhone(value: string): boolean {
  const normalized = normalizePhone(value);

  return /^0\d{9}$/.test(normalized) || /^\+?\d{12}$/.test(normalized);
}
