# Vibe Ramadan Hackathon (MarsHub Landing)

Одностраничный лендинг на **Next.js (App Router)** + **TailwindCSS** для ивента
**Vibe Ramadan Hackathon** внутри экосистемы **MarsHub**.

## Что реализовано

- Светлый визуальный стиль в духе MarsHub: сетка/точки на фоне, жирные заголовки,
  карточки с толстой обводкой и мягкими тенями.
- Цветовые акценты: фиолетовый, зеленый, оранжевый.
- Главные CTA:
  - `Войти через Telegram` (deep-link):
    `https://t.me/vibemarshackathonbot?start=ramadan_hackathon`
  - `Открыть MarsHub`:
    `https://marshub.uz/#`
- Модалка имитации регистрации: **«Ты зарегистрирован ✅»**.
- Секции лендинга:
  - HERO (бейджи `Live`, `AI перевод`, `Спринты`)
  - `Что делать сегодня` (приоритетный блок)
  - `Powered by MarsHub`
  - `Ежедневный режим Рамадана`
  - `Треки участия` (Core / Apps / Agents)
  - `Критичные сервисы` (Mars ID, Store, Security baseline, Repo templates)
  - `Roadmap (4 недели)`
  - `Hall of Fame` (моковые карточки, позже API)
  - `FAQ` (9 вопросов)
  - Footer с плейсхолдер-ссылками на Telegram чат/канал

## Запуск

1. Установить зависимости:

```bash
npm install
```

2. Запустить dev-сервер:

```bash
npm run dev
```

3. Открыть в браузере:

```text
http://localhost:3000
```

## Production build

```bash
npm run build
```

## Где менять ссылку Telegram-бота

Файл: `components/ramadan-landing.tsx`

```ts
const TELEGRAM_BOT_LINK = "https://t.me/vibemarshackathonbot?start=ramadan_hackathon";
```

## Регистрация прямо в боте

Добавлен webhook endpoint: `app/api/telegram/webhook/route.ts`.

Flow в личке бота:

1. `/start`
2. Ввод имени
3. Ввод уникального никнейма
4. Сохранение пользователя + уведомление в группу

Хранилище пользователей и сессий:

- `data/bot-registrations.json` (создается автоматически)

Нужные переменные:

```env
TELEGRAM_BOT_TOKEN=<TELEGRAM_BOT_TOKEN>
TELEGRAM_CHAT_ID=-1003894927296
TELEGRAM_WEBHOOK_SECRET=<TELEGRAM_WEBHOOK_SECRET>
```

Установка webhook:

```bash
curl -X POST "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url":"https://<YOUR_DOMAIN>/api/telegram/webhook",
    "secret_token":"<TELEGRAM_WEBHOOK_SECRET>",
    "allowed_updates":["message"]
  }'
```

Проверка:

```bash
curl "https://<YOUR_DOMAIN>/api/telegram/webhook"
```

Если нужно отключить webhook:

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/deleteWebhook"
```
