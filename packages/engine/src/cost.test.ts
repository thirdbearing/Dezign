import { describe, expect, it } from "vitest";
import { DEFAULT_COST_TABLE, collectFeatures, computeExportCost, type CostTable } from "./cost";
import { fx, imageLayer, layerBase, makeDoc } from "./doc/fixtures";
import type { Layer } from "./doc/schema";

const table: CostTable = {
  ...DEFAULT_COST_TABLE,
  features: { "glitch.pixel-sort": 3, "stylize.ascii": 2, "layer.render3d": 5, "pro.big": 9 },
};

const render3d = (id: string, visible = true): Layer => ({
  ...layerBase,
  id,
  visible,
  type: "render3d",
  sceneId: "s",
  width: 512,
  height: 512,
  bake: null,
});

describe("collectFeatures", () => {
  it("counts enabled effects on visible layers, recursing into groups", () => {
    const layers: Layer[] = [
      imageLayer("a", [fx("glitch.pixel-sort"), fx("stylize.ascii", false)]),
      { ...imageLayer("hidden", [fx("pro.big")]), visible: false },
      { ...layerBase, id: "g", type: "group", children: [render3d("r"), render3d("r2", false)] },
    ];
    expect([...collectFeatures(layers)].sort()).toEqual(["glitch.pixel-sort", "layer.render3d"]);
  });
});

describe("computeExportCost", () => {
  it("is free for free effects at standard size", () => {
    const cost = computeExportCost(
      makeDoc([imageLayer("a", [fx("tone.threshold")])]),
      { format: "png", scale: 1 },
      table,
    );
    expect(cost).toMatchObject({
      base: 0,
      resolutionAddon: 0,
      formatAddon: 0,
      total: 0,
      lines: [],
    });
  });

  it("charges each pro feature once, however many layers use it", () => {
    const doc = makeDoc([
      imageLayer("a", [fx("glitch.pixel-sort")]),
      imageLayer("b", [fx("glitch.pixel-sort"), fx("stylize.ascii")]),
    ]);
    const cost = computeExportCost(doc, { format: "png", scale: 1 }, table);
    expect(cost.lines).toEqual([
      { featureId: "glitch.pixel-sort", cost: 3 },
      { featureId: "stylize.ascii", cost: 2 },
    ]);
    expect(cost.total).toBe(5);
  });

  it("caps the base at 10 and adds resolution and format add-ons on top", () => {
    const doc = makeDoc([imageLayer("a", [fx("pro.big"), fx("glitch.pixel-sort")]), render3d("r")]);
    expect(computeExportCost(doc, { format: "png", scale: 1 }, table).base).toBe(10);
    // 1350 * 2 = 2700 -> HD tier
    const hd = computeExportCost(doc, { format: "svg", scale: 2 }, table);
    expect(hd).toMatchObject({
      base: 10,
      resolutionAddon: 2,
      formatAddon: 3,
      total: 15,
      outputLongEdge: 2700,
    });
    // 1350 * 4 = 5400 -> UHD tier
    expect(computeExportCost(doc, { format: "pdf", scale: 4 }, table).resolutionAddon).toBe(4);
  });

  it("treats exactly 2048 as standard and rejects bad scales", () => {
    const doc = makeDoc([], { width: 2048, height: 1024 });
    expect(computeExportCost(doc, { format: "jpg", scale: 1 }, table).resolutionAddon).toBe(0);
    expect(() => computeExportCost(doc, { format: "jpg", scale: 0 }, table)).toThrow(RangeError);
    expect(() =>
      computeExportCost(doc, { format: "jpg", scale: Number.POSITIVE_INFINITY }, table),
    ).toThrow(RangeError);
  });

  it("uses the default table when none is given", () => {
    expect(computeExportCost(makeDoc([render3d("r")]), { format: "glb", scale: 1 }).total).toBe(7);
  });
});
