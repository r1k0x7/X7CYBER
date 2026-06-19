'use client';

import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export const GLOBE_RADIUS = 2;

// Public-domain NASA night-lights Earth texture (Black Marble style).
const NIGHT_TEXTURE =
  'https://unpkg.com/three-globe@2.31.0/example/img/earth-night.jpg';

export default function Globe({ autoRotate }: { autoRotate: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, NIGHT_TEXTURE);

  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      {/* Main directional light untuk terangin bumi */}
      <directionalLight
        position={[3, 2, 5]}
        intensity={1.8}
        color={0xffffff}
        castShadow
      />

      {/* Hemisphere light untuk ambient lighting */}
      <hemisphereLight
        args={[0x4a9eff, 0x1a3a52, 1.2]}
      />

      {/* Fill light untuk mengurangi shadow */}
      <directionalLight
        position={[-3, 1, -5]}
        intensity={0.8}
        color={0x7fb3d5}
      />

      {/* Point light di depan untuk highlight */}
      <pointLight
        position={[2, 1, 3]}
        intensity={0.6}
        color={0xffffff}
      />

      <mesh ref={meshRef}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshPhongMaterial
          map={texture}
          emissiveMap={texture}
          emissive={new THREE.Color(0xa8c5e0)}
          emissiveIntensity={2.0}
          color={new THREE.Color(0x8fa8c5)}
          shininess={32}
          specularMap={texture}
          specular={new THREE.Color(0x5a7a9a)}
        />
      </mesh>
      <Atmosphere />
    </group>
  );
}

// Soft glowing atmosphere rendered as a back-side shader shell.
function Atmosphere() {
  return (
    <mesh scale={1.18}>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        uniforms={{ glowColor: { value: new THREE.Color(0x4ab5ff) } }}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          uniform vec3 glowColor;
          void main() {
            float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
            gl_FragColor = vec4(glowColor, 1.2) * intensity;
          }
        `}
      />
    </mesh>
  );
}
