export const UTM_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export function readUtmFromSearch(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const utm: Record<string, string> = {};

  for (const key of UTM_PARAM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }

  return utm;
}

export function buildThankYouUrl(leadType: string, currentSearch = ""): string {
  const params = new URLSearchParams(currentSearch);
  params.set("lead", leadType);

  const query = params.toString();
  return query ? `/thank-you?${query}` : "/thank-you";
}
