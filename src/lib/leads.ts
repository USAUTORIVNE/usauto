import { getSql } from "@/lib/db";
import { TIMEZONE } from "@/lib/timezone";

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

export { parseLeadInput } from "@/lib/validation/parse-lead";
export { parseFilters } from "@/lib/validation/parse-admin-filters";

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

export const PAGE_SIZE = 25;

export { TIMEZONE } from "@/lib/timezone";

export const SORT_OPTIONS = {
  new: { label: "Спочатку нові", sql: "created_at desc" },
  old: { label: "Спочатку старі", sql: "created_at asc" },
  name: { label: "За ім’ям (А–Я)", sql: "name asc, created_at desc" },
} as const;

export const PERIOD_OPTIONS = {
  all: { label: "Весь час" },
  today: { label: "Сьогодні" },
  "7d": { label: "7 днів" },
  "30d": { label: "30 днів" },
} as const;

export type SortKey = keyof typeof SORT_OPTIONS;
export type PeriodKey = keyof typeof PERIOD_OPTIONS;

export type LeadFilters = {
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
  lastCreatedAt: string | null;
};

export async function leadStats(): Promise<LeadStats> {
  const sql = getSql();

  const rows = (await sql.query(
    `select
       count(*)::int as total,
       count(*) filter (where ${TODAY_CONDITION})::int as today,
       count(*) filter (where created_at >= now() - interval '7 days')::int as week,
       max(created_at) as last_created_at
     from leads`,
  )) as {
    total: number;
    today: number;
    week: number;
    last_created_at: string | null;
  }[];

  const row = rows[0];

  return {
    total: row.total,
    today: row.today,
    week: row.week,
    lastCreatedAt: row.last_created_at,
  };
}
