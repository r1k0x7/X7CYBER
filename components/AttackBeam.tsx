'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { latLngToVector3, buildArc } from '@/lib/geo';
import { GLOBE_RADIUS } from './Globe';
import type { AttackEvent } from '@/lib/types';

const SOURCE_COLOR = new THREE.Color('#ff3b4e');
const TARGET_COLOR = new THREE.Color('#3aa0ff');
const DURATION = 2.2; // seconds for beam to travel the arc

interface Props {
  event: AttackEvent;
  paused: boolean;
  onDone: (id: string) => void;
}

export default function AttackBeam({ event, paused, onDone }: Props) {
  const progress = useRef(0);
  const lineRef = useRef<THREE.Line>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const [landed, setLanded] = useState(false);

  const { points, source, target } = useMemo(() => {
    const s = latLngToVector3(event.sourceLat, event.sourceLng, GLOBE_RADIUS);
    const t = latLngToVector3(event.targetLat, event.targetLng, GLOBE_RADIUS);
    return { points: buildArc(s, t, GLOBE_RADIUS), source: s, target: t };
  }, [event]);

  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(points),
    [points]
  );

  useFrame((_, delta) => {
    if (paused) return;
    progress.current += delta / DURATION;
    const p = Math.min(progress.current, 1);

    // Reveal the arc gradually as the beam travels.
    const drawCount = Math.floor(p * points.length);
    geometry.setDrawRange(0, Math.max(2, drawCount));

    if (headRef.current && drawCount > 0) {
      const head = points[Math.min(drawCount, points.length - 1)];
      headRef.current.position.copy(head);
    }

    if (p >= 1 && !landed) setLanded(true);

    if (landed && pulseRef.current) {
      const scale = 1 + (progress.current - 1) * 4;
      pulseRef.current.scale.setScalar(scale);
      const mat = pulseRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.8 - (progress.current - 1) * 1.6);
      if (progress.current - 1 > 0.6) onDone(event.id);
    }
  });

  return (
    <group>
      {/* glowing beam line */}
      <primitive
        object={
          new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({
              color: TARGET_COLOR,
              transparent: true,
              opacity: 0.9,
            })
          )
        }
        ref={lineRef}
      />
      {/* source point */}
      <mesh position={source}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color={SOURCE_COLOR} />
      </mesh>
      {/* travelling head */}
      <mesh ref={headRef}>
        <sphereGeometry args={[0.025, 10, 10]} />
        <meshBasicMaterial color={'#ffffff'} />
      </mesh>
      {/* target point */}
      <mesh position={target}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color={TARGET_COLOR} />
      </mesh>
      {/* pulse ripple at target */}
      {landed && (
        <mesh ref={pulseRef} position={target}>
          <ringGeometry args={[0.04, 0.06, 24]} />
          <meshBasicMaterial
            color={TARGET_COLOR}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
