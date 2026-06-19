'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Globe from './Globe';
import Starfield from './Starfield';
import AttackBeam from './AttackBeam';
import LeftPanel from './LeftPanel';
import Counters from './Counters';
import EventFeed from './EventFeed';
import { useAttackSocket } from '@/lib/useAttackSocket';
import type { AttackEvent, AttackType, Interval } from '@/lib/types';
import { ATTACK_TYPES } from '@/lib/types';

const MAX_FEED = 18;
const MAX_BEAMS = 40;

export default function ThreatMap() {
  const [paused, setPaused] = useState(false);
  const [interval, setInterval] = useState<Interval>('1h');
  const [active, setActive] = useState<Set<AttackType>>(
    () => new Set(ATTACK_TYPES)
  );

  const [beams, setBeams] = useState<AttackEvent[]>([]);
  const [feed, setFeed] = useState<AttackEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [sources, setSources] = useState<Set<string>>(new Set());
  const [targets, setTargets] = useState<Set<string>>(new Set());

  const latest = useAttackSocket(paused);

  useEffect(() => {
    if (!latest) return;
    if (!active.has(latest.attackType)) return;

    setBeams((prev) => [...prev.slice(-(MAX_BEAMS - 1)), latest]);
    setFeed((prev) => [latest, ...prev].slice(0, MAX_FEED));
    setTotal((t) => t + 1);
    setSources((prev) => {
      const next = new Set(prev);
      next.add(latest.sourceCode);
      return next;
    });
    setTargets((prev) => {
      const next = new Set(prev);
      next.add(latest.targetCode);
      return next;
    });
  }, [latest, active]);

  const removeBeam = useCallback((id: string) => {
    setBeams((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const toggleType = useCallback((t: AttackType) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }, []);

  const beamEls = useMemo(
    () =>
      beams.map((e) => (
        <AttackBeam key={e.id} event={e} paused={paused} onDone={removeBeam} />
      )),
    [beams, paused, removeBeam]
  );

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <Starfield />
          <Globe autoRotate={!paused} />
          {beamEls}
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={3}
          maxDistance={12}
          rotateSpeed={0.6}
          zoomSpeed={0.8}
          autoRotate={false}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-0">
        <LeftPanel
          interval={interval}
          onInterval={setInterval}
          active={active}
          onToggle={toggleType}
          paused={paused}
          onPauseToggle={() => setPaused((p) => !p)}
        />
        <EventFeed events={feed} />
        <Counters
          totalEvents={total}
          sourceCountries={sources.size}
          targetCountries={targets.size}
        />
      </div>
    </div>
  );
}
