'use client';

import type { AttackEvent } from '@/lib/types';

export default function EventFeed({ events }: { events: AttackEvent[] }) {
  return (
    <div className="panel-scroll pointer-events-auto absolute bottom-4 left-4 z-10 max-h-64 w-72 overflow-hidden rounded-md border border-threat-border bg-threat-panel p-3 backdrop-blur-md">
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-threat-dim">
        Latest Events
      </h2>
      <div className="flex flex-col gap-2">
        {events.map((e) => (
          <div key={e.id} className="border-b border-white/5 pb-2 last:border-0">
            <div className="font-mono text-[10px] text-threat-dim">
              {new Date(e.time).toLocaleTimeString()}
            </div>
            <div className="text-xs text-threat-text">
              <span className="text-threat-source">{e.sourceCountry}</span>
              <span className="mx-1 text-threat-dim">&rarr;</span>
              <span className="text-threat-target">{e.targetCountry}</span>
            </div>
            <div className="text-[10px] text-threat-dim">{e.attackType}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
