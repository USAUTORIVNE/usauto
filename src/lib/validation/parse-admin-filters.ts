import type { LeadFilters } from "@/lib/leads";
import { adminFiltersSchema } from "@/lib/validation/schemas";

export function parseFilters(
  searchParams: Record<string, string | string[] | undefined>,
): LeadFilters {
  const pick = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const parsed = adminFiltersSchema.safeParse({
    q: pick("q"),
    period: pick("period"),
    sort: pick("sort"),
    page: pick("page"),
  });

  if (!parsed.success) {
    return {
      search: "",
      period: "all",
      sort: "new",
      page: 1,
    };
  }

  return {
    search: parsed.data.q,
    period: parsed.data.period,
    sort: parsed.data.sort,
    page: parsed.data.page,
  };
}
