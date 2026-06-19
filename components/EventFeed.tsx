'use client';

import type { AttackEvent } from '@/lib/types';

const TYPE_COLOR: Record<string, string> = {
  'Web Attackers': '#ff8a3b',
  'DDoS Attackers': '#ff3b4e',
  Intruders: '#d65bff',
  Scanners: '#3aa0ff',
  Anonymizers: '#39d98a',
};

export default function EventFeed({ events }: { events: AttackEvent[] }) {
  return (
    <div className="pointer-events-auto absolute bottom-4 left-4 z-10 flex max-h-[60vh] w-[22rem] flex-col rounded-lg border border-threat-border bg-threat-panel backdrop-blur-md sm:w-[26rem]">
      {/* header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-threat-text">
          Live Attack Report
        </h2>
        <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-threat-dim">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-threat-source" />
          Live
        </span>
      </div>

      {/* column headings */}
      <div className="grid grid-cols-[64px_1fr_110px] items-center gap-2 border-b border-white/5 px-4 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-threat-dim">
        <span>Time</span>
        <span>Source &rarr; Target</span>
        <span className="text-right">Attack Type</span>
      </div>

      {/* rows */}
      <div className="panel-scroll min-h-0 flex-1 overflow-y-auto">
        {events.length === 0 && (
          <div className="py-6 text-center text-[11px] text-threat-dim">
            Waiting for attacks…
          </div>
        )}
        {events.map((e) => (
          <div
            key={e.id}
            className="grid grid-cols-[64px_1fr_110px] items-center gap-2 border-b border-white/5 px-4 py-2 last:border-0 hover:bg-white/5"
          >
            <span className="font-mono text-[10px] text-threat-dim">
              {new Date(e.time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>

            <div className="min-w-0">
              <div className="flex items-center gap-1 text-xs">
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
              className="truncate text-right text-[10px] font-medium"
              style={{ color: TYPE_COLOR[e.attackType] ?? '#7c8aa5' }}
            >
              {e.attackType}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
