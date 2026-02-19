"use client";

import { useEffect, useState } from "react";
import HallOfFame from "@/components/hall-of-fame";

const TELEGRAM_BOT_LINK =
  "https://t.me/vibemarshackathonbot?start=ramadan_hackathon";

const TELEGRAM_GROUP_LINK = "https://t.me/viberamadanhackathon";

const heroBadges = [
  { label: "Live", colorClass: "mh-bg-green" },
  { label: "AI-перевод", colorClass: "mh-bg-purple" },
  { label: "Спринты", colorClass: "mh-bg-orange" },
  { label: "MarsHub alpha", colorClass: "mh-bg-ink" },
] as const;

const todayChecklist = [
  "Зайди через Telegram",
  "Выбери формат: наша задача или свой AI-проект",
  "Сделай рабочий кусок кода (от 1 часа)",
  "Покажи результат в Telegram",
  "Подготовь проект к публикации в MarsHub",
] as const;

const poweredByItems = [
  "Единый вход Mars ID",
  "Публикация и каталог проектов (скоро)",
  "Шаблоны сервисов",
  "Инструменты команды",
  "AI-агенты и автоматика",
] as const;

const ramadanRoutine = [
  {
    title: "После фаджра",
    text: "Коротко синкаемся и выбираем, что делаем сегодня.",
    colorClass: "mh-bg-purple",
  },
  {
    title: "Deep focus около часа",
    text: "Спокойно кодим и закрываем конкретный кусок работы.",
    colorClass: "mh-bg-green",
  },
  {
    title: "1 готовый результат в день",
    text: "Это может быть PR, фича или прототип, главное чтобы работало.",
    colorClass: "mh-bg-orange",
  },
  {
    title: "Вечером отчет",
    text: "Короткий апдейт в Telegram и план на следующий шаг.",
    colorClass: "mh-bg-ink",
  },
] as const;

const tracks = [
  {
    title: "Core",
    text: "База MarsHub: вход, роли, структура и публикация.",
    accentClass: "mh-bg-purple",
  },
  {
    title: "Apps",
    text: "Сервисы и инструменты, которые потом будут жить в MarsHub.",
    accentClass: "mh-bg-green",
  },
  {
    title: "Agents",
    text: "AI-ассистенты для кода, контента, саппорта и автоматизации.",
    accentClass: "mh-bg-orange",
  },
] as const;

const criticalDirections = [
  {
    title: "Mars ID",
    text: "Единый вход и роли.",
  },
  {
    title: "Store",
    text: "Каталог и публикация проектов внутри экосистемы.",
  },
  {
    title: "Общие стандарты",
    text: "Общие правила, чтобы сервисы работали вместе.",
  },
  {
    title: "Шаблоны",
    text: "Заготовки, чтобы не начинать каждый раз с нуля.",
  },
] as const;

const roadmap = [
  {
    week: "Сейчас",
    title: "Альфа-превью",
    text: "Проверяем процесс, правила и рабочий ритм команды.",
  },
  {
    week: "Ближайшие дни",
    title: "Публикация в MarsHub",
    text: "Доводим механику публикации проектов внутри платформы.",
  },
  {
    week: "После стабилизации",
    title: "Расширение инструментов",
    text: "Добавляем больше шаблонов, сервисов и AI-функций.",
  },
  {
    week: "Открытый этап",
    title: "Публичный запуск",
    text: "Когда все стабильно, открываем участие для широкой аудитории.",
  },
] as const;

