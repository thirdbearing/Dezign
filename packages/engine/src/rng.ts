/**
 * Seeded pseudo-random numbers. Every random choice in a render comes from here so the same
 * document renders identically in the browser and on the render worker.
 */

export interface Rng {
  /** Uniform float in [0, 1). */
  next(): number;
  /** Uniform float in [min, max). */
  range(min: number, max: number): number;
  /** Uniform integer in [min, max] (inclusive). */
  int(min: number, max: number): number;
  /** One element of a non-empty array. */
  pick<T>(items: readonly T[]): T;
  /** Independent child stream, so adding draws in one place does not shift another. */
  fork(label: string): Rng;
}

/** 32-bit FNV-1a hash, used to turn labels and strings into seeds. */
export function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** sfc32: small, fast, and good enough for graphics; state is four 32-bit words. */
function sfc32(a: number, b: number, c: number, d: number): () => number {
  return () => {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

export function createRng(seed: number | string): Rng {
  const base = typeof seed === "string" ? hashString(seed) : seed >>> 0;
  const raw = sfc32(0x9e3779b9, 0x243f6a88, 0xb7e15162, base);
  // Discard the first outputs: sfc32 needs a few rounds to mix a low-entropy seed.
  for (let i = 0; i < 12; i++) raw();

  const rng: Rng = {
    next: raw,
    range: (min, max) => min + raw() * (max - min),
    int: (min, max) => {
      if (max < min) throw new RangeError(`int(${min}, ${max}): max is below min`);
      return min + Math.floor(raw() * (max - min + 1));
    },
    pick: (items) => {
      if (items.length === 0) throw new RangeError("pick() needs a non-empty array");
      return items[Math.floor(raw() * items.length)] as (typeof items)[number];
    },
    fork: (label) => createRng((base ^ hashString(label)) >>> 0),
  };
  return rng;
}
