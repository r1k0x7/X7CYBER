'use client';

interface Props {
  totalEvents: number;
  sourceCountries: number;
  targetCountries: number;
}

export default function Counters({
  totalEvents,
  sourceCountries,
  targetCountries,
}: Props) {
  return (
    <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-10 rounded-md border border-threat-border bg-threat-panel px-8 py-3 backdrop-blur-md">
      <Counter label="Total Events" value={totalEvents} />
      <Counter label="Source Countries" value={sourceCountries} />
      <Counter label="Target Countries" value={targetCountries} />
    </div>
  );
}

function Counter({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="font-mono text-2xl font-semibold text-white">
        {value.toLocaleString()}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-threat-dim">
        {label}
      </div>
    </div>
  );
}
