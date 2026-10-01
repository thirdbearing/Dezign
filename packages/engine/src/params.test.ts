import { describe, expect, it } from "vitest";
import { assertValidSchema, defaultParams, sanitizeParams, type ParamSchema } from "./params";

const schema = {
  size: { type: "number", label: "size", min: 1, max: 50, step: 0.5, default: 8, unit: "px" },
  invert: { type: "boolean", label: "invert", default: false },
  grid: {
    type: "select",
    label: "grid",
    options: [
      { value: "square", label: "square" },
      { value: "hex", label: "hex" },
    ],
    default: "square",
  },
  ink: { type: "color", label: "ink", default: "#ff48b0" },
} satisfies ParamSchema;

describe("params", () => {
  it("builds defaults", () => {
    expect(defaultParams(schema)).toEqual({
      size: 8,
      invert: false,
      grid: "square",
      ink: "#ff48b0",
    });
  });

  it("clamps, snaps, and falls back on invalid input", () => {
    expect(
      sanitizeParams(schema, { size: 999, invert: "yes", grid: "triangle", ink: "red", extra: 1 }),
    ).toEqual({ size: 50, invert: false, grid: "square", ink: "#ff48b0" });
    expect(sanitizeParams(schema, { size: 3.3, grid: "hex", ink: "#00AA11" })).toMatchObject({
      size: 3.5,
      grid: "hex",
      ink: "#00aa11",
    });
    expect(sanitizeParams(schema, { size: Number.NaN }).size).toBe(8);
    expect(sanitizeParams(schema, null)).toEqual(defaultParams(schema));
  });

  it("rejects inconsistent schemas", () => {
    const bad = (s: ParamSchema) => () => assertValidSchema(s, "fx");
    expect(bad({ a: { type: "number", label: "a", min: 5, max: 1, step: 1, default: 2 } })).toThrow(
      /min/,
    );
    expect(bad({ a: { type: "number", label: "a", min: 0, max: 1, step: 0, default: 0 } })).toThrow(
      /step/,
    );
    expect(bad({ a: { type: "number", label: "a", min: 0, max: 1, step: 1, default: 3 } })).toThrow(
      /default/,
    );
    expect(bad({ a: { type: "select", label: "a", options: [], default: "x" } })).toThrow(
      /options/,
    );
    expect(bad({ a: { type: "color", label: "a", default: "pink" } })).toThrow(/rrggbb/);
    expect(bad(schema)).not.toThrow();
  });
});
