import { describe, expect, it } from "vitest";
import { canonicalJson, hashCanonical, sha256Hex } from "./hash";

describe("canonicalJson", () => {
  it("is independent of key order and drops undefined", () => {
    expect(canonicalJson({ b: 1, a: { d: [1, 2], c: "x" }, u: undefined })).toBe(
      '{"a":{"c":"x","d":[1,2]},"b":1}',
    );
    expect(canonicalJson({ a: 1, b: 2 })).toBe(canonicalJson({ b: 2, a: 1 }));
    expect(canonicalJson([undefined, null, true, -0])).toBe("[null,null,true,0]");
  });

  it("rejects values that cannot round-trip", () => {
    expect(() => canonicalJson(Number.NaN)).toThrow(/non-finite/);
    expect(() => canonicalJson({ f: () => 1 })).toThrow(/unsupported/);
    const loop: Record<string, unknown> = {};
    loop.self = loop;
    expect(() => canonicalJson(loop)).toThrow(/circular/);
  });

  it("allows the same object twice when it is not a cycle", () => {
    const shared = { k: 1 };
    expect(canonicalJson({ a: shared, b: shared })).toBe('{"a":{"k":1},"b":{"k":1}}');
  });
});

describe("sha256", () => {
  it("matches the known digest of 'abc'", async () => {
    expect(await sha256Hex("abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });

  it("hashes equal documents equally", async () => {
    expect(await hashCanonical({ x: 1, y: [2] })).toBe(await hashCanonical({ y: [2], x: 1 }));
  });
});
