import { TIMEZONE } from "@/lib/leads";

const dateFormatter = new Intl.DateTimeFormat("uk-UA", {
  timeZone: TIMEZONE,
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("uk-UA", {
  timeZone: TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
});

const csvFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: TIMEZONE,
  dateStyle: "short",
  timeStyle: "short",
});

export function formatDate(value: string | Date): string {
  return dateFormatter.format(new Date(value));
}

export function formatTime(value: string | Date): string {
  return timeFormatter.format(new Date(value));
}

export function formatDateTime(value: string | Date): string {
  return `${formatDate(value)}, ${formatTime(value)}`;
}

export function formatForCsv(value: string | Date): string {
  return csvFormatter.format(new Date(value));
}

/** 0671112233 → 067 111 22 33 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const local = digits.length === 12 ? digits.slice(2) : digits;

  if (local.length !== 10) return phone;

  return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6, 8)} ${local.slice(8)}`;
}
