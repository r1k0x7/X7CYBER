'use client';

import type { AttackEvent } from '@/lib/types';

const TYPE_COLOR: Record<string, string> = {
  'Web Attackers': '#ff8a3b',
  'DDoS Attackers': '#ff3b4e',
  Intruders: '#d65bff',
  Scanners: '#3aa0ff',
  Anonymizers: '#39d98a',
};

function typeColor(t: string): string {
  return TYPE_COLOR[t] ?? '#7c8aa5';
}

export default function EventFeed({ events }: { events: AttackEvent[] }) {
  return (
    <div className="pointer-events-auto absolute bottom-4 left-4 z-10 flex max-h-[60vh] w-[22rem] flex-col overflow-hidden rounded-xl border border-threat-border bg-threat-panel shadow-2xl shadow-black/40 backdrop-blur-md sm:w-[27rem]">
      {/* header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-threat-source opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-threat-source" />
          </span>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-threat-text">
            Live Attack Report
          </h2>
        </div>
        <span className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 font-mono text-[10px] text-threat-dim">
          {events.length}
        </span>
      </div>

      {/* column headings */}
      <div className="grid grid-cols-[58px_1fr_104px] items-center gap-2 border-b border-white/5 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-threat-dim">
        <span>Time</span>
        <span>Source &rarr; Target</span>
        <span className="text-right">Type</span>
      </div>

      {/* rows */}
      <div className="panel-scroll min-h-0 flex-1 overflow-y-auto">
        {events.length === 0 && (
          <div className="py-8 text-center text-[11px] text-threat-dim">
            Waiting for attacks…
          </div>
        )}
        {events.map((e, i) => {
          const color = typeColor(e.attackType);
          return (
            <div
              key={e.id}
              className="group relative grid grid-cols-[58px_1fr_104px] items-center gap-2 border-b border-white/5 px-4 py-2 pl-5 transition-colors last:border-0 hover:bg-white/[0.04]"
              style={i === 0 ? { animation: 'feedIn 0.35s ease-out' } : undefined}
            >
              {/* left accent bar colored by attack type */}
              <span
                className="absolute left-0 top-0 h-full w-[3px]"
                style={{ backgroundColor: color }}
              />

              <span className="font-mono text-[10px] text-threat-dim">
                {new Date(e.time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-mono font-semibold text-threat-source">
                    {e.sourceCode}
                  </span>
                  <span className="text-threat-dim">&rarr;</span>
                  <span className="font-mono font-semibold text-threat-target">
                    {e.targetCode}
                  </span>
                </div>
                <div className="truncate text-[10px] text-threat-dim">
                  {e.sourceCountry} &rarr; {e.targetCountry}
                </div>
              </div>

              <span
                className="flex items-center justify-end gap-1.5 text-right text-[10px] font-medium"
                style={{ color }}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="truncate">{e.attackType.replace(' Attackers', '')}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
