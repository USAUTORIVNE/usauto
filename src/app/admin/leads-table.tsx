import { formatDate, formatPhone, formatTime } from "@/lib/format";
import { answerLabels } from "@/lib/quiz-config";
import type { LeadFilters, LeadRow, SortKey } from "@/lib/leads";

export function buildAdminHref(
  filters: LeadFilters,
  changes: Partial<Record<"q" | "type" | "period" | "sort" | "page", string>> = {},
): string {
  const params = new URLSearchParams();

  const state: Record<string, string> = {
    q: filters.search,
    type: filters.type === "all" ? "" : filters.type,
    period: filters.period === "all" ? "" : filters.period,
    sort: filters.sort === "new" ? "" : filters.sort,
    page: filters.page > 1 ? String(filters.page) : "",
    ...changes,
  };

  for (const [key, value] of Object.entries(state)) {
    if (value) params.set(key, value);
  }

  const query = params.toString();
  return query ? `/admin?${query}` : "/admin";
}

function TypeBadge({ type }: { type: LeadRow["lead_type"] }) {
  const isCallback = type === "callback";

  return (
    <span
      className={`label-caps inline-flex items-center rounded-xs px-2.5 py-1.5 whitespace-nowrap ${
        isCallback ? "bg-ink text-bone" : "border border-ink/20 text-ink/70"
      }`}
    >
      {isCallback ? "Дзвінок" : "Квіз"}
    </span>
  );
}

function Answers({ answers }: { answers: LeadRow["answers"] }) {
  const entries = Object.entries(answers ?? {});

  if (entries.length === 0) {
    return <span className="text-sm text-muted">—</span>;
  }

  return (
    <dl className="grid gap-1.5">
      {entries.map(([key, values]) => (
        <div key={key} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <dt className="text-[10px] tracking-[0.16em] text-muted uppercase">
            {answerLabels[key] ?? key}
          </dt>
          <dd className="text-sm">{values.join(", ")}</dd>
        </div>
      ))}
    </dl>
  );
}

function Source({ lead }: { lead: LeadRow }) {
  const utm = Object.entries(lead.utm ?? {});

  if (utm.length === 0) {
    return <span className="text-sm text-muted">Напряму</span>;
  }

  return (
    <div className="grid gap-1">
      {utm.map(([key, value]) => (
        <span key={key} className="text-xs text-ink/70">
          <span className="text-muted">{key.replace("utm_", "")}:</span> {value}
        </span>
      ))}
    </div>
  );
}

function SortLink({
  filters,
  target,
  alternate,
  children,
}: {
  filters: LeadFilters;
  target: SortKey;
  alternate?: SortKey;
  children: React.ReactNode;
}) {
  const isActive = filters.sort === target || filters.sort === alternate;
  const next =
    alternate && filters.sort === target ? alternate : target;

  return (
    <a
      href={buildAdminHref(filters, { sort: next, page: "" })}
      className={`inline-flex items-center gap-1 transition-colors duration-300 hover:text-ink ${
        isActive ? "text-ink" : "text-muted"
      }`}
    >
      {children}
      <span aria-hidden="true" className="text-[10px]">
        {isActive ? (filters.sort === "old" || filters.sort === "name" ? "↑" : "↓") : "↕"}
      </span>
    </a>
  );
}

function TodayBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] text-accent uppercase">
      <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
      Сьогодні
    </span>
  );
}

export function LeadsTable({
  leads,
  filters,
}: {
  leads: LeadRow[];
  filters: LeadFilters;
}) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xs border border-ink-line bg-white/60 px-6 py-16 text-center">
        <p className="font-display text-2xl font-extrabold italic uppercase">
          Заявок не знайдено
        </p>
        <p className="mt-2 text-sm text-muted">
          Спробуйте змінити фільтри або період.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xs border border-ink-line bg-white lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink-line bg-paper-deep/60 text-[10px] tracking-[0.18em] uppercase">
              <th className="px-5 py-4 font-medium">
                <SortLink filters={filters} target="new" alternate="old">
                  Дата
                </SortLink>
              </th>
              <th className="px-5 py-4 font-medium">
                <SortLink filters={filters} target="name">
                  Клієнт
                </SortLink>
              </th>
              <th className="px-5 py-4 font-medium">
                <SortLink filters={filters} target="type">
                  Тип
                </SortLink>
              </th>
              <th className="px-5 py-4 font-medium text-muted">Відповіді</th>
              <th className="px-5 py-4 font-medium text-muted">Коментар</th>
              <th className="px-5 py-4 font-medium text-muted">Джерело</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className={`border-b border-ink-line/60 align-top last:border-0 ${
                  lead.is_today ? "bg-accent/8" : ""
                }`}
              >
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm tabular-nums">
                      {formatTime(lead.created_at)}
                    </span>
                    <span className="text-xs text-muted tabular-nums">
                      {formatDate(lead.created_at)}
                    </span>
                    {lead.is_today ? <TodayBadge /> : null}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="font-display text-xl leading-none font-bold">
                    {lead.name}
                  </p>
                  <a
                    href={`tel:${lead.phone}`}
                    className="mt-2 block text-sm tabular-nums text-ink/70 transition-colors duration-300 hover:text-ink"
                  >
                    {formatPhone(lead.phone)}
                  </a>
                  <p className="mt-1 text-xs text-muted">#{lead.id}</p>
                </td>
                <td className="px-5 py-4">
                  <TypeBadge type={lead.lead_type} />
                </td>
                <td className="max-w-64 px-5 py-4">
                  <Answers answers={lead.answers} />
                </td>
                <td className="max-w-56 px-5 py-4 text-sm text-ink/70">
                  {lead.comment ? lead.comment : <span className="text-muted">—</span>}
                </td>
                <td className="px-5 py-4">
                  <Source lead={lead} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="grid gap-3 lg:hidden">
        {leads.map((lead) => (
          <li
            key={lead.id}
            className={`rounded-xs border border-ink-line bg-white p-5 ${
              lead.is_today ? "border-l-2 border-l-accent bg-accent/8" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl font-bold">{lead.name}</p>
                <a
                  href={`tel:${lead.phone}`}
                  className="mt-0.5 block text-sm tabular-nums text-ink/70"
                >
                  {formatPhone(lead.phone)}
                </a>
              </div>
              <TypeBadge type={lead.lead_type} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted tabular-nums">
              <span>
                {formatDate(lead.created_at)}, {formatTime(lead.created_at)}
              </span>
              <span>·</span>
              <span>#{lead.id}</span>
              {lead.is_today ? <TodayBadge /> : null}
            </div>

            <div className="mt-4 border-t border-ink-line pt-3">
              <Answers answers={lead.answers} />
            </div>

            {lead.comment ? (
              <p className="mt-3 rounded-xs bg-paper-deep px-4 py-3 text-sm text-ink/75">
                {lead.comment}
              </p>
            ) : null}

            <div className="mt-3">
              <Source lead={lead} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
