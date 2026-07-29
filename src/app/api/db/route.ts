import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";

export async function GET() {
  if (process.env.NODE_ENV === "production" && !(await isAdminAuthed())) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  try {
    const sql = getSql();
    const result = await sql`select now() as now`;

    return NextResponse.json({
      status: "ok",
      now: result[0]?.now ?? null,
    });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
