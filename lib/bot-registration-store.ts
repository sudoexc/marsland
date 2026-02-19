import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type RegistrationStep = "awaiting_name" | "awaiting_nickname";

export type RegistrationSession = {
  step: RegistrationStep;
  fullName?: string;
  updatedAt: string;
};

export type RegisteredParticipant = {
  telegramUserId: number;
  telegramUsername?: string;
  fullName: string;
  nickname: string;
  nicknameNormalized: string;
  registeredAt: string;
};

export type BotRegistrationStore = {
  sessions: Record<string, RegistrationSession>;
  participants: Record<string, RegisteredParticipant>;
  nicknameIndex: Record<string, string>;
  processedUpdateIds: number[];
};

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(STORE_DIR, "bot-registrations.json");
const PROCESSED_UPDATES_LIMIT = 500;

const EMPTY_STORE: BotRegistrationStore = {
  sessions: {},
  participants: {},
  nicknameIndex: {},
  processedUpdateIds: [],
};

declare global {
  // eslint-disable-next-line no-var
  var __botRegistrationStore: BotRegistrationStore | undefined;
}

const isServerlessReadonly = Boolean(process.env.VERCEL);

function cloneEmptyStore(): BotRegistrationStore {
  return {
    sessions: {},
    participants: {},
    nicknameIndex: {},
    processedUpdateIds: [],
  };
}

function getMemoryStore(): BotRegistrationStore {
  if (!globalThis.__botRegistrationStore) {
    globalThis.__botRegistrationStore = cloneEmptyStore();
  }

  return globalThis.__botRegistrationStore;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeStore(value: unknown): BotRegistrationStore {
  if (!isRecord(value)) {
    return { ...EMPTY_STORE };
  }

  const sessions = isRecord(value.sessions)
    ? (value.sessions as Record<string, RegistrationSession>)
    : {};

  const participants = isRecord(value.participants)
    ? (value.participants as Record<string, RegisteredParticipant>)
    : {};

  const nicknameIndex = isRecord(value.nicknameIndex)
    ? (value.nicknameIndex as Record<string, string>)
    : {};

  const processedUpdateIds = Array.isArray(value.processedUpdateIds)
    ? value.processedUpdateIds
        .filter((item): item is number => typeof item === "number")
        .slice(-PROCESSED_UPDATES_LIMIT)
    : [];

  return {
    sessions,
    participants,
    nicknameIndex,
    processedUpdateIds,
  };
}

async function ensureStoreDir() {
  await mkdir(STORE_DIR, { recursive: true });
}

async function readStore(): Promise<BotRegistrationStore> {
  if (isServerlessReadonly) {
    return getMemoryStore();
  }

  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return normalizeStore(parsed);
  } catch {
    return cloneEmptyStore();
  }
}

async function writeStore(store: BotRegistrationStore): Promise<void> {
  if (isServerlessReadonly) {
    globalThis.__botRegistrationStore = store;
    return;
  }

  await ensureStoreDir();
  await writeFile(STORE_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export async function withStore<T>(
  mutator: (store: BotRegistrationStore) => Promise<T> | T,
): Promise<T> {
  const store = await readStore();
  const result = await mutator(store);
  await writeStore(store);
  return result;
}
