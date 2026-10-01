import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import id from "../../messages/id.json";
import { LABS } from "../lib/labs";

function keys(obj: object, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === "object" && v !== null ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

describe("messages", () => {
  it("has the same keys in every locale", () => {
    expect(keys(en).sort()).toEqual(keys(id).sort());
  });

  it("names every lab", () => {
    for (const lab of LABS) {
      expect(id.labs[lab.id].name).toBeTruthy();
      expect(en.labs[lab.id].name).toBeTruthy();
    }
  });
});
