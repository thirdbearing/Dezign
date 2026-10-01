import type { ParamSchema, ParamValues } from "./params";
import type { Rng } from "./rng";

export type EffectTier = "free" | "pro";

export type EffectCategory = "tone" | "pattern" | "distort" | "stylize" | "glitch" | "3d";

/** Pixels the engine hands to CPU effects; matches the shape of ImageData without needing a DOM. */
export interface PixelBuffer {
  width: number;
  height: number;
  /** RGBA, 8 bits per channel, row-major. */
  data: Uint8ClampedArray;
}

export interface CpuEffectContext<P> {
  params: P;
  rng: Rng;
  /** Called with 0..1; long effects report so the UI can show progress. */
  progress?: (fraction: number) => void;
  signal?: AbortSignal;
}

/** CPU effects run inside a Web Worker (browser) or worker thread (render worker). */
export type CpuEffect<P> = (input: PixelBuffer, ctx: CpuEffectContext<P>) => Promise<PixelBuffer>;

/** Minimal vector output: enough to serialize SVG/PDF without a DOM. */
export type VectorShape =
  | { kind: "circle"; cx: number; cy: number; r: number; fill: string }
  | { kind: "rect"; x: number; y: number; w: number; h: number; fill: string }
  | { kind: "path"; d: string; fill?: string; stroke?: string; strokeWidth?: number }
  | { kind: "text"; x: number; y: number; text: string; fontSize: number; fill: string };

/** Effects whose output is naturally geometric (stipple, halftone, ASCII) emit real vectors. */
export type VectorEmitter<P> = (
  input: PixelBuffer,
  ctx: CpuEffectContext<P>,
) => Promise<VectorShape[]>;

export type EffectImpl<P> =
  | {
      kind: "glsl";
      /** GLSL ES 3.00 fragment shader; uniforms are named u_<paramKey>. */
      frag: string;
    }
  | {
      kind: "cpu";
      /** Lazy so each effect's code is its own chunk. */
      load: () => Promise<CpuEffect<P>>;
    };

export interface QualityHint {
  /** Longest edge, in pixels, the effect is rendered at for this mode. */
  maxEdge: number;
}

export interface EffectDef<S extends ParamSchema = ParamSchema> {
  /** Stable, namespaced id; never renamed once shipped because documents store it. */
  id: string;
  /** i18n key for the effect name. */
  name: string;
  category: EffectCategory;
  tier: EffectTier;
  /** Default token cost on export. The server's effect_catalog is authoritative. */
  cost: number;
  params: S;
  impl: EffectImpl<ParamValues<S>>;
  vector?: () => Promise<VectorEmitter<ParamValues<S>>>;
  quality: { preview: QualityHint; export: QualityHint };
}

/** Identity helper that keeps the schema's literal types for ParamValues inference. */
export function defineEffect<S extends ParamSchema>(def: EffectDef<S>): EffectDef<S> {
  return def;
}
