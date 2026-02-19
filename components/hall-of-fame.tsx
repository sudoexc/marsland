type HallOfFameEntry = {
  name: string;
  role: string;
  track: "Core" | "Apps" | "Agents";
  prCount: number;
  streak: string;
  accent: "purple" | "green" | "orange";
};

const mockEntries: HallOfFameEntry[] = [
  {
    name: "Амина Юлдашева",
    role: "Backend Engineer",
    track: "Core",
    prCount: 14,
    streak: "7 дней подряд",
    accent: "purple",
  },
  {
    name: "Руслан Каримов",
    role: "Frontend Engineer",
    track: "Apps",
    prCount: 11,
    streak: "5 дней подряд",
    accent: "green",
  },
  {
    name: "Сабрина Набиева",
    role: "AI Engineer",
    track: "Agents",
    prCount: 9,
    streak: "4 дня подряд",
    accent: "orange",
  },
];

const accentClass: Record<HallOfFameEntry["accent"], string> = {
  purple: "mh-bg-purple",
  green: "mh-bg-green",
  orange: "mh-bg-orange",
};

type HallOfFameProps = {
  entries?: HallOfFameEntry[];
};

export default function HallOfFame({ entries = mockEntries }: HallOfFameProps) {
  return (
    <section id="hall-of-fame" className="animate-rise" style={{ animationDelay: "280ms" }}>
      <div className="mb-4 space-y-2">
        <h2 className="text-3xl font-extrabold text-zinc-950 sm:text-4xl">Hall of Fame</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-zinc-700 sm:text-base">
          Здесь будут участники, которые реально делали результат: PR, рабочие прототипы,
          полезные AI-фичи и стабильный прогресс по дням.
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Сейчас показаны моковые карточки
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {entries.map((entry) => (
          <article key={entry.name} className="mh-card p-5">
            <div
              className={`mb-4 h-2 w-full rounded-full ${accentClass[entry.accent]}`}
              aria-hidden
            />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-zinc-950">{entry.name}</h3>
              <p className="text-sm font-medium text-zinc-600">{entry.role}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl border-2 border-zinc-900/90 bg-zinc-50 px-3 py-2">
                <p className="text-zinc-500">Трек</p>
                <p className="font-bold text-zinc-950">{entry.track}</p>
              </div>
              <div className="rounded-xl border-2 border-zinc-900/90 bg-zinc-50 px-3 py-2">
                <p className="text-zinc-500">PR</p>
                <p className="font-bold text-zinc-950">{entry.prCount}</p>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-zinc-700">{entry.streak}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
