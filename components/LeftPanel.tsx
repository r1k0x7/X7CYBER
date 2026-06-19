'use client';

import type { AttackType } from '@/lib/types';
import { ATTACK_TYPES } from '@/lib/types';

interface Props {
  active: Set<AttackType>;
  onToggle: (t: AttackType) => void;
  paused: boolean;
  onPauseToggle: () => void;
}

export default function LeftPanel({
  active,
  onToggle,
  paused,
  onPauseToggle,
}: Props) {
  return (
    <div className="pointer-events-auto absolute left-4 top-4 z-10 w-60 rounded-md border border-threat-border bg-threat-panel p-4 backdrop-blur-md">
      <Section title="Attackers">
        <div className="flex flex-col gap-2">
          {ATTACK_TYPES.map((t) => (
            <label
              key={t}
              className="flex cursor-pointer items-center gap-2 text-xs text-threat-text"
            >
              <input
                type="checkbox"
                checked={active.has(t)}
                onChange={() => onToggle(t)}
                className="h-3.5 w-3.5 accent-threat-target"
              />
              {t}
            </label>
          ))}
        </div>
      </Section>

      <button
        onClick={onPauseToggle}
        className="mt-2 w-full rounded border border-threat-border py-1.5 text-xs text-threat-text transition hover:bg-white/5"
      >
        {paused ? 'Resume' : 'Pause'}
      </button>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-threat-dim">
        {title}
      </h2>
      {children}
    </div>
  );
}
