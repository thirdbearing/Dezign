import { describe, expect, it } from "vitest";
import { createRng, hashString } from "./rng";

describe("createRng", () => {
  it("is deterministic for the same seed", () => {
    const a = createRng(42);
    const b = createRng(42);
    const seqA = Array.from({ length: 50 }, () => a.next());
    const seqB = Array.from({ length: 50 }, () => b.next());
    expect(seqA).toEqual(seqB);
  });

  it("differs across seeds and accepts string seeds", () => {
    expect(createRng(1).next()).not.toBe(createRng(2).next());
    expect(createRng("poster").next()).toBe(createRng("poster").next());
  });

  it("stays in range", () => {
    const rng = createRng(7);
    for (let i = 0; i < 2000; i++) {
      const f = rng.next();
      expect(f).toBeGreaterThanOrEqual(0);
      expect(f).toBeLessThan(1);
      const r = rng.range(-5, 5);
      expect(r).toBeGreaterThanOrEqual(-5);
      expect(r).toBeLessThan(5);
      const n = rng.int(1, 6);
      expect(Number.isInteger(n) && n >= 1 && n <= 6).toBe(true);
    }
  });

  it("covers every int in a small range", () => {
    const rng = createRng(3);
    const seen = new Set<number>();
    for (let i = 0; i < 500; i++) seen.add(rng.int(0, 4));
    expect([...seen].sort()).toEqual([0, 1, 2, 3, 4]);
  });

  it("forks independent, reproducible streams", () => {
    const root = createRng(99);
    const a1 = root.fork("halftone").next();
    root.next(); // draws on the parent must not shift the child
    const a2 = createRng(99).fork("halftone").next();
    expect(a1).toBe(a2);
    expect(createRng(99).fork("dither").next()).not.toBe(a1);
  });

  it("validates arguments", () => {
    const rng = createRng(1);
    expect(() => rng.int(5, 1)).toThrow(RangeError);
    expect(() => rng.pick([])).toThrow(RangeError);
    expect(rng.pick(["only"])).toBe("only");
  });
});

describe("hashString", () => {
  it("matches FNV-1a reference values", () => {
    expect(hashString("")).toBe(0x811c9dc5);
    expect(hashString("a")).toBe(0xe40c292c);
  });
});