const faqItems = [
  {
    question: "Это сложно?",
    answer: "Нет, можно начать с маленьких задач.",
  },
  {
    question: "Можно участвовать без большого опыта?",
    answer: "Да, есть задачи разного уровня.",
  },
  {
    question: "Обязательно делать каждый день?",
    answer: "Нет, но один PR в день дает лучший темп.",
  },
  {
    question: "Где писать код?",
    answer: "Пока где удобно: VS Code, Cursor, любой редактор.",
  },
  {
    question: "Нужно публиковать прямо сейчас?",
    answer: "Нет. Сейчас альфа-превью, публикация в MarsHub откроется скоро.",
  },
  {
    question: "Можно делать свою идею, а не брать задачу?",
    answer: "Да. Можно взять нашу задачу, а можно собрать свой AI-проект.",
  },
  {
    question: "Какое главное условие участия?",
    answer: "Проект должен быть AI-ассистентом или иметь AI-функцию.",
  },
  {
    question: "Где общение?",
    answer: "В Telegram-чате хакатона.",
  },
  {
    question: "Будет открытый запуск после альфы?",
    answer: "Да. После обкатки откроем режим для всех.",
  },
] as const;

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isModalOpen]);

  const openTelegramFlow = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="mh-grid absolute inset-0 opacity-80" />
        <div
          className="absolute -left-28 top-10 h-64 w-64 rounded-full blur-3xl"
          style={{ backgroundColor: "var(--mh-purple)", opacity: 0.2 }}
        />
        <div
          className="absolute right-0 top-40 h-64 w-64 rounded-full blur-3xl"
          style={{ backgroundColor: "var(--mh-green)", opacity: 0.2 }}
        />
        <div
          className="absolute bottom-8 left-1/3 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: "var(--mh-orange)", opacity: 0.2 }}
        />
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <section className="mh-card animate-rise p-6 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-600">
            Режим внутри экосистемы MarsHub
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-zinc-950 sm:text-5xl lg:text-6xl">
            Vibe Ramadan Hackathon
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-zinc-700 sm:text-lg">
            30 дней инженерного ритма внутри MarsHub.
            <br />
            Сейчас это полузакрытое альфа-превью.
            <br />
            Спокойно собираем рабочие AI-проекты.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-700 sm:text-lg">
            Пока кодим в любых редакторах.
            <br />
            Публикацию через MarsHub включим в ближайшие дни.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {heroBadges.map((badge) => (
              <span key={badge.label} className={`mh-pill ${badge.colorClass} text-white`}>
                {badge.label}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={TELEGRAM_BOT_LINK}
              target="_blank"
              rel="noreferrer"
              onClick={openTelegramFlow}
              className="mh-bg-purple inline-flex items-center justify-center rounded-2xl border-2 border-zinc-900 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_22px_rgba(111,79,246,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(111,79,246,0.38)]"
            >
              Войти через Telegram
            </a>
            <a
              href="https://marshub.uz/#"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-zinc-900 bg-white px-6 py-3 text-sm font-bold text-zinc-900 shadow-[0_10px_20px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:bg-zinc-50"
            >
              Открыть MarsHub
            </a>
          </div>
        </section>

        <section
          id="today"
          className="mh-card animate-rise mt-8 p-6 md:p-8"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xl">
              <p className="mh-pill mh-bg-orange text-white">Самое важное</p>
              <h2 className="mt-4 text-3xl font-extrabold text-zinc-950 sm:text-4xl">
                Что делать сегодня
              </h2>
              <p className="mt-3 text-zinc-700">
                Вкатываешься быстро.
                <br />
                Делаешь шаг и показываешь результат.
              </p>
            </div>
            <ol className="w-full max-w-xl space-y-3">
              {todayChecklist.map((item, index) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border-2 border-zinc-900/90 bg-zinc-50 px-4 py-3 shadow-[0_10px_20px_rgba(15,23,42,0.08)]"
                >
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-zinc-900 bg-white text-xs font-bold text-zinc-900">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 sm:text-base">{item}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-5 text-sm font-semibold text-zinc-700">Один день, один шаг.</p>
        </section>

        <section className="mh-card animate-rise mt-8 p-6 md:p-8" style={{ animationDelay: "110ms" }}>
          <h2 className="text-3xl font-extrabold text-zinc-950 sm:text-4xl">Что это вообще?</h2>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-zinc-700">
            Это альфа-режим внутри MarsHub перед полноценным запуском.
          </p>
          <p className="mt-3 max-w-4xl text-base leading-relaxed text-zinc-700">
            Сейчас можно кодить где удобно, обязательной публикации сегодня нет.
          </p>
          <p className="mt-3 max-w-4xl text-base leading-relaxed text-zinc-700">
            Хочешь, берешь нашу задачу. Хочешь, делаешь свой AI-ассистент.
            Главное условие: каждый день должен быть живой рабочий прогресс.
          </p>
        </section>

        <section
          id="powered-by"
          className="mh-card animate-rise mt-8 p-6 md:p-8"
          style={{ animationDelay: "120ms" }}
        >
          <p className="mh-pill mh-bg-green text-white">Powered by MarsHub</p>
          <h2 className="mt-4 text-3xl font-extrabold text-zinc-950 sm:text-4xl">
            Хакатон крутится вокруг MarsHub, а не рядом с ним.
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {poweredByItems.map((item) => (
              <p key={item} className="text-base font-semibold text-zinc-800">
                {item}
              </p>
            ))}
          </div>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-zinc-700">
            Это полузакрытая альфа, чтобы довести процесс до нормального релиза.
          </p>
        </section>

        <section
          id="routine"
          className="animate-rise mt-8"
          style={{ animationDelay: "160ms" }}
        >
          <h2 className="text-3xl font-extrabold text-zinc-950 sm:text-4xl">
            Ежедневный режим
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {ramadanRoutine.map((item) => (
              <article key={item.title} className="mh-card p-5">
                <span
                  className={`mb-3 block h-2 w-16 rounded-full ${item.colorClass}`}
                  aria-hidden
                />
                <h3 className="text-xl font-bold text-zinc-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 sm:text-base">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="tracks"
          className="animate-rise mt-8"
          style={{ animationDelay: "200ms" }}
        >
          <h2 className="text-3xl font-extrabold text-zinc-950 sm:text-4xl">Треки участия</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {tracks.map((track) => (
              <article key={track.title} className="mh-card p-5">
                <span
                  className={`mb-3 block h-2 w-20 rounded-full ${track.accentClass}`}
                  aria-hidden
                />
                <h3 className="text-xl font-bold text-zinc-950">{track.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 sm:text-base">
                  {track.text}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold text-zinc-700">
            Выбирай то, что ближе. Трек можно менять.
          </p>
        </section>

        <section
          id="critical-services"
          className="animate-rise mt-8"
          style={{ animationDelay: "240ms" }}
        >
          <h2 className="text-3xl font-extrabold text-zinc-950 sm:text-4xl">
            Критичные направления
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {criticalDirections.map((service) => (
              <article key={service.title} className="mh-card p-5">
                <h3 className="text-xl font-bold text-zinc-950">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 sm:text-base">
                  {service.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="roadmap"
          className="animate-rise mt-8"
          style={{ animationDelay: "260ms" }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-extrabold text-zinc-950 sm:text-4xl">
              Гибкий план
            </h2>
            <span className="mh-pill mh-bg-orange text-white">Обновляется по ходу альфы</span>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-700 sm:text-base">
            Фиксированного roadmap пока нет. Двигаемся короткими итерациями и
            обновляем блок по факту готовности.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {roadmap.map((item) => (
              <article key={item.week} className="mh-card p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                  {item.week}
                </p>
                <h3 className="mt-2 text-xl font-bold text-zinc-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 sm:text-base">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-8">
          <HallOfFame />
        </div>

        <section id="faq" className="animate-rise mt-8" style={{ animationDelay: "320ms" }}>
          <h2 className="text-3xl font-extrabold text-zinc-950 sm:text-4xl">FAQ</h2>
          <div className="mt-4 space-y-3">
            {faqItems.map((item) => (
              <details key={item.question} className="mh-card group p-5">
                <summary className="cursor-pointer list-none text-base font-bold text-zinc-950">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700 sm:text-base">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <footer className="mh-card animate-rise mt-10 p-6" style={{ animationDelay: "360ms" }}>
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-lg font-extrabold text-zinc-950">Vibe Ramadan Hackathon</p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-700">
                Альфа-режим разработки внутри MarsHub.
              </p>
              <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-zinc-800">
                Кодишь где удобно, показываешь результат, потом публикуешь в MarsHub.
              </p>
            </div>
            <div className="space-y-2 text-sm font-semibold">
              <a
                href={TELEGRAM_GROUP_LINK}
                target="_blank"
                rel="noreferrer"
                className="block text-zinc-800 underline decoration-zinc-400 underline-offset-4"
              >
                Telegram чат: @viberamadanhackathon
              </a>
              <a
                href="https://marshub.uz/#"
                target="_blank"
                rel="noreferrer"
                className="block text-zinc-800 underline decoration-zinc-400 underline-offset-4"
              >
                MarsHub: marshub.uz
              </a>
            </div>
          </div>
        </footer>
      </main>

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Регистрация подтверждена"
            className="mh-card w-full max-w-md p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-2xl font-extrabold text-zinc-950">Ты зарегистрирован ✅</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700 sm:text-base">
              Это демонстрационная модалка. Реальный вход выполняется через Telegram-бота.
              Сейчас идет альфа-превью, публикация проектов в MarsHub откроется скоро.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <a
                href={TELEGRAM_BOT_LINK}
                target="_blank"
                rel="noreferrer"
                className="mh-bg-purple inline-flex flex-1 items-center justify-center rounded-xl border-2 border-zinc-900 px-4 py-3 text-sm font-bold text-white"
              >
                Открыть бота
              </a>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex flex-1 items-center justify-center rounded-xl border-2 border-zinc-900 bg-white px-4 py-3 text-sm font-bold text-zinc-900"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
