import ThreatMap from '@/components/ThreatMap';

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-threat-bg">
      <ThreatMap />
    </main>
  );
}
