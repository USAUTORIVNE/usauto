"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  PERIOD_OPTIONS,
  SORT_OPTIONS,
  TYPE_OPTIONS,
  type LeadFilters,
} from "@/lib/leads";

const selectClass =
  "rounded-xs border border-ink/20 bg-white px-4 py-2.5 text-sm outline-none transition-colors duration-300 focus:border-accent";

export function FilterBar({ filters }: { filters: LeadFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(changes: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(changes)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }

    params.delete("page");
    router.push(`/admin?${params.toString()}`);
  }

  const hasFilters =
    filters.search !== "" ||
    filters.type !== "all" ||
    filters.period !== "all" ||
    filters.sort !== "new";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const value = new FormData(event.currentTarget).get("q");
          update({ q: String(value ?? "").trim() });
        }}
        className="flex min-w-56 flex-1 items-center gap-2.5 rounded-xs border border-ink/20 bg-white px-4 py-2.5 focus-within:border-accent"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4 shrink-0 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          key={filters.search}
          type="search"
          name="q"
          defaultValue={filters.search}
          placeholder="Пошук за ім’ям, телефоном, коментарем"
          className="w-full bg-transparent text-sm outline-none"
        />
      </form>

      <select
        value={filters.period}
        onChange={(event) => update({ period: event.target.value })}
        className={selectClass}
        aria-label="Період"
      >
        {Object.entries(PERIOD_OPTIONS).map(([value, option]) => (
          <option key={value} value={value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={filters.type}
        onChange={(event) => update({ type: event.target.value })}
        className={selectClass}
        aria-label="Тип заявки"
      >
        {Object.entries(TYPE_OPTIONS).map(([value, option]) => (
          <option key={value} value={value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={filters.sort}
        onChange={(event) => update({ sort: event.target.value })}
        className={selectClass}
        aria-label="Сортування"
      >
        {Object.entries(SORT_OPTIONS).map(([value, option]) => (
          <option key={value} value={value}>
            {option.label}
          </option>
        ))}
      </select>

      {hasFilters ? (
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-xs border border-ink/20 px-4 py-2.5 text-sm transition-colors duration-300 hover:bg-ink hover:text-bone"
        >
          Скинути
        </button>
      ) : null}
    </div>
  );
}
