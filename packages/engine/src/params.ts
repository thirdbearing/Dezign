/**
 * Parameter schemas describe an effect's controls as data. The studio generates its panel from
 * these, and the engine uses them to fill defaults and clamp untrusted input (imported documents,
 * server-side re-renders).
 */

interface ParamBase {
  /** i18n key for the control label, e.g. "effects.halftone.size". */
  label: string;
  /** Shown under "Advanced" in the panel. */
  advanced?: boolean;
}

export interface NumberParam extends ParamBase {
  type: "number";
  min: number;
  max: number;
  step: number;
  default: number;
  unit?: "px" | "%" | "deg" | "x";
}

export interface BooleanParam extends ParamBase {
  type: "boolean";
  default: boolean;
}

export interface SelectParam<V extends string = string> extends ParamBase {
  type: "select";
  options: readonly { value: V; label: string }[];
  default: V;
}

export interface ColorParam extends ParamBase {
  type: "color";
  /** #rrggbb */
  default: string;
}

export type ParamDef = NumberParam | BooleanParam | SelectParam | ColorParam;

export type ParamSchema = Record<string, ParamDef>;

/** The runtime value type of a schema. */
export type ParamValues<S extends ParamSchema> = {
  [K in keyof S]: S[K] extends NumberParam
    ? number
    : S[K] extends BooleanParam
      ? boolean
      : S[K] extends SelectParam<infer V>
        ? V
        : S[K] extends ColorParam
          ? string
          : never;
};

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export function defaultParams<S extends ParamSchema>(schema: S): ParamValues<S> {
  const out: Record<string, unknown> = {};
  for (const [key, def] of Object.entries(schema)) out[key] = def.default;
  return out as ParamValues<S>;
}

function snapToStep(value: number, def: NumberParam): number {
  const steps = Math.round((value - def.min) / def.step);
  // Round away float noise so 0.1 + 0.2 style values stay stable in hashes.
  const snapped = Number((def.min + steps * def.step).toFixed(10));
  return Math.min(def.max, Math.max(def.min, snapped));
}

function coerce(def: ParamDef, value: unknown): unknown {
  switch (def.type) {
    case "number":
      return typeof value === "number" && Number.isFinite(value)
        ? snapToStep(value, def)
        : def.default;
    case "boolean":
      return typeof value === "boolean" ? value : def.default;
    case "select":
      return def.options.some((o) => o.value === value) ? value : def.default;
    case "color":
      return typeof value === "string" && HEX_COLOR.test(value) ? value.toLowerCase() : def.default;
  }
}

/**
 * Returns a complete, valid value set: unknown keys are dropped, missing or invalid values fall
 * back to defaults, numbers are clamped and snapped to their step.
 */
export function sanitizeParams<S extends ParamSchema>(schema: S, input: unknown): ParamValues<S> {
  const source = (typeof input === "object" && input !== null ? input : {}) as Record<
    string,
    unknown
  >;
  const out: Record<string, unknown> = {};
  for (const [key, def] of Object.entries(schema)) out[key] = coerce(def, source[key]);
  return out as ParamValues<S>;
}

/** Throws if a schema is internally inconsistent; run when an effect is registered. */
export function assertValidSchema(schema: ParamSchema, owner: string): void {
  for (const [key, def] of Object.entries(schema)) {
    const where = `${owner}.${key}`;
    if (def.type === "number") {
      if (!(def.min < def.max)) throw new Error(`${where}: min must be below max`);
      if (!(def.step > 0)) throw new Error(`${where}: step must be positive`);
      if (def.default < def.min || def.default > def.max)
        throw new Error(`${where}: default is outside [min, max]`);
    } else if (def.type === "select") {
      if (!def.options.some((o) => o.value === def.default))
        throw new Error(`${where}: default is not one of the options`);
    } else if (def.type === "color" && !HEX_COLOR.test(def.default)) {
      throw new Error(`${where}: default must be #rrggbb`);
    }
  }
}
