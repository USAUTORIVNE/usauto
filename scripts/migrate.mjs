import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not set (додай його у .env.local)");
  process.exit(1);
}

const sql = neon(databaseUrl);

await sql`
  create table if not exists leads (
    id bigserial primary key,
    lead_type text not null default 'quiz',
    name text not null,
    phone text not null,
    comment text,
    answers jsonb not null default '{}'::jsonb,
    page_url text,
    utm jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
  )
`;

await sql`create index if not exists leads_created_at_idx on leads (created_at desc)`;

console.log("Готово: таблиця leads створена/оновлена.");
