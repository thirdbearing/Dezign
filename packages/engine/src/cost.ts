import type { Doc, Layer } from "./doc/schema";

/**
 * Export pricing. This runs on the server to decide what to charge; the client runs the same
 * function only to show the price before the user confirms. Numbers come from the catalog the
 * caller passes in (the server's effect_catalog table), never from the client.
 */

export type ExportFormat = "png" | "jpg" | "webp" | "svg" | "pdf" | "glb" | "gif" | "mp4";

export interface ExportSettings {
  format: ExportFormat;
  /** Multiplier on the artboard size; the output's longest edge decides the resolution tier. */
  scale: number;
}

export interface CostTable {
  /** Cost per pro feature id (effect ids, plus "layer.render3d"). Free features are absent or 0. */
  features: Readonly<Record<string, number>>;
  /** Longest output edge, in pixels, included in the base price. */
  standardMaxEdge: number;
  /** Extra cost when the longest edge is above standardMaxEdge / above hdMaxEdge. */
  hdAddon: number;
  hdMaxEdge: number;
  uhdAddon: number;
  formatAddons: Readonly<Partial<Record<ExportFormat, number>>>;
  /** Cap on the summed feature cost; add-ons are charged on top. */
  baseCap: number;
}

/** Placeholder values from docs/PLAN.md §2.2; final prices are decided at the end of the project. */
export const DEFAULT_COST_TABLE: CostTable = {
  features: { "layer.render3d": 5 },
  standardMaxEdge: 2048,
  hdAddon: 2,
  hdMaxEdge: 4096,
  uhdAddon: 4,
  formatAddons: { svg: 3, pdf: 3, glb: 2, gif: 3, mp4: 3 },
  baseCap: 10,
};

export interface CostLine {
  featureId: string;
  cost: number;
}

export interface ExportCost {
  lines: CostLine[];
  base: number;
  resolutionAddon: number;
  formatAddon: number;
  total: number;
  outputLongEdge: number;
}

/** Feature ids that affect the rendered output: enabled effects on visible layers, and 3D layers. */
export function collectFeatures(layers: readonly Layer[], into = new Set<string>()): Set<string> {
  for (const layer of layers) {
    if (!layer.visible) continue;
    for (const effect of layer.effects) if (effect.enabled) into.add(effect.effectId);
    if (layer.type === "render3d") into.add("layer.render3d");
    if (layer.type === "group") collectFeatures(layer.children, into);
  }
  return into;
}

export function computeExportCost(
  doc: Doc,
  settings: ExportSettings,
  table: CostTable = DEFAULT_COST_TABLE,
): ExportCost {
  if (!(settings.scale > 0) || !Number.isFinite(settings.scale))
    throw new RangeError("Export scale must be a positive number");

  // Sorted so the breakdown (and anything hashed from it) is stable.
  const lines = [...collectFeatures(doc.layers)]
    .sort()
    .map((featureId) => ({ featureId, cost: table.features[featureId] ?? 0 }))
    .filter((line) => line.cost > 0);

  const base = Math.min(
    table.baseCap,
    lines.reduce((sum, line) => sum + line.cost, 0),
  );

  const outputLongEdge = Math.round(
    Math.max(doc.artboard.width, doc.artboard.height) * settings.scale,
  );
  const resolutionAddon =
    outputLongEdge <= table.standardMaxEdge
      ? 0
      : outputLongEdge <= table.hdMaxEdge
        ? table.hdAddon
        : table.uhdAddon;

  const formatAddon = table.formatAddons[settings.format] ?? 0;

  return {
    lines,
    base,
    resolutionAddon,
    formatAddon,
    total: base + resolutionAddon + formatAddon,
    outputLongEdge,
  };
}
