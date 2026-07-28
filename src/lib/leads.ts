import { getSql } from "@/lib/db";
import { isValidPhone, normalizePhone } from "@/lib/phone";

export const LEAD_TYPES = ["quiz", "callback"] as const;
export type LeadType = (typeof LEAD_TYPES)[number];

export type LeadInput = {
  leadType: LeadType;
  name: string;
  phone: string;
  comment: string;
  answers: Record<string, string[]>;
  pageUrl: string;
  utm: Record<string, string>;
};

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const MAX_TEXT = 500;

function asString(value: unknown, max = MAX_TEXT): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function parseLeadInput(
  raw: unknown,
): { ok: true; data: LeadInput } | { ok: false; errors: Record<string, string> } {
  const input = (raw ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const name = asString(input.name, 120);
  if (name.length < 2) {
    errors.name = "Вкажіть ім’я";
  }

  const phone = normalizePhone(asString(input.phone, 20));
  if (!isValidPhone(phone)) {
    errors.phone = "Вкажіть коректний номер телефону";
  }

  const leadType: LeadType = LEAD_TYPES.includes(input.leadType as LeadType)
    ? (input.leadType as LeadType)
    : "quiz";

  const answers: Record<string, string[]> = {};
  const rawAnswers = input.answers;
  if (rawAnswers && typeof rawAnswers === "object") {
    for (const [key, value] of Object.entries(rawAnswers)) {
      if (!Array.isArray(value)) continue;
      const cleaned = value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().slice(0, 200))
        .filter(Boolean)
        .slice(0, 20);
      if (cleaned.length > 0) {
        answers[key.slice(0, 60)] = cleaned;
      }
    }
  }

  const utm: Record<string, string> = {};
  const rawUtm = (input.utm ?? {}) as Record<string, unknown>;
  for (const key of UTM_KEYS) {
    const value = asString(rawUtm[key], 200);
    if (value) utm[key] = value;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      leadType,
      name,
      phone,
      comment: asString(input.comment),
      answers,
      pageUrl: asString(input.pageUrl, 500),
      utm,
    },
  };
}

export async function insertLead(lead: LeadInput): Promise<number> {
  const sql = getSql();

  const rows = await sql`
    insert into leads (lead_type, name, phone, comment, answers, page_url, utm)
    values (
      ${lead.leadType},
      ${lead.name},
      ${lead.phone},
      ${lead.comment || null},
      ${JSON.stringify(lead.answers)}::jsonb,
      ${lead.pageUrl || null},
      ${JSON.stringify(lead.utm)}::jsonb
    )
    returning id
  `;

  return rows[0].id as number;
}

export async function listLeads(limit = 50) {
  const sql = getSql();

  return sql`
    select id, lead_type, name, phone, comment, answers, page_url, utm, created_at
    from leads
    order by created_at desc
    limit ${limit}
  `;
}

export const TIMEZONE = "Europe/Kyiv";
export const PAGE_SIZE = 25;

export const SORT_OPTIONS = {
  new: { label: "Спочатку нові", sql: "created_at desc" },
  old: { label: "Спочатку старі", sql: "created_at asc" },
  name: { label: "За ім’ям (А–Я)", sql: "name asc, created_at desc" },
  type: { label: "За типом заявки", sql: "lead_type asc, created_at desc" },
} as const;

export const PERIOD_OPTIONS = {
  all: { label: "Весь час" },
  today: { label: "Сьогодні" },
  "7d": { label: "7 днів" },
  "30d": { label: "30 днів" },
} as const;

export const TYPE_OPTIONS = {
  all: { label: "Усі заявки" },
  quiz: { label: "Квіз" },
  callback: { label: "Дзвінок" },
} as const;

export type SortKey = keyof typeof SORT_OPTIONS;
export type PeriodKey = keyof typeof PERIOD_OPTIONS;
export type TypeKey = keyof typeof TYPE_OPTIONS;

export type LeadFilters = {
  type: TypeKey;
  period: PeriodKey;
  search: string;
  sort: SortKey;
  page: number;
};

export type LeadRow = {
  id: number;
  lead_type: LeadType;
  name: string;
  phone: string;
  comment: string | null;
  answers: Record<string, string[]>;
  page_url: string | null;
  utm: Record<string, string>;
  created_at: string;
  is_today: boolean;
};

