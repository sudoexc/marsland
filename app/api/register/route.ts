import { NextResponse } from "next/server";

const PLACEHOLDER_BOT_TOKEN = "<TELEGRAM_BOT_TOKEN>";
const PLACEHOLDER_CHAT_ID = "<TELEGRAM_CHAT_ID>";

const validRoles = new Set([
  "backend",
  "frontend",
  "devops",
  "security",
  "designer",
  "writer",
  "PM",
]);

type RegisterBody = {
  name?: string;
  telegramUsername?: string;
  role?: string;
};

function sanitizeText(value: string): string {
  return value.replace(/[<>]/g, "");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterBody;

    const name = sanitizeText((body.name ?? "").trim());
    const telegramUsername = sanitizeText((body.telegramUsername ?? "").trim());
    const role = (body.role ?? "").trim();

    if (!name || !telegramUsername || !role) {
      return NextResponse.json(
        {
          ok: false,
          message: "Заполните имя, Telegram username и роль.",
        },
        { status: 400 },
      );
    }

    if (!/^@?[a-zA-Z0-9_]{5,32}$/.test(telegramUsername)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Некорректный Telegram username.",
        },
        { status: 400 },
      );
    }

    if (!validRoles.has(role)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Роль не поддерживается.",
        },
        { status: 400 },
      );
    }

    const normalizedTelegram = telegramUsername.startsWith("@")
      ? telegramUsername
      : `@${telegramUsername}`;

    const botToken = process.env.TELEGRAM_BOT_TOKEN ?? PLACEHOLDER_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID ?? PLACEHOLDER_CHAT_ID;

    if (botToken === PLACEHOLDER_BOT_TOKEN || chatId === PLACEHOLDER_CHAT_ID) {
      return NextResponse.json({
        ok: true,
        mocked: true,
        message:
          "Заявка принята в демо-режиме. Укажите TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID для реальной отправки.",
      });
    }

    const message = [
      "Новая заявка в Vibe Ramadan Hackathon",
      `Имя: ${name}`,
      `Telegram: ${normalizedTelegram}`,
      `Роль: ${role}`,
      `Отправлено: ${new Date().toISOString()}`,
    ].join("\n");

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          disable_web_page_preview: true,
        }),
      },
    );

    const telegramResult = (await telegramResponse.json()) as {
      ok?: boolean;
      description?: string;
    };

    if (!telegramResponse.ok || !telegramResult.ok) {
      return NextResponse.json(
        {
          ok: false,
          message:
            telegramResult.description ?? "Ошибка Telegram API при отправке.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      mocked: false,
      message: "Заявка успешно отправлена в Telegram.",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Не удалось обработать заявку. Проверьте формат данных.",
      },
      { status: 500 },
    );
  }
}
