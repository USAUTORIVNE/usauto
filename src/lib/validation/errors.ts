import type { ZodError } from "zod";

export function zodFieldErrors(error: ZodError): Record<string, string> {
  const result: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string" || result[key]) continue;
    result[key] = issue.message;
  }

  return result;
}

export function zodFirstError(error: ZodError): string {
  return error.issues[0]?.message ?? "Некоректні дані";
}
