import { z } from "zod";

/**
 * Document model v1. Documents are user-authored and travel through the server (export tickets,
 * cloud save), so every field is bounded: the schema is also a validation boundary.
 */

export const DOC_VERSION = 1;

/** Upper bound for any artboard edge, matching the largest HD export (8K). */
export const MAX_ARTBOARD_EDGE = 8192;

const id = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/, "ids are 1-64 url-safe characters");
const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/)
  .transform((v) => v.toLowerCase());
const finite = z.number().finite();

export const BlendModeSchema = z.enum([
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
]);

export const TransformSchema = z.object({
  x: finite,
  y: finite,
  rotation: finite,
  scaleX: finite,
  scaleY: finite,
});

export const EffectInstanceSchema = z.object({
  id,
  effectId: z.string().min(1).max(64),
  enabled: z.boolean(),
  /** Validated against the effect's ParamSchema at render time (sanitizeParams). */
  params: z.record(z.string().max(64), z.unknown()),
});

const layerBase = {
  id,
  name: z.string().max(120),
  visible: z.boolean(),
  locked: z.boolean(),
  opacity: z.number().min(0).max(1),
  blend: BlendModeSchema,
  transform: TransformSchema,
  effects: z.array(EffectInstanceSchema).max(32),
};

export const ImageLayerSchema = z.object({
  ...layerBase,
  type: z.literal("image"),
  assetId: id,
  width: z
    .number()
    .int()
    .positive()
    .max(MAX_ARTBOARD_EDGE * 4),
  height: z
    .number()
    .int()
    .positive()
    .max(MAX_ARTBOARD_EDGE * 4),
});

export const TextLayerSchema = z.object({
  ...layerBase,
  type: z.literal("text"),
  text: z.string().max(5000),
  fontFamily: z.string().min(1).max(120),
  fontSize: z.number().positive().max(2000),
  fontWeight: z.number().int().min(1).max(1000),
  /** Variable font axes, e.g. { wdth: 75 }. */
  variations: z.record(z.string().regex(/^[A-Za-z]{4}$/), finite),
  letterSpacing: finite,
  lineHeight: z.number().positive().max(10),
  align: z.enum(["start", "center", "end", "justify"]),
  color: hexColor,
  /** Fixed box width; null means the box grows with the text. */
  boxWidth: z.number().positive().max(MAX_ARTBOARD_EDGE).nullable(),
});

export const ShapeLayerSchema = z.object({
  ...layerBase,
  type: z.literal("shape"),
  /** SVG path data in layer-local coordinates. */
  path: z.string().max(200_000),
  fill: hexColor.nullable(),
  stroke: hexColor.nullable(),
  strokeWidth: z.number().min(0).max(1000),
});

export const PatternLayerSchema = z.object({
  ...layerBase,
  type: z.literal("pattern"),
  generatorId: z.string().min(1).max(64),
  params: z.record(z.string().max(64), z.unknown()),
  seed: z.number().int().min(0).max(0xffffffff),
  tileWidth: z.number().positive().max(MAX_ARTBOARD_EDGE),
  tileHeight: z.number().positive().max(MAX_ARTBOARD_EDGE),
});

/**
 * A live 3D scene placed on the canvas. Baking stores a raster snapshot so 2D effects can apply
 * to it; the scene stays attached so the layer can be un-baked without losing its setup.
 */
export const Render3dLayerSchema = z.object({
  ...layerBase,
  type: z.literal("render3d"),
  sceneId: id,
  width: z.number().int().positive().max(MAX_ARTBOARD_EDGE),
  height: z.number().int().positive().max(MAX_ARTBOARD_EDGE),
  bake: z.object({ assetId: id, sceneHash: z.string().regex(/^[0-9a-f]{64}$/) }).nullable(),
});

export type ImageLayer = z.infer<typeof ImageLayerSchema>;
export type TextLayer = z.infer<typeof TextLayerSchema>;
export type ShapeLayer = z.infer<typeof ShapeLayerSchema>;
export type PatternLayer = z.infer<typeof PatternLayerSchema>;
export type Render3dLayer = z.infer<typeof Render3dLayerSchema>;
export interface GroupLayer extends z.infer<z.ZodObject<typeof layerBase>> {
  type: "group";
  children: Layer[];
}
export type Layer = ImageLayer | TextLayer | ShapeLayer | PatternLayer | Render3dLayer | GroupLayer;

export const GroupLayerSchema: z.ZodType<GroupLayer> = z.object({
  ...layerBase,
  type: z.literal("group"),
  get children() {
    return z.array(LayerSchema).max(500);
  },
});

export const LayerSchema: z.ZodType<Layer> = z.lazy(() =>
  z.discriminatedUnion("type", [
    ImageLayerSchema,
    TextLayerSchema,
    ShapeLayerSchema,
    PatternLayerSchema,
    Render3dLayerSchema,
    GroupLayerSchema as unknown as z.ZodObject<{ type: z.ZodLiteral<"group"> }>,
  ]),
) as z.ZodType<Layer>;

export const AssetSchema = z.object({
  kind: z.enum(["image", "font", "model"]),
  mime: z.string().max(100),
  /** Content hash; the storage key is derived from it, so identical uploads dedupe. */
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
  bytes: z.number().int().nonnegative(),
});

export const DocSchema = z.object({
  version: z.literal(DOC_VERSION),
  id,
  title: z.string().max(200),
  /** Root seed; every effect and generator derives its own stream from it. */
  seed: z.number().int().min(0).max(0xffffffff),
  artboard: z.object({
    width: z.number().int().min(1).max(MAX_ARTBOARD_EDGE),
    height: z.number().int().min(1).max(MAX_ARTBOARD_EDGE),
    background: z.union([hexColor, z.literal("transparent")]),
  }),
  layers: z.array(LayerSchema).max(500),
  assets: z.record(id, AssetSchema),
});

export type Doc = z.infer<typeof DocSchema>;
export type Asset = z.infer<typeof AssetSchema>;
