'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { latLngToVector3, buildArc } from '@/lib/geo';
import { GLOBE_RADIUS } from './Globe';
import type { AttackEvent } from '@/lib/types';

const SOURCE_COLOR = new THREE.Color('#ff3b4e');
const TARGET_COLOR = new THREE.Color('#3aa0ff');
const HEAD_COLOR = new THREE.Color('#eaf4ff');
const DURATION = 2.0; // seconds for beam to travel the arc

interface Props {
  event: AttackEvent;
  paused: boolean;
  onDone: (id: string) => void;
}

export default function AttackBeam({ event, paused, onDone }: Props) {
  const progress = useRef(0);
  const tubeRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const [landed, setLanded] = useState(false);

  // Build the arc curve, source/target, and a tube geometry once per event.
  const { curve, source, target, tubeGeometry } = useMemo(() => {
    const s = latLngToVector3(event.sourceLat, event.sourceLng, GLOBE_RADIUS);
    const t = latLngToVector3(event.targetLat, event.targetLng, GLOBE_RADIUS);
    const pts = buildArc(s, t, GLOBE_RADIUS, 64);
    const c = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(c, 64, 0.012, 8, false);
    geo.setDrawRange(0, 0); // hidden initially; revealed as beam travels
    return { curve: c, source: s, target: t, tubeGeometry: geo };
  }, [event]);

  useFrame((_, delta) => {
    if (paused) return;
    progress.current += delta / DURATION;
    const p = Math.min(progress.current, 1);

    const totalIndex = tubeGeometry.index ? tubeGeometry.index.count : 0;
    tubeGeometry.setDrawRange(0, Math.floor(p * totalIndex));

    if (headRef.current) {
      headRef.current.position.copy(curve.getPoint(p));
      headRef.current.visible = p < 1;
    }

    if (p >= 1 && !landed) setLanded(true);

    if (landed && pulseRef.current) {
      const after = progress.current - 1;
      pulseRef.current.scale.setScalar(1 + after * 5);
      const mat = pulseRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.9 - after * 1.6);
      if (after > 0.7) onDone(event.id);
    }
  });

  return (
    <group>
      {/* glowing beam tube */}
      <mesh ref={tubeRef} geometry={tubeGeometry}>
        <meshBasicMaterial
          color={TARGET_COLOR}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* source point */}
      <mesh position={source}>
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshBasicMaterial color={SOURCE_COLOR} />
      </mesh>

      {/* travelling head */}
      <mesh ref={headRef}>
        <sphereGeometry args={[0.028, 10, 10]} />
        <meshBasicMaterial color={HEAD_COLOR} />
      </mesh>

      {/* target point */}
      <mesh position={target}>
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshBasicMaterial color={TARGET_COLOR} />
      </mesh>

      {/* pulse ripple at target */}
      {landed && (
        <mesh ref={pulseRef} position={target}>
          <ringGeometry args={[0.045, 0.07, 24]} />
          <meshBasicMaterial
            color={TARGET_COLOR}
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
