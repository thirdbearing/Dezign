#!/usr/bin/env node
/**
 * JS budget check (docs/PLAN.md §4). Starts the production server, loads each route's HTML,
 * collects every <script src> it references, and sums their gzip sizes. Fails if a route is over.
 *
 * Usage: pnpm build && pnpm budget            (BUDGET_BASE_URL=... to test a running server)
 */
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { gzipSync } from "node:zlib";

const KB = 1024;
const BUDGETS = [
  { path: "/", maxGzip: 140 * KB },
  { path: "/en", maxGzip: 140 * KB },
  { path: "/studio/effects", maxGzip: 180 * KB },
  { path: "/en/studio/3d", maxGzip: 180 * KB },
];

const port = Number(process.env.BUDGET_PORT ?? 3210);
const base = process.env.BUDGET_BASE_URL ?? `http://127.0.0.1:${port}`;

let server;
if (!process.env.BUDGET_BASE_URL) {
  server = spawn("pnpm", ["exec", "next", "start", "-p", String(port)], { stdio: "ignore" });
  for (let i = 0; ; i++) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {
      /* not up yet */
    }
    if (i > 60) throw new Error("server did not start");
    await delay(500);
  }
}

const cache = new Map();
async function gzipSize(url) {
  if (!cache.has(url)) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: ${res.status}`);
    cache.set(url, gzipSync(Buffer.from(await res.arrayBuffer()), { level: 9 }).length);
  }
  return cache.get(url);
}

let failed = false;
try {
  for (const { path, maxGzip } of BUDGETS) {
    const html = await (await fetch(base + path)).text();
    // nomodule scripts (legacy polyfills) are never downloaded by modern browsers.
    const tags = [...html.matchAll(/<script([^>]*)>/g)]
      .map((m) => m[1])
      .filter((a) => !/nomodule/i.test(a));
    const srcs = [...new Set(tags.map((a) => /src="([^"]+)"/.exec(a)?.[1]).filter(Boolean))];
    let total = 0;
    for (const src of srcs) total += await gzipSize(new URL(src, base).href);
    const ok = total <= maxGzip;
    failed ||= !ok;
    console.log(
      `${ok ? "PASS" : "FAIL"}  ${path.padEnd(18)} ${(total / KB).toFixed(1).padStart(6)} KB gz` +
        `  / budget ${(maxGzip / KB).toFixed(0)} KB  (${srcs.length} scripts)`,
    );
  }
} finally {
  server?.kill();
}
process.exit(failed ? 1 : 0);
