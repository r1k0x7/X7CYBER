import * as THREE from 'three';

// Convert latitude/longitude to a 3D position on a sphere of given radius.
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Build a curved arc (quadratic bezier) between two surface points.
// The control point is lifted above the surface so the beam bows outward.
export function buildArc(
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  segments = 64
): THREE.Vector3[] {
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const distance = start.distanceTo(end);
  const lift = radius + distance * 0.45;
  mid.normalize().multiplyScalar(lift);

  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  return curve.getPoints(segments);
}
