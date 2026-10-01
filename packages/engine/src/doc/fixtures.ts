import type { Doc, Layer } from "./schema";

const base = {
  name: "layer",
  visible: true,
  locked: false,
  opacity: 1,
  blend: "normal" as const,
  transform: { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 },
  effects: [],
};

export function imageLayer(id: string, effects: Layer["effects"] = []): Layer {
  return { ...base, id, type: "image", assetId: "img1", width: 800, height: 600, effects };
}

export function fx(effectId: string, enabled = true) {
  return { id: `fx-${effectId.replace(/\W/g, "-")}`, effectId, enabled, params: {} };
}

export function makeDoc(layers: Layer[], size = { width: 1080, height: 1350 }): Doc {
  return {
    version: 1,
    id: "doc1",
    title: "Poster",
    seed: 12345,
    artboard: { ...size, background: "#ffffff" },
    layers,
    assets: {},
  };
}

export { base as layerBase };
