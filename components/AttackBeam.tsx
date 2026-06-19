'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { latLngToVector3, buildArc } from '@/lib/geo';
import { GLOBE_RADIUS } from './Globe';
import type { AttackEvent } from '@/lib/types';

const SOURCE_COLOR = new THREE.Color('#ff3b4e');
const TARGET_COLOR = new THREE.Color('#3aa0ff');
const HEAD_COLOR = new THREE.Color('#ffffff');
const DURATION = 1.9; // seconds for beam to travel the arc

interface Props {
  event: AttackEvent;
  paused: boolean;
  onDone: (id: string) => void;
}

export default function AttackBeam({ event, paused, onDone }: Props) {
  const progress = useRef(0);
  const tubeRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);
  const sourceRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const pulse2Ref = useRef<THREE.Mesh>(null);
  const [landed, setLanded] = useState(false);

  // Build arc curve, endpoints, a vertex-colored core tube and a wider glow tube.
  const { curve, source, target, coreGeometry, glowGeometry } = useMemo(() => {
    const s = latLngToVector3(event.sourceLat, event.sourceLng, GLOBE_RADIUS);
    const t = latLngToVector3(event.targetLat, event.targetLng, GLOBE_RADIUS);
    const pts = buildArc(s, t, GLOBE_RADIUS, 80);
    const c = new THREE.CatmullRomCurve3(pts);

    const core = new THREE.TubeGeometry(c, 80, 0.011, 8, false);
    applyGradient(core, SOURCE_COLOR, TARGET_COLOR);
    core.setDrawRange(0, 0);

    const glow = new THREE.TubeGeometry(c, 80, 0.03, 8, false);
    applyGradient(glow, SOURCE_COLOR, TARGET_COLOR);
    glow.setDrawRange(0, 0);

    return { curve: c, source: s, target: t, coreGeometry: core, glowGeometry: glow };
  }, [event]);

  useFrame((state, delta) => {
    if (paused) return;
    progress.current += delta / DURATION;
    const p = Math.min(progress.current, 1);
    const eased = 1 - Math.pow(1 - p, 2); // ease-out

    const coreIdx = coreGeometry.index ? coreGeometry.index.count : 0;
    const glowIdx = glowGeometry.index ? glowGeometry.index.count : 0;
    coreGeometry.setDrawRange(0, Math.floor(eased * coreIdx));
    glowGeometry.setDrawRange(0, Math.floor(eased * glowIdx));

    // Pulsing source node.
    if (sourceRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.25;
      sourceRef.current.scale.setScalar(s);
    }

    if (headRef.current) {
      headRef.current.position.copy(curve.getPoint(eased));
      headRef.current.visible = p < 1;
      const hs = 1 + Math.sin(state.clock.elapsedTime * 12) * 0.3;
      headRef.current.scale.setScalar(hs);
    }

    if (p >= 1 && !landed) setLanded(true);

    if (landed) {
      const after = progress.current - 1;
      if (pulseRef.current) {
        pulseRef.current.scale.setScalar(1 + after * 6);
        (pulseRef.current.material as THREE.MeshBasicMaterial).opacity =
          Math.max(0, 0.9 - after * 1.5);
      }
      if (pulse2Ref.current) {
        pulse2Ref.current.scale.setScalar(1 + after * 3.5);
        (pulse2Ref.current.material as THREE.MeshBasicMaterial).opacity =
          Math.max(0, 0.7 - after * 1.1);
      }
      if (after > 0.85) onDone(event.id);
    }
  });

  return (
    <group>
      {/* wide soft glow */}
      <mesh ref={glowRef} geometry={glowGeometry}>
        <meshBasicMaterial
          vertexColors
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* bright core */}
      <mesh ref={tubeRef} geometry={coreGeometry}>
        <meshBasicMaterial
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* source node + halo */}
      <mesh ref={sourceRef} position={source}>
        <sphereGeometry args={[0.03, 14, 14]} />
        <meshBasicMaterial color={SOURCE_COLOR} />
      </mesh>
      <mesh position={source}>
        <sphereGeometry args={[0.055, 14, 14]} />
        <meshBasicMaterial
          color={SOURCE_COLOR}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* travelling head with halo */}
      <group ref={headRef}>
        <mesh>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshBasicMaterial color={HEAD_COLOR} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial
            color={TARGET_COLOR}
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* target node */}
      <mesh position={target}>
        <sphereGeometry args={[0.03, 14, 14]} />
        <meshBasicMaterial color={TARGET_COLOR} />
      </mesh>

      {/* pulse ripples at target */}
      {landed && (
        <group position={target}>
          <mesh ref={pulseRef} quaternion={ringQuaternion(target)}>
            <ringGeometry args={[0.045, 0.065, 32]} />
            <meshBasicMaterial
              color={TARGET_COLOR}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh ref={pulse2Ref} quaternion={ringQuaternion(target)}>
            <ringGeometry args={[0.03, 0.05, 32]} />
            <meshBasicMaterial
              color={'#ffffff'}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Color the tube vertices from source color at the start to target color at the end.
function applyGradient(
  geo: THREE.TubeGeometry,
  from: THREE.Color,
  to: THREE.Color
) {
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  // TubeGeometry positions are ordered ring by ring along the path.
  const rings = (geo.parameters.tubularSegments ?? 80) + 1;
  const radial = (geo.parameters.radialSegments ?? 8) + 1;
  const tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i += 1) {
    const ring = Math.floor(i / radial);
    const f = ring / (rings - 1);
    tmp.copy(from).lerp(to, f);
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}

// Orient the pulse rings flat against the globe surface at the given point.
function ringQuaternion(point: THREE.Vector3): THREE.Quaternion {
  const normal = point.clone().normalize();
  return new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    normal
  );
}
