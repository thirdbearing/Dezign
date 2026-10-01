# Grafish

Studio desain grafis di browser: efek gambar, poster, font, pattern, shape, 2D/3D, dan tic-tac-toe.
Rencana lengkap ada di [`docs/PLAN.md`](docs/PLAN.md), dan konteks produknya di [`PRODUCT.md`](PRODUCT.md).

## Struktur

```
apps/web          Next.js (App Router): entry page + Studio, i18n id/en
packages/engine   @grafish/engine: model dokumen, kontrak efek, RNG deterministik, hash, biaya export
scripts/fonts     pipeline font UI (Archivo, OFL)
docs/             PLAN, BUILD-LOG, SETUP-TOOLS
```

## Menjalankan

Butuh Node 22 dan pnpm 10.

```bash
pnpm install
pnpm dev                 # http://localhost:3000  (Indonesia), /en untuk English
```

## Pemeriksaan (sama dengan CI)

```bash
pnpm format:check && pnpm lint && pnpm typecheck && pnpm test
pnpm build
pnpm budget              # anggaran JS per halaman (PLAN §4)
pnpm e2e                 # Playwright desktop + mobile
pnpm lhci                # Lighthouse CI, mobile + slow 4G
```

Di mesin tanpa Chromium bawaan Playwright, set `PW_CHROMIUM_PATH` (e2e) dan `CHROME_PATH` (Lighthouse) ke binary Chromium yang ada.
