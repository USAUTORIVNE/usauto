import { NextResponse, type NextRequest } from "next/server";
import { insertLead, listLeads, parseLeadInput } from "@/lib/leads";

export async function POST(request: NextRequest) {
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
  const token = process.env.ADMIN_TOKEN;

  if (!token || request.headers.get("x-admin-token") !== token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const leads = await listLeads();

  return NextResponse.json({ ok: true, leads });
}
