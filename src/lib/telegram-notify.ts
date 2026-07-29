import "server-only";

import { answerLabels } from "@/lib/quiz-config";
import type { LeadInput } from "@/lib/leads";
import { LOCALE, TIMEZONE } from "@/lib/timezone";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatAnswers(answers: Record<string, string[]>): string[] {
  return Object.entries(answers).flatMap(([key, values]) => {
    if (!values.length) return [];

    const label = answerLabels[key] ?? key;
    return [`<b>${escapeHtml(label)}:</b> ${escapeHtml(values.join(", "))}`];
  });
}

function formatUtm(utm: Record<string, string>): string[] {
  return Object.entries(utm).map(
    ([key, value]) => `<b>${escapeHtml(key)}:</b> ${escapeHtml(value)}`,
  );
}

export function formatLeadTelegramMessage(lead: LeadInput, id: number): string {
  const lines = [
    `<b>🆕 Нова заявка #${id}</b>`,
    `<b>Тип:</b> ${lead.leadType === "callback" ? "Замовити дзвінок" : "Підбір авто"}`,
    `<b>👤 Ім’я:</b> ${escapeHtml(lead.name)}`,
    `<b>📞 Телефон:</b> ${escapeHtml(lead.phone)}`,
  ];

  if (lead.leadType === "quiz") {
    const answers = formatAnswers(lead.answers);
    if (answers.length > 0) {
      lines.push("", "<b>Відповіді квізу</b>", ...answers);
    }
  }

  if (lead.comment) {
    lines.push("", `<b>💬 Коментар:</b> ${escapeHtml(lead.comment)}`);
  }

  const utmLines = formatUtm(lead.utm);
  if (utmLines.length > 0) {
    lines.push("", "<b>UTM</b>", ...utmLines);
  }

  if (lead.pageUrl) {
    lines.push("", `<b>🔗 Сторінка:</b> ${escapeHtml(lead.pageUrl)}`);
  }

  const adminUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (adminUrl) {
    lines.push("", `<a href="${escapeHtml(`${adminUrl}/admin`)}">Відкрити адмінку</a>`);
  }

  lines.push(
    "",
    `<i>${escapeHtml(
      new Intl.DateTimeFormat(LOCALE, {
        timeZone: TIMEZONE,
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date()),
    )}</i>`,
  );

  return lines.join("\n");
}

function getTelegramChatIds(): string[] {
  const raw = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!raw) return [];

  return [
    ...new Set(
      raw
        .split(/[,;\s]+/)
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  ];
}

async function sendTelegramMessage(
  token: string,
  chatId: string,
  text: string,
): Promise<boolean> {
  let response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (response.ok) return true;

  let details = await response.text().catch(() => "");

  if (details.includes("can't parse entities")) {
    response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.replace(/<[^>]+>/g, ""),
        disable_web_page_preview: true,
      }),
    });

    if (response.ok) return true;
    details = await response.text().catch(() => details);
  }

  console.error("Telegram notify failed", chatId, response.status, details);
  return false;
}

export async function notifyTelegramLead(
  lead: LeadInput,
  id: number,
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatIds = getTelegramChatIds();

  if (!token || chatIds.length === 0) return false;

  const text = formatLeadTelegramMessage(lead, id);
  const results = await Promise.all(
    chatIds.map((chatId) => sendTelegramMessage(token, chatId, text)),
  );

  return results.some(Boolean);
}
