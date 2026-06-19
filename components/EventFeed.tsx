'use client';

import { useState } from 'react';
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
  // Expanded by default so the attack log is visible; users can collapse it
  // on mobile if it overlaps the map.
  const [open, setOpen] = useState(true);

  return (
    <div className="pointer-events-auto absolute bottom-3 left-3 z-10 flex max-h-[38vh] w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-xl border border-threat-border bg-threat-panel shadow-2xl shadow-black/40 backdrop-blur-md sm:bottom-4 sm:left-4 sm:max-h-[60vh] sm:w-[27rem]">
      {/* header (acts as toggle on mobile) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)
        }
        className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3 text-left sm:cursor-default"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-threat-source opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-threat-source" />
          </span>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-threat-text">
            Live Attack Report
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 font-mono text-[10px] text-threat-dim">
            {events.length}
          </span>
          {/* chevron only matters on mobile */}
          <span
            className={`text-threat-dim transition-transform sm:hidden ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden
          >
            ▲
          </span>
        </div>
      </button>

      {/* body: hidden when collapsed on mobile, always shown on desktop */}
      <div className={`${open ? 'flex' : 'hidden'} min-h-0 flex-1 flex-col sm:flex`}>
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
                  <span className="truncate">
                    {e.attackType.replace(' Attackers', '')}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
