import { COUNTRIES, ATTACK_TYPES } from './countries.data';
import type { AttackEvent, AttackType } from './types';

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate a single randomized simulated attack event.
export function makeEvent(): AttackEvent {
  const source = pick(COUNTRIES);
  let target = pick(COUNTRIES);
  let guard = 0;
  while (target.code === source.code && guard < 5) {
    target = pick(COUNTRIES);
    guard += 1;
  }

  // Generate random threat level (1-5)
  const threatLevel = Math.floor(Math.random() * 5) + 1;

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    time: new Date().toISOString(),
    sourceCountry: source.name,
    sourceCode: source.code,
    sourceLat: source.lat,
    sourceLng: source.lng,
    targetCountry: target.name,
    targetCode: target.code,
    targetLat: target.lat,
    targetLng: target.lng,
    attackType: pick(ATTACK_TYPES) as AttackType,
    threatLevel: threatLevel as 1 | 2 | 3 | 4 | 5,
  };
}
