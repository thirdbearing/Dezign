import type { EffectCategory, EffectDef } from "./effect";
import { assertValidSchema } from "./params";

const ID_PATTERN = /^[a-z0-9]+(\.[a-z0-9-]+)+$/;

export interface EffectRegistry {
  register(def: EffectDef): void;
  get(id: string): EffectDef | undefined;
  has(id: string): boolean;
  list(category?: EffectCategory): EffectDef[];
}

export function createEffectRegistry(): EffectRegistry {
  const effects = new Map<string, EffectDef>();

  return {
    register(def) {
      if (!ID_PATTERN.test(def.id))
        throw new Error(`Effect id "${def.id}" must look like "family.variant"`);
      if (effects.has(def.id)) throw new Error(`Effect "${def.id}" is already registered`);
      if (def.tier === "free" && def.cost !== 0)
        throw new Error(`Effect "${def.id}" is free but costs ${def.cost}`);
      if (def.tier === "pro" && !(def.cost >= 1 && def.cost <= 10))
        throw new Error(`Effect "${def.id}" is pro and must cost 1..10`);
      assertValidSchema(def.params, def.id);
      effects.set(def.id, def);
    },
    get: (id) => effects.get(id),
    has: (id) => effects.has(id),
    list: (category) =>
      [...effects.values()].filter((e) => category === undefined || e.category === category),
  };
}
