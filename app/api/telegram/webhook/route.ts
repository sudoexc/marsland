import { NextResponse } from "next/server";
import {
  type RegisteredParticipant,
  withStore,
} from "@/lib/bot-registration-store";
import { sendTelegramMessage } from "@/lib/telegram-bot";

export const runtime = "nodejs";

const NICKNAME_REGEX = /^[a-zA-Z0-9_]{4,32}$/;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 60;

type TelegramUser = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
};

type TelegramChat = {
  id: number;
  type: "private" | "group" | "supergroup" | "channel";
};

type TelegramMessage = {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  text?: string;
};

type TelegramUpdate = {
  update_id: number;
  message?: TelegramMessage;
};

type OutgoingMessage = {
  chatId: number | string;
  text: string;
};

function normalizeNickname(input: string): string {
  return input.trim().replace(/^@/, "").toLowerCase();
}

function normalizeName(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function participantLabel(participant: RegisteredParticipant): string {
  return `@${participant.nicknameNormalized}`;
}

function buildGroupAnnouncement(
  participant: RegisteredParticipant,
  fromUser: TelegramUser,
): string {
  const telegramHandle = fromUser.username ? `@${fromUser.username}` : `id:${fromUser.id}`;

  return [
    "Новый участник Vibe Ramadan Hackathon",
    `Имя: ${participant.fullName}`,
    `Ник: @${participant.nicknameNormalized}`,
    `Telegram: ${telegramHandle}`,
  ].join("\n");
}

async function processPrivateMessage(
  update: TelegramUpdate,
  message: TelegramMessage,
  botToken: string,
  groupChatId?: string,
) {
  const user = message.from;
  const text = (message.text ?? "").trim();

  if (!user || !text) {
    return;
  }

  const outgoingMessages = await withStore((store) => {
    if (store.processedUpdateIds.includes(update.update_id)) {
      return [] as OutgoingMessage[];
    }

    store.processedUpdateIds.push(update.update_id);
    store.processedUpdateIds = store.processedUpdateIds.slice(-500);

    const userKey = String(user.id);
    const existingParticipant = store.participants[userKey];
    const session = store.sessions[userKey];
    const replies: OutgoingMessage[] = [];

    if (text.startsWith("/start")) {
      if (existingParticipant) {
        replies.push({
          chatId: message.chat.id,
          text: `Ты уже зарегистрирован как ${participantLabel(existingParticipant)}.`,
        });
        return replies;
      }

      store.sessions[userKey] = {
        step: "awaiting_name",
        updatedAt: new Date().toISOString(),
      };

      replies.push({
        chatId: message.chat.id,
        text: [
          "Регистрация в Vibe Ramadan Hackathon",
          "Шаг 1/2: отправь свое имя (2–60 символов).",
          "Если хочешь начать заново в любой момент: /start",
        ].join("\n"),
      });
      return replies;
    }

    if (text.startsWith("/cancel")) {
      delete store.sessions[userKey];
      replies.push({
        chatId: message.chat.id,
        text: "Регистрация отменена. Чтобы начать заново: /start",
      });
      return replies;
    }

    if (existingParticipant) {
      replies.push({
        chatId: message.chat.id,
        text: `Ты уже зарегистрирован как ${participantLabel(existingParticipant)}.`,
      });
      return replies;
    }

    if (!session) {
      replies.push({
        chatId: message.chat.id,
        text: "Чтобы зарегистрироваться, нажми /start",
      });
      return replies;
    }

    if (session.step === "awaiting_name") {
      const fullName = normalizeName(text);

      if (
        fullName.length < NAME_MIN_LENGTH ||
        fullName.length > NAME_MAX_LENGTH ||
        fullName.startsWith("/")
      ) {
        replies.push({
          chatId: message.chat.id,
          text: "Имя должно быть длиной от 2 до 60 символов. Попробуй еще раз.",
        });
        return replies;
      }

      store.sessions[userKey] = {
        step: "awaiting_nickname",
        fullName,
        updatedAt: new Date().toISOString(),
      };

      replies.push({
        chatId: message.chat.id,
        text: [
          "Шаг 2/2: отправь уникальный никнейм.",
          "Формат: латиница, цифры, underscore, длина 4–32.",
          "Пример: mars_builder_01",
        ].join("\n"),
      });

      return replies;
    }

    if (session.step === "awaiting_nickname") {
      const nicknameNormalized = normalizeNickname(text);

      if (!NICKNAME_REGEX.test(nicknameNormalized)) {
        replies.push({
          chatId: message.chat.id,
          text: "Некорректный ник. Разрешено: a-z, 0-9, _. Длина 4–32.",
        });
        return replies;
      }

      if (store.nicknameIndex[nicknameNormalized]) {
        replies.push({
          chatId: message.chat.id,
          text: "Этот ник уже занят. Выбери другой.",
        });
        return replies;
      }

      const participant: RegisteredParticipant = {
        telegramUserId: user.id,
        telegramUsername: user.username,
        fullName: session.fullName ?? user.first_name ?? "Без имени",
        nickname: `@${nicknameNormalized}`,
        nicknameNormalized,
        registeredAt: new Date().toISOString(),
      };

      store.participants[userKey] = participant;
      store.nicknameIndex[nicknameNormalized] = userKey;
      delete store.sessions[userKey];

      replies.push({
        chatId: message.chat.id,
        text: [
          "Ты зарегистрирован.",
          `Имя: ${participant.fullName}`,
          `Ник: @${nicknameNormalized}`,
          "До встречи в ежедневном спринте.",
        ].join("\n"),
      });

      if (groupChatId) {
        replies.push({
          chatId: groupChatId,
          text: buildGroupAnnouncement(participant, user),
        });
      }

      return replies;
    }

    replies.push({
      chatId: message.chat.id,
      text: "Неизвестное состояние регистрации. Напиши /start",
    });
    delete store.sessions[userKey];
    return replies;
  });

  for (const reply of outgoingMessages) {
    try {
      await sendTelegramMessage(botToken, reply.chatId, reply.text);
    } catch (error) {
      const isGroupNotification =
        typeof groupChatId === "string" &&
        String(reply.chatId) === String(groupChatId);

      if (isGroupNotification) {
        console.error("Failed to send group notification:", error);
        continue;
      }

      throw error;
    }
  }
}

export async function POST(request: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const groupChatId = process.env.TELEGRAM_CHAT_ID;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!botToken) {
    return NextResponse.json(
      { ok: false, message: "TELEGRAM_BOT_TOKEN is not configured." },
      { status: 500 },
    );
  }

  if (webhookSecret) {
    const secretHeader = request.headers.get(
      "x-telegram-bot-api-secret-token",
    );

    if (secretHeader !== webhookSecret) {
      return NextResponse.json(
        { ok: false, message: "Invalid webhook secret." },
        { status: 401 },
      );
    }
  }

  const update = (await request.json()) as TelegramUpdate;
  const message = update.message;

  if (!message) {
    return NextResponse.json({ ok: true });
  }

  if (message.chat.type !== "private") {
    return NextResponse.json({ ok: true });
  }

  try {
    await processPrivateMessage(update, message, botToken, groupChatId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const messageText =
      error instanceof Error ? error.message : "Unknown webhook error";

    return NextResponse.json(
      {
        ok: false,
        message: messageText,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/telegram/webhook",
  });
}
