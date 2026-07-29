import { logout } from "@/app/admin/actions";
import { FilterBar } from "@/app/admin/filter-bar";
import { buildAdminHref, LeadsTable } from "@/app/admin/leads-table";
import { LoginForm } from "@/app/admin/login-form";
import { isAdminAuthed, isAdminConfigured } from "@/lib/admin-auth";
import { formatDateTime } from "@/lib/format";
import {
  PAGE_SIZE,
  PERIOD_OPTIONS,
  leadStats,
  parseFilters,
  queryLeads,
  type LeadFilters,
  type LeadStats,
} from "@/lib/leads";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!isAdminConfigured()) {
    return (
      <Shell>
        <div className="max-w-lg rounded-xs border border-ink-line bg-white p-8">
          <h1 className="font-display text-3xl font-extrabold italic uppercase">
            Пароль не налаштований
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink/70">
            Додайте <code className="bg-paper-deep px-1.5 py-0.5">ADMIN_PASSWORD</code> у
            файл <code className="bg-paper-deep px-1.5 py-0.5">.env.local</code> і
            перезапустіть сервер.
          </p>
        </div>
      </Shell>
    );
  }

  if (!(await isAdminAuthed())) {
    return (
      <Shell center>
        <LoginForm />
      </Shell>
    );
  }

  const filters = parseFilters(await searchParams);
  const data = await loadAdminData(filters);
  const stats = data?.stats ?? EMPTY_STATS;

  const total = data?.total ?? 0;
  const from = total === 0 ? 0 : (filters.page - 1) * PAGE_SIZE + 1;
  const to = Math.min(filters.page * PAGE_SIZE, total);

  return (
    <Shell>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-ink-line pb-6">
        <div>
          <p className="label-caps text-accent">{site.name} — панель</p>
          <h1 className="mt-3 font-display text-5xl leading-none font-extrabold italic uppercase sm:text-6xl">
            Заявки з сайту
          </h1>
          {stats.lastCreatedAt ? (
            <p className="mt-3 text-sm text-muted">
              Остання заявка: {formatDateTime(stats.lastCreatedAt)}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <form action={logout}>
            <button
              type="submit"
              className="label-caps rounded-xs bg-ink px-5 py-3 text-bone transition-colors duration-300 hover:bg-ink-soft"
            >
              Вийти
            </button>
          </form>
        </div>
      </header>

      <dl className="grid gap-px bg-ink-line sm:grid-cols-3">
        <StatCard label="Сьогодні" value={stats.today} accent />
        <StatCard label="За 7 днів" value={stats.week} />
        <StatCard label="Усього заявок" value={stats.total} />
      </dl>

      <FilterBar filters={filters} />

      {filters.period !== "all" || filters.search ? (
        <p className="text-sm text-muted">
          Фільтр: {PERIOD_OPTIONS[filters.period].label.toLowerCase()}
          {filters.search ? `, пошук «${filters.search}»` : ""}
        </p>
      ) : null}

      {data ? (
        <>
          <LeadsTable leads={data.rows} filters={filters} />

          {total > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <p className="text-muted tabular-nums">
                Показано {from}–{to} з {total}
              </p>
              <div className="flex items-center gap-2">
                <PageLink
                  href={buildAdminHref(filters, { page: String(filters.page - 1) })}
                  disabled={filters.page === 1}
                >
                  ← Новіші
                </PageLink>
                <PageLink
                  href={buildAdminHref(filters, { page: String(filters.page + 1) })}
                  disabled={filters.page * PAGE_SIZE >= total}
                >
                  Старіші →
                </PageLink>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-xs border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="font-display text-2xl font-extrabold italic uppercase text-red-900">
            Немає з’єднання з базою
          </p>
          <p className="mt-2 text-sm text-red-700">
            Перевірте <code>DATABASE_URL</code> та виконайте{" "}
            <code>npm run db:migrate</code>.
          </p>
        </div>
      )}
    </Shell>
  );
}

const EMPTY_STATS: LeadStats = {
  total: 0,
  today: 0,
  week: 0,
  lastCreatedAt: null,
};

async function loadAdminData(filters: LeadFilters) {
  try {
    const [stats, leads] = await Promise.all([leadStats(), queryLeads(filters)]);

    return { stats, rows: leads.rows, total: leads.total };
  } catch (error) {
    console.error("Admin leads query failed", error);
    return null;
  }
}

function Shell({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <main
      className={`min-h-screen bg-paper px-5 py-10 text-ink ${
        center ? "grid place-items-center" : ""
      }`}
    >
      <div className={center ? "" : "mx-auto grid w-full max-w-7xl gap-8"}>
        {children}
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div className={`p-6 ${accent ? "bg-graphite text-bone" : "bg-white"}`}>
      <dt className={`label-caps ${accent ? "text-accent-soft" : "text-muted"}`}>
        {label}
      </dt>
      <dd className="mt-3 font-display text-5xl leading-none font-extrabold italic tabular-nums">
        {value}
      </dd>
    </div>
  );
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="cursor-not-allowed rounded-xs border border-ink/10 px-4 py-2 text-muted/60">
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      className="rounded-xs border border-ink/20 px-4 py-2 transition-colors duration-300 hover:bg-ink hover:text-bone"
    >
      {children}
    </a>
  );
}