const TODAY_CONDITION = `(created_at at time zone '${TIMEZONE}')::date = (now() at time zone '${TIMEZONE}')::date`;

function buildWhere(filters: LeadFilters) {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.type !== "all") {
    params.push(filters.type);
    conditions.push(`lead_type = $${params.length}`);
  }

  if (filters.search) {
    params.push(`%${filters.search}%`);
    const index = params.length;
    conditions.push(
      `(name ilike $${index} or phone ilike $${index} or coalesce(comment, '') ilike $${index})`,
    );
  }

  if (filters.period === "today") {
    conditions.push(TODAY_CONDITION);
  } else if (filters.period === "7d") {
    conditions.push("created_at >= now() - interval '7 days'");
  } else if (filters.period === "30d") {
    conditions.push("created_at >= now() - interval '30 days'");
  }

  return {
    clause: conditions.length > 0 ? `where ${conditions.join(" and ")}` : "",
    params,
  };
}

export async function queryLeads(
  filters: LeadFilters,
): Promise<{ rows: LeadRow[]; total: number }> {
  const sql = getSql();
  const { clause, params } = buildWhere(filters);
  const offset = (filters.page - 1) * PAGE_SIZE;

  const rows = (await sql.query(
    `select id, lead_type, name, phone, comment, answers, page_url, utm, created_at,
            ${TODAY_CONDITION} as is_today,
            count(*) over() as total_count
     from leads
     ${clause}
     order by ${SORT_OPTIONS[filters.sort].sql}
     limit ${PAGE_SIZE} offset ${offset}`,
    params,
  )) as (LeadRow & { total_count: string })[];

  return {
    rows,
    total: rows.length > 0 ? Number(rows[0].total_count) : 0,
  };
}

export type LeadStats = {
  total: number;
  today: number;
  week: number;
  quiz: number;
  callback: number;
  lastCreatedAt: string | null;
};

export async function leadStats(): Promise<LeadStats> {
  const sql = getSql();

  const rows = (await sql.query(
    `select
       count(*)::int as total,
       count(*) filter (where ${TODAY_CONDITION})::int as today,
       count(*) filter (where created_at >= now() - interval '7 days')::int as week,
       count(*) filter (where lead_type = 'quiz')::int as quiz,
       count(*) filter (where lead_type = 'callback')::int as callback,
       max(created_at) as last_created_at
     from leads`,
  )) as {
    total: number;
    today: number;
    week: number;
    quiz: number;
    callback: number;
    last_created_at: string | null;
  }[];

  const row = rows[0];

  return {
    total: row.total,
    today: row.today,
    week: row.week,
    quiz: row.quiz,
    callback: row.callback,
    lastCreatedAt: row.last_created_at,
  };
}

export async function exportLeads(filters: LeadFilters): Promise<LeadRow[]> {
  const sql = getSql();
  const { clause, params } = buildWhere(filters);

  return (await sql.query(
    `select id, lead_type, name, phone, comment, answers, page_url, utm, created_at,
            ${TODAY_CONDITION} as is_today
     from leads
     ${clause}
     order by ${SORT_OPTIONS[filters.sort].sql}
     limit 5000`,
    params,
  )) as LeadRow[];
}

export function parseFilters(searchParams: Record<string, string | string[] | undefined>): LeadFilters {
  const pick = <T extends string>(
    value: string | string[] | undefined,
    allowed: readonly T[],
    fallback: T,
  ): T => {
    const single = Array.isArray(value) ? value[0] : value;
    return allowed.includes(single as T) ? (single as T) : fallback;
  };

  const rawPage = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;
  const page = Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1);
  const rawSearch = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q;

  return {
    type: pick(searchParams.type, Object.keys(TYPE_OPTIONS) as TypeKey[], "all"),
    period: pick(searchParams.period, Object.keys(PERIOD_OPTIONS) as PeriodKey[], "all"),
    sort: pick(searchParams.sort, Object.keys(SORT_OPTIONS) as SortKey[], "new"),
    search: (rawSearch ?? "").trim().slice(0, 100),
    page,
  };
}
