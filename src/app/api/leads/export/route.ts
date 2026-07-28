import { type NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { formatForCsv } from "@/lib/format";
import { exportLeads, parseFilters } from "@/lib/leads";
import { answerLabels } from "@/lib/quiz-config";

const COLUMNS = [
  "ID",
  "Дата",
  "Тип",
  "Ім’я",
  "Телефон",
  "Коментар",
  "Відповіді",
  "UTM",
  "Сторінка",
];

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthed())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const filters = parseFilters(
    Object.fromEntries(request.nextUrl.searchParams.entries()),
  );
  const leads = await exportLeads(filters);

  const lines = [COLUMNS.map(csvCell).join(",")];

  for (const lead of leads) {
    const answers = Object.entries(lead.answers ?? {})
      .map(([key, values]) => `${answerLabels[key] ?? key}: ${values.join(" / ")}`)
      .join("; ");
    const utm = Object.entries(lead.utm ?? {})
      .map(([key, value]) => `${key}=${value}`)
      .join("; ");

    lines.push(
      [
        String(lead.id),
        formatForCsv(lead.created_at),
        lead.lead_type === "callback" ? "Дзвінок" : "Квіз",
        lead.name,
        lead.phone,
        lead.comment ?? "",
        answers,
        utm,
        lead.page_url ?? "",
      ]
        .map(csvCell)
        .join(","),
    );
  }

  // BOM, щоб Excel коректно показував кирилицю
  const csv = `\uFEFF${lines.join("\r\n")}`;
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${date}.csv"`,
    },
  });
}
