import { describe, expect, it } from "vitest";
import { DocVersionError, createDoc, migrateDoc } from "./migrate";
import { DocSchema } from "./schema";
import { fx, imageLayer, layerBase, makeDoc } from "./fixtures";

describe("document schema", () => {
  it("creates a valid empty document", () => {
    const doc = createDoc({ id: "d1", title: "Untitled", width: 1080, height: 1350, seed: 7 });
    expect(doc.layers).toEqual([]);
    expect(doc.artboard.background).toBe("#ffffff");
    expect(migrateDoc(JSON.parse(JSON.stringify(doc)))).toEqual(doc);
  });

  it("accepts every layer type, including nested groups and baked 3D", () => {
    const doc = makeDoc([
      imageLayer("img", [fx("tone.threshold")]),
      {
        ...layerBase,
        id: "txt",
        type: "text",
        text: "GRAFISH",
        fontFamily: "Archivo",
        fontSize: 120,
        fontWeight: 800,
        variations: { wdth: 75 },
        letterSpacing: -0.02,
        lineHeight: 1,
        align: "center",
        color: "#FF48B0",
        boxWidth: null,
      },
      {
        ...layerBase,
        id: "grp",
        type: "group",
        children: [
          {
            ...layerBase,
            id: "shp",
            type: "shape",
            path: "M0 0L10 10Z",
            fill: "#000000",
            stroke: null,
            strokeWidth: 0,
          },
          {
            ...layerBase,
            id: "pat",
            type: "pattern",
            generatorId: "pattern.truchet",
            params: { size: 12 },
            seed: 4,
            tileWidth: 64,
            tileHeight: 64,
          },
          {
            ...layerBase,
            id: "obj",
            type: "render3d",
            sceneId: "scene1",
            width: 1024,
            height: 1024,
            bake: { assetId: "bake1", sceneHash: "a".repeat(64) },
          },
        ],
      },
    ]);
    const parsed = DocSchema.parse(doc);
    const text = parsed.layers[1];
    expect(text?.type === "text" && text.color).toBe("#ff48b0");
    const group = parsed.layers[2];
    expect(group?.type === "group" && group.children.map((c) => c.type)).toEqual([
      "shape",
      "pattern",
      "render3d",
    ]);
  });

  it("rejects out-of-bounds and malicious input", () => {
    const ok = makeDoc([imageLayer("img")]);
    expect(
      DocSchema.safeParse({ ...ok, artboard: { ...ok.artboard, width: 100000 } }).success,
    ).toBe(false);
    expect(DocSchema.safeParse({ ...ok, id: "../etc/passwd" }).success).toBe(false);
    expect(
      DocSchema.safeParse({ ...ok, layers: [{ ...imageLayer("x"), opacity: 2 }] }).success,
    ).toBe(false);
    expect(
      DocSchema.safeParse({ ...ok, layers: [{ ...imageLayer("x"), type: "video" }] }).success,
    ).toBe(false);
    expect(
      DocSchema.safeParse({
        ...ok,
        layers: [{ ...imageLayer("x"), transform: { ...layerBase.transform, x: Infinity } }],
      }).success,
    ).toBe(false);
  });

  it("refuses unknown versions", () => {
    expect(() => migrateDoc({ version: 99 })).toThrow(DocVersionError);
    expect(() => migrateDoc({ version: 0 })).toThrow(DocVersionError);
    expect(() => migrateDoc("nope")).toThrow(DocVersionError);
    expect(() => migrateDoc(null)).toThrow(DocVersionError);
  });
});
