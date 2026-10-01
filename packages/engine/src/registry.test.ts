import { describe, expect, it } from "vitest";
import { defineEffect, type EffectDef } from "./effect";
import { createEffectRegistry } from "./registry";

const base = defineEffect({
  id: "tone.threshold",
  name: "effects.threshold",
  category: "tone",
  tier: "free",
  cost: 0,
  params: { level: { type: "number", label: "level", min: 0, max: 1, step: 0.01, default: 0.5 } },
  impl: { kind: "glsl", frag: "void main(){}" },
  quality: { preview: { maxEdge: 2048 }, export: { maxEdge: 8192 } },
}) as EffectDef;

describe("effect registry", () => {
  it("registers, gets, and lists by category", () => {
    const reg = createEffectRegistry();
    reg.register(base);
    reg.register({ ...base, id: "glitch.rgb-shift", category: "glitch", tier: "pro", cost: 2 });
    expect(reg.has("tone.threshold")).toBe(true);
    expect(reg.get("glitch.rgb-shift")?.cost).toBe(2);
    expect(reg.list().map((e) => e.id)).toEqual(["tone.threshold", "glitch.rgb-shift"]);
    expect(reg.list("glitch")).toHaveLength(1);
  });

  it("rejects bad ids, duplicates, and inconsistent pricing", () => {
    const reg = createEffectRegistry();
    reg.register(base);
    expect(() => reg.register(base)).toThrow(/already/);
    expect(() => reg.register({ ...base, id: "Threshold" })).toThrow(/family/);
    expect(() => reg.register({ ...base, id: "tone.a", cost: 1 })).toThrow(/free/);
    expect(() => reg.register({ ...base, id: "tone.b", tier: "pro", cost: 0 })).toThrow(/1\.\.10/);
    expect(() => reg.register({ ...base, id: "tone.c", tier: "pro", cost: 11 })).toThrow(/1\.\.10/);
    expect(() =>
      reg.register({
        ...base,
        id: "tone.d",
        params: { x: { type: "number", label: "x", min: 1, max: 0, step: 1, default: 0 } },
      }),
    ).toThrow(/min/);
  });
});
