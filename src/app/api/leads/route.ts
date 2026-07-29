import { NextResponse, type NextRequest } from "next/server";
import { insertLead, listLeads } from "@/lib/leads";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import {
  isBodyTooLarge,
  isSameOriginRequest,
  safeEqualSecret,
} from "@/lib/request-security";
import { notifyTelegramLead } from "@/lib/telegram-notify";
import { parseLeadInput } from "@/lib/validation/parse-lead";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { ok: false, message: "Заборонений запит" },
      { status: 403 },
    );
  }

  if (isBodyTooLarge(request)) {
    return NextResponse.json(
      { ok: false, message: "Занадто великий запит" },
      { status: 413 },
    );
  }

  const ip = getClientIp(request);
  const limited = rateLimit(`lead:${ip}`, { limit: 8, windowMs: 60_000 });

  if (!limited.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: "Забагато спроб. Спробуйте пізніше.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Некоректний запит" },
      { status: 400 },
    );
  }

  const parsed = parseLeadInput(body);

  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, errors: parsed.errors },
      { status: 422 },
    );
  }

  try {
    const id = await insertLead(parsed.data);

    try {
      await notifyTelegramLead(parsed.data, id);
    } catch (error) {
      console.error("Telegram notify error", error);
    }

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    console.error("Failed to save lead", error);

    return NextResponse.json(
      { ok: false, message: "Не вдалося зберегти заявку" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const token = process.env.ADMIN_TOKEN?.trim();

  if (!token) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const ip = getClientIp(request);
  const limited = rateLimit(`leads-read:${ip}`, { limit: 30, windowMs: 60_000 });

  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, message: "Забагато спроб" },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  const provided = request.headers.get("x-admin-token") ?? "";

  if (!provided || !safeEqualSecret(provided, token)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const leads = await listLeads();

  return NextResponse.json({ ok: true, leads });
}
