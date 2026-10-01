/**
 * Canonical JSON + SHA-256. The server uses the hash of (document, export settings) to price an
 * export once and to let the user re-download the same result without paying again, so the
 * serialization must not depend on key insertion order.
 */

export function canonicalJson(value: unknown): string {
  return serialize(value, new Set());
}

function serialize(value: unknown, seen: Set<object>): string {
  if (value === null) return "null";
  switch (typeof value) {
    case "number":
      if (!Number.isFinite(value)) throw new TypeError("canonicalJson: non-finite number");
      // Normalise -0 so it hashes like 0.
      return JSON.stringify(Object.is(value, -0) ? 0 : value);
    case "string":
    case "boolean":
      return JSON.stringify(value);
    case "object": {
      if (seen.has(value)) throw new TypeError("canonicalJson: circular reference");
      seen.add(value);
      let out: string;
      if (Array.isArray(value)) {
        out = `[${value.map((v) => (v === undefined ? "null" : serialize(v, seen))).join(",")}]`;
      } else {
        const entries = Object.entries(value as Record<string, unknown>)
          .filter(([, v]) => v !== undefined)
          .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
          .map(([k, v]) => `${JSON.stringify(k)}:${serialize(v, seen)}`);
        out = `{${entries.join(",")}}`;
      }
      seen.delete(value);
      return out;
    }
    default:
      throw new TypeError(`canonicalJson: unsupported type ${typeof value}`);
  }
}

/** Hex SHA-256 via Web Crypto, available in browsers, workers, and Node 22+. */
export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function hashCanonical(value: unknown): Promise<string> {
  return sha256Hex(canonicalJson(value));
}
