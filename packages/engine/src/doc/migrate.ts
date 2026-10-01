import { DOC_VERSION, DocSchema, type Doc } from "./schema";

/** Each entry upgrades a document from version `n` to `n + 1`. Empty until v2 exists. */
const migrations: Record<number, (doc: Record<string, unknown>) => Record<string, unknown>> = {};

export class DocVersionError extends Error {
  constructor(public readonly found: unknown) {
    super(`Unsupported document version: ${String(found)} (this build reads up to ${DOC_VERSION})`);
    this.name = "DocVersionError";
  }
}

/** Parses an untrusted document of any known version and returns it at the current version. */
export function migrateDoc(input: unknown): Doc {
  if (typeof input !== "object" || input === null) throw new DocVersionError(undefined);
  let doc = input as Record<string, unknown>;
  let version = doc.version;
  if (
    typeof version !== "number" ||
    !Number.isInteger(version) ||
    version < 1 ||
    version > DOC_VERSION
  )
    throw new DocVersionError(version);

  while (version < DOC_VERSION) {
    const step = migrations[version];
    if (!step) throw new DocVersionError(version);
    doc = step(doc);
    version += 1;
  }
  return DocSchema.parse(doc);
}

export interface NewDocOptions {
  id: string;
  title: string;
  width: number;
  height: number;
  /** Callers supply the seed (e.g. from crypto.getRandomValues) so the engine stays pure. */
  seed: number;
  background?: string;
}

export function createDoc(options: NewDocOptions): Doc {
  return DocSchema.parse({
    version: DOC_VERSION,
    id: options.id,
    title: options.title,
    seed: options.seed,
    artboard: {
      width: options.width,
      height: options.height,
      background: options.background ?? "#ffffff",
    },
    layers: [],
    assets: {},
  });
}
