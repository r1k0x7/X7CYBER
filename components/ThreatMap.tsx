'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Globe from './Globe';
import Starfield from './Starfield';
import AttackBeam from './AttackBeam';
import EventFeed from './EventFeed';
import { useAttackStream } from '@/lib/useAttackStream';
import type { AttackEvent } from '@/lib/types';

const MAX_FEED = 18;
const MAX_BEAMS = 40;

export default function ThreatMap() {
  const [beams, setBeams] = useState<AttackEvent[]>([]);
  const [feed, setFeed] = useState<AttackEvent[]>([]);

  const latest = useAttackStream(false);

  useEffect(() => {
    if (!latest) return;

    setBeams((prev) => [...prev.slice(-(MAX_BEAMS - 1)), latest]);
    setFeed((prev) => [latest, ...prev].slice(0, MAX_FEED));
  }, [latest]);

  const removeBeam = useCallback((id: string) => {
    setBeams((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const beamEls = useMemo(
    () =>
      beams.map((e) => (
        <AttackBeam key={e.id} event={e} paused={false} onDone={removeBeam} />
      )),
    [beams, removeBeam]
  );

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.6} />
        <directionalLight position={[5, 3, 5]} intensity={2.0} />
        <directionalLight position={[-5, -2, -3]} intensity={0.9} />
        <Suspense fallback={null}>
          <Starfield />
          <Globe autoRotate={false} />
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
        <EventFeed events={feed} />
      </div>
    </div>
  );
}
