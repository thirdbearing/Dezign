import { describe, expect, it } from "vitest";
import { alternatesFor, localizedPath } from "./routing";

describe("localizedPath", () => {
  it("leaves the default locale unprefixed", () => {
    expect(localizedPath("/", "id")).toBe("/");
    expect(localizedPath("/studio/3d", "id")).toBe("/studio/3d");
  });

  it("prefixes other locales", () => {
    expect(localizedPath("/", "en")).toBe("/en");
    expect(localizedPath("/studio/effects", "en")).toBe("/en/studio/effects");
  });

  it("rejects relative paths", () => {
    expect(() => localizedPath("studio", "en")).toThrow(/absolute/);
  });
});

describe("alternatesFor", () => {
  it("points canonical at the current locale and lists every locale", () => {
    expect(alternatesFor("/studio/3d", "en")).toEqual({
      canonical: "/en/studio/3d",
      languages: { id: "/studio/3d", en: "/en/studio/3d", "x-default": "/studio/3d" },
    });
  });
});
