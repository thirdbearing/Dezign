# Dezign — Rencana Kerja & Arsitektur

> Studio desain grafis di browser: poster, efek gambar, lab font, pattern, shape, efek 2D & 3D, plus mini-game tic-tac-toe.
> Referensi rasa: [tooooools.app](https://www.tooooools.app/) (sidebar alat → kanvas → panel kontrol, cepat, tanpa basa-basi).
> Prinsip nomor satu: **ringan, cepat, lancar di HP kentang sekalipun.**

Dokumen ini adalah sumber kebenaran. `PROMPT.md` adalah prompt utama untuk agent yang mengerjakannya, dan `CLAUDE.md` berisi aturan harian di repo.

---

## 0. Ringkasan keputusan penting

| Topik | Keputusan | Alasan |
|---|---|---|
| Rendering | **Semua preview di klien** (WebGL2 shader + Web Worker/OffscreenCanvas) | Gratis untuk server, instan, bisa offline |
| Mesin render | Paket `@dezign/engine` **lepas dari React**, deterministik (seeded RNG) | Kode yang sama dipakai di browser **dan** di render worker server (HD/vector) |
| Framework | Next.js (App Router) + React + TypeScript strict | SSR untuk landing/SEO, API route untuk token & webhook, ekosistem skill (shadcn) |
| UI | Tailwind CSS v4 + shadcn/ui (Radix) | Komponen aksesibel, bundle kecil, gampang dikustom |
| State editor | Zustand + Immer, undo/redo berbasis patch | Ringan (~3 KB), tanpa boilerplate |
| 3D | three.js, **di-lazy-load** hanya saat 3D Lab dibuka | three.js besar (~150 KB gz), jangan bebani modul lain |
| Shape boolean | paper.js (lazy) atau clipper2-wasm | Boolean path yang andal |
| Font | opentype.js / fontkit (parse, text→path), harfbuzzjs (shaping) bila perlu | Text-to-path untuk SVG/PDF, glyph editor |
| Auth | Supabase Auth: Google + GitHub + **mode tamu** | Satu vendor untuk Auth + Postgres + Storage + RLS |
| Database | Supabase Postgres + Row Level Security | Ledger token aman via fungsi SQL |
| Aset/CDN | Cloudflare R2 + CDN (font, template, preview) | Egress murah, cepat |
| Pembayaran | **Token (kredit)**. ID: Midtrans/Xendit (QRIS, e-wallet, VA). Global: Stripe/Lemon Squeezy | Sesuai brief: bayar per generate |
| Enforcement | Biaya dihitung di **server**; HD/vector/GLB dirender di **server** | Klien bisa dibobol, server tidak |
| Hosting | Vercel (web), Supabase (data), Fly.io/Railway (render worker, fase 7) | Murah di awal, skala bertahap |

---

## 1. Peta produk (modul)

Satu aplikasi bernama **Studio** dengan rail alat di kiri (bottom bar di HP):

| # | Modul | Isi | Tier |
|---|---|---|---|
| 1 | **Effects Lab** | Upload gambar → preprocessing (blur, grain, gamma, black/white point, kontras) → efek → export. Efek: halftone/dots, stippling, dithering (Floyd–Steinberg, Atkinson, Bayer, blue-noise), ASCII, CRT, glitch/RGB shift, pixel sort, displace, distort/wave, edge, recolor/gradient map/duotone, bevel/emboss, posterize, threshold, scatter, cellular automata, chromatic aberration, bloom | Dasar gratis, sebagian Pro |
| 2 | **Poster Studio** | Artboard preset (A4, A3, IG 1080×1350, Story 1080×1920, X/Twitter, kustom), layer (gambar/teks/shape/pattern/render 3D), grup, align & distribute, snapping, blend mode, mask, **stack efek per layer & global**, template | Gratis + template/efek Pro |
| 3 | **Type Lab** | Library font sendiri (browse, filter kategori/variable/bahasa), tester, waterfall, glyph map, fitur OpenType (liga, ss01, tnum…), slider axis variable, pairing, compare, upload font sendiri | Gratis |
| 3b | **Text FX** | Outline berlapis, long shadow, warp (arc/wave/bulge/flag), text on path, glitch, teks 3D (→ 3D Lab), kinetic/variable animation | Campuran |
| 3c | **Font Editor** *(lanjutan)* | Edit glyph bezier, metrik, kerning dasar, export OTF/WOFF2 (wajib rename sesuai lisensi OFL) | Pro |
| 4 | **Pattern Lab** | Generator: grid, dots, stripes, checker, truchet, wave, flow field/noise, voronoi, hex, isometric, memphis, pattern dari teks; seed acak; **tile seamless**; jadi fill di Poster | Gratis, SVG seamless Pro |
| 5 | **Shape Lab** | Primitif, polygon/star, blob generator, pen bezier, edit node, boolean (union/subtract/intersect/exclude), offset path, rounded corner, import/export SVG | Gratis, sebagian Pro |
| 6 | **3D Lab** | Extrude teks/SVG/shape, primitif, material (matte, clay, metal, chrome, glass, holographic, toon), preset lighting/HDRI kecil, kamera, post-processing (bloom, DoF ringan), gambar → depth/displacement plane, render PNG, export GLB | Pro (token mahal) |
| 7 | **Playground** | Tic-tac-toe: vs AI (minimax, 3 level), 2 pemain lokal, skin dari pattern/font buatan user; multiplayer online menyusul | Gratis |

**Animasi (opsional, fase 9):** efek bergerak (slide, stack, loop parameter) → export MP4 (WebCodecs + mp4-muxer) / GIF (gifenc).

---

## 2. Tier pengguna & model token

### 2.1 Tier

| Kemampuan | Tamu (tanpa login) | Free (login Google/GitHub) | Berbayar (punya token) |
|---|---|---|---|
| Efek & alat gratis | ✅ | ✅ | ✅ |
| Preview efek Pro | ✅ resolusi rendah + watermark | ✅ penuh | ✅ |
| Export efek Pro / 3D | ❌ (ajakan login) | ✅ potong token | ✅ potong token |
| Resolusi export gratis | maks 1080 px | maks 2048 px | 2048 px + add-on HD |
| HD (4K/8K) & vector (SVG/PDF) | ❌ | ✅ token tambahan | ✅ token tambahan |
| Simpan proyek | lokal (IndexedDB), maks 3 | cloud, maks 20 | cloud, lebih banyak |
| Upload font sendiri | sesi saja | tersimpan | tersimpan |
| Bonus | — | 20 token saat daftar | — |

Saat tamu login, proyek lokalnya **dimigrasikan** ke akun (tidak hilang).

### 2.2 Kapan token dipotong — PENTING

**Menggeser slider dan preview tidak pernah memotong token.** Token hanya dipotong saat **export/generate final**. Kalau setiap perubahan slider memotong token, aplikasinya tidak bisa dipakai.

```
cost = min(10, Σ biaya efek/fitur Pro yang dipakai di dokumen)   ← "base" 1–10 (sesuai brief)
     + add-on resolusi  (HD 2× ≤4096px: +2 · 4×/8K: +4)
     + add-on format    (SVG/PDF vector: +3 · GLB: +2 · MP4/GIF: +3)
```

Contoh biaya per item (draf, bisa diubah di tabel `effect_catalog` tanpa deploy ulang):

| Item | Biaya |
|---|---|
| Efek gratis, export ≤2048 px PNG/JPG/WebP | 0 |
| Efek 2D Pro (pixel sort, ASCII font kustom, CRT kurva, dll.) | 1–3 per efek |
| Text FX Pro | 1–2 |
| Render 3D standar | 5 |
| Render 3D kompleks (glass, HDRI, sampel tinggi) | 8 |
| Template Pro | 1 |

Aturan yang wajib dipatuhi:
1. **Server menghitung biaya** dari dokumen. Angka biaya dari klien tidak pernah dipercaya.
2. **Download ulang gratis**: export dengan `hash(dokumen + setelan export)` yang sama dalam 24 jam tidak dipotong lagi.
3. **Reserve → commit/release**: token ditahan dulu; kalau render gagal, token dikembalikan otomatis.
4. **Idempotency key** di setiap pemotongan dan top-up, agar klik ganda atau webhook yang terkirim dua kali tidak menghitung dua kali.

### 2.3 Paket token (draf harga, perlu keputusan Anda)

| Paket | Token | Harga | Per token |
|---|---|---|---|
| Starter | 30 | Rp15.000 | Rp500 |
| Creator | 120 | Rp49.000 | ±Rp408 |
| Studio | 400 | Rp139.000 | ±Rp348 |

### 2.4 Seberapa kuat pengamanannya (jujur)

- Export resolusi standar dirender di klien. Pengguna yang mahir bisa membobol JavaScript-nya, seperti di semua alat web sejenis. Lapisan penghalangnya: tiket export bertanda tangan dari server, kode shader Pro baru dikirim setelah login, dan watermark di preview tamu.
- **HD, vector, PDF, dan GLB dirender di server** (fase 7). Hasil bernilai tertinggi ini benar-benar terkunci.

---

## 3. Arsitektur

### 3.1 Struktur monorepo (pnpm workspaces + Turborepo)

```
apps/
  web/                      Next.js — landing, pricing, auth, studio, API
    app/(marketing)/        /, /pricing, /fonts (SEO)
    app/(studio)/studio/    effects | poster | type | pattern | shape | 3d | play
    app/api/                export-ticket, tokens, webhooks/{midtrans,stripe}
packages/
  engine/                   TANPA React. Model dokumen, pipeline render, exporter
    doc/                    skema zod + versi + migrasi
    render/                 WebGL2 ping-pong FBO, compositor layer
    effects/                registry efek (glsl + cpu worker)
    export/                 png/jpg/webp, svg, pdf, gif, mp4
    text/                   text→path, layout
  ui/                       komponen shadcn + kontrol kustom (slider, color, curve)
services/
  render-worker/            (fase 7) Node + Chromium headless, menjalankan engine yang sama
supabase/
  migrations/               SQL: tabel, RLS, fungsi token
scripts/
  fonts/                    pipeline library font → woff2 subset + katalog + sprite preview → R2
```

### 3.2 Kontrak efek (inti segalanya)

Setiap efek adalah satu objek data. UI kontrol dibuat **otomatis** dari `params`, jadi menambah efek baru tidak perlu menulis UI baru.

```ts
interface EffectDef<P> {
  id: string;                     // "dither.atkinson"
  name: string; category: "tone" | "pattern" | "distort" | "stylize" | "glitch" | "3d";
  tier: "free" | "pro";
  cost: number;                   // token saat export (0 untuk free)
  params: ParamSchema<P>;         // tipe, min, max, step, default, label
  impl:
    | { kind: "glsl"; frag: string }                       // GPU, cepat
    | { kind: "cpu"; worker: () => Promise<CpuEffect<P>> }; // error-diffusion, stipple, ascii
  output: { raster: true; vector?: VectorEmitter<P> };     // stipple/dots/ascii/halftone → SVG asli
  quality: { preview: QualityHint; export: QualityHint };
}
```

Hal penting: efek seperti **stippling, dots, halftone, ASCII, dan pattern pada dasarnya vektor**. Efek-efek ini menghasilkan SVG asli (lingkaran, path, teks), bukan bitmap yang ditempel ke dalam SVG. Inilah nilai jual export vector.

### 3.3 Model dokumen

Dokumen berupa JSON berversi (skema zod): `artboard`, lalu `layers[]` (image | text | shape | pattern | group | render3d), dan tiap layer punya `transform`, `blend`, `mask`, dan `effects[]`. Aturannya:
- Deterministik: semua acak memakai `seed` dari dokumen, tidak boleh `Math.random()`.
- Gambar sumber disimpan sebagai referensi aset. Preview memakai proksi ≤2048 px, export memakai resolusi asli.
- `docHash = sha256(canonicalJSON)` dipakai untuk tiket export dan download ulang.

### 3.4 Skema data (Supabase)

```
profiles          (id ↔ auth.users, username, avatar, created_at)
wallets           (user_id PK, balance int ≥ 0, updated_at)
token_ledger      (id, user_id, delta int, reason enum[signup_bonus|purchase|export|refund|admin],
                   ref_id, idempotency_key UNIQUE, created_at)        -- append-only
purchases         (id, user_id, provider, provider_ref UNIQUE, package_id, amount_idr, tokens, status, raw)
token_packages    (id, name, tokens, price_idr, price_usd, active)
effect_catalog    (id, tier, cost, vector_capable, active)            -- harga bisa diatur tanpa deploy
exports           (id, user_id, doc_hash, settings_hash, cost, status[reserved|done|failed|refunded],
                   file_url, expires_at, created_at)
projects          (id, user_id, title, doc jsonb, thumb_url, updated_at)
fonts             (id, family, category, variable bool, axes jsonb, license, files jsonb, preview_url)
user_fonts        (id, user_id, family, file_url)                     -- privat, tidak didistribusikan
```

- Saldo hanya bisa diubah lewat fungsi SQL `SECURITY DEFINER`, yaitu `reserve_tokens`, `commit_export`, `release_export`, dan `credit_purchase`. Fungsi-fungsi ini memakai `SELECT … FOR UPDATE` dan idempotency key.
- RLS: pengguna hanya bisa membaca miliknya sendiri, tanpa akses tulis langsung ke `wallets` dan `token_ledger`.

### 3.5 Alur export berbayar

```
Klien ──POST /api/export-ticket {doc, settings, idempotencyKey}──▶ Server
Server: validasi doc (zod) → hitung cost dari effect_catalog → cek cache (doc_hash, settings_hash)
        → reserve_tokens → buat tiket bertanda tangan (HMAC, kadaluarsa 2 menit)
  ├─ resolusi standar: klien render → upload hasil/konfirmasi → commit_export
  └─ HD/vector/GLB (fase 7): antre ke render-worker → upload R2 → commit_export → URL bertanda tangan
Gagal/timeout → release_export (refund otomatis)
```

### 3.6 Pembayaran

- Midtrans **atau** Xendit (pilih satu di awal) untuk QRIS, GoPay, OVO, DANA, ShopeePay, VA, dan kartu. Stripe/Lemon Squeezy ditambahkan nanti untuk pengguna global.
- Webhook memverifikasi signature, lalu menjalankan `credit_purchase` secara idempoten (`provider_ref` UNIQUE).
- Ada halaman riwayat transaksi dan riwayat pemakaian token (dari `token_ledger`).

---

## 4. Anggaran performa (wajib, dicek di CI)

| Metrik | Target |
|---|---|
| JS awal landing | < 90 KB gzip |
| JS shell Studio (tanpa modul) | < 180 KB gzip |
| Tiap modul (lazy) | < 120 KB gzip; 3D Lab boleh < 300 KB |
| LCP landing (4G, Android menengah) | < 1,8 s |
| INP di Studio | < 150 ms |
| Preview efek GPU di gambar 2048 px | < 16 ms/frame (60 fps saat slider digeser) |
| Efek CPU (dither/stipple) | di Worker, progresif, UI tidak pernah freeze |

Teknik yang wajib dipakai:
- Code-split per modul dan per efek (`import()`), dengan three.js, paper.js, dan opentype.js hanya dimuat saat dibutuhkan.
- **Library font tidak memuat ratusan font** untuk menampilkan daftar. Nama font ditampilkan dari *sprite* SVG/AVIF yang dirender sebelumnya, file font baru dimuat saat dipilih (woff2, di-subset), dan daftarnya divirtualisasi.
- Gambar diperkecil saat import (proksi preview). Render ulang memakai debounce + `requestAnimationFrame`, dengan kualitas preview turun sementara slider digeser lalu naik saat dilepas.
- Deteksi perangkat lemah (`deviceMemory`, `hardwareConcurrency`, gagal WebGL2) → turunkan kualitas atau pakai fallback Canvas2D.
- PWA: shell, shader, dan font yang pernah dipakai di-cache, jadi bisa dipakai offline untuk alat gratis.
- Gambar memakai AVIF/WebP, font-display swap, tanpa library animasi berat di jalur kritis.

## 5. Ramah HP

- Rail alat menjadi **bottom bar**, dan panel kontrol menjadi **bottom sheet** yang bisa ditarik (peek, setengah, penuh).
- Kanvas: pinch-zoom, pan dua jari, double-tap untuk fit. Target sentuh ≥ 44 px.
- Slider presisi: tekan lama untuk input angka, dan nilai tampil saat digeser.
- Export di HP memakai Web Share API (langsung ke galeri/WhatsApp/IG).
- Diuji di perangkat nyata: Android kelas bawah (RAM 3–4 GB) dan iPhone (Safari: WebGL2 dan OffscreenCanvas punya batasan, jadi siapkan fallback).

## 6. Keamanan & legal

- Upload: validasi MIME + ukuran, **SVG disanitasi** (DOMPurify), font di-parse dengan fontkit di Worker (font rusak jangan sampai membuat tab crash), dan gambar di-decode di Worker.
- CSP ketat, rate limit di API token/export (Upstash Redis), dan secret hanya di server.
- **Lisensi font**: library hanya memuat font **OFL/Apache** (mis. dari repo google/fonts), dan setiap font menyimpan lisensinya. Font hasil editan pengguna wajib berganti nama jika memakai Reserved Font Name. Font upload pengguna bersifat privat dan tidak didistribusikan.
- Halaman Syarat & Ketentuan, Kebijakan Privasi, dan kebijakan refund token wajib ada sebelum menerima pembayaran.
- Tic-tac-toe **tidak** memberi token: AI-nya berjalan di klien sehingga gampang dicurangi. Kalau ingin ada hadiah, pakai check-in harian yang divalidasi server (maks 1 token/hari).

## 7. Arah desain

- Rasa tooooools: alat dulu, dekorasi belakangan. Grid yang tegas, tipografi kuat, monokrom dengan satu warna aksen, kanvas sebagai pusat.
- **Hindari "AI slop"**: tanpa gradien ungu generik, tanpa kartu glassmorphism yang tidak ada gunanya, tanpa emoji sebagai ikon. Jalankan skill `impeccable`, `hallmark`, `no-ai-design-slop`, dan `audit-ai-design-slop` di setiap layar.
- Mendukung tema gelap dan terang. Micro-interaction halus (skill `emil-design-eng`), dan `prefers-reduced-motion` dihormati.
- Bahasa UI: Indonesia + Inggris (i18n sejak awal, string tidak di-hardcode).

---

## 8. Fase pembuatan

Setiap fase punya: **Tujuan → Lingkup → Deliverable → Kriteria selesai (DoD) → Skill yang dipakai**. Satu fase baru boleh dimulai setelah DoD fase sebelumnya lolos. Estimasi waktu dihitung untuk 1 developer + AI agent.

### Fase 0 — Fondasi (±1 minggu)
- **Lingkup:** monorepo pnpm + Turborepo, Next.js + TS strict, Tailwind v4 + shadcn, ESLint/Prettier, Vitest, Playwright, Lighthouse CI dengan budget §4, GitHub Actions, `DESIGN.md` (token warna, tipografi, spasi), skeleton `@dezign/engine` (kontrak efek + skema dokumen + seeded RNG), i18n.
- **DoD:** `pnpm build && pnpm test && pnpm lint` hijau di CI; halaman kosong Studio lolos budget; `DESIGN.md` disetujui.
- **Skill:** `impeccable` (init design context), `design-taste-frontend`, `shadcn-ui`, `web-design-guidelines`, `superpowers` (brainstorming/plan).

### Fase 1 — Effects Lab MVP, tanpa backend (±2 minggu) → **rilis publik pertama**
- **Lingkup:** layout Studio (rail, kanvas, panel; versi HP dengan bottom sheet), upload/drag-drop/paste gambar, preprocessing, pipeline WebGL2, **12 efek gratis** (halftone, dots, dither ×3, threshold, posterize, duotone/gradient map, edge, wave distort, RGB shift, grain, CRT sederhana), stack efek, before/after, undo/redo, export PNG/JPG/WebP ≤1080 px, PWA.
- **DoD:** 60 fps saat menggeser slider di gambar 2048 px pada laptop menengah dan ≥30 fps di Android menengah; Lighthouse ≥ 95; e2e upload → efek → export lolos; snapshot visual tiap efek stabil.
- **Skill:** `shader-dev`, `canvas-design`, `algorithmic-art`, `gsap-performance`/`optimize-web-animations`, `better-interface`, `better-layout`.

### Fase 2 — Poster Studio (±3 minggu)
- **Lingkup:** artboard preset, layer panel, teks (font dari library awal ±30 font), shape dasar, gambar, transform handle, snapping/guides, align/distribute, blend mode, mask, efek per layer + global, template (10 gratis), simpan proyek ke IndexedDB, export composite.
- **DoD:** dokumen 30 layer tetap lancar; undo/redo 100 langkah; reload tidak menghilangkan proyek; layout HP tetap bisa dipakai penuh.
- **Skill:** `poster-hero`, `better-typography`, `better-colors`, `color-expert`, `high-end-visual-design`.

### Fase 3 — Type Lab + Text FX (±2–3 minggu)
- **Lingkup:** pipeline `scripts/fonts` (OFL → woff2 subset → katalog → sprite → R2), 150–300 famili terkurasi, browse/filter/search, tester, waterfall, glyph map, fitur OpenType, axis variable, pairing, compare, upload font sendiri; Text FX: outline, long shadow, warp, text on path, glitch.
- **DoD:** halaman library menampilkan 300 font dengan JS < 120 KB dan tanpa memuat file font; ganti font < 300 ms (cache) dan < 1 s (jaringan 4G).
- **Skill:** `better-typography`, `vfx-text-cursor`, `text-to-lottie` (kinetic type), `minimalist-ui`.

### Fase 4 — Pattern Lab, Shape Lab, Playground (±2 minggu)
- **Lingkup:** 12 generator pattern + seed + tile seamless (dipakai sebagai fill di Poster); Shape Lab: pen, edit node, polygon/star/blob, boolean, offset, import/export SVG; **Tic-tac-toe** (minimax 3 level, 2 pemain lokal, skin dari pattern/font).
- **DoD:** pattern seamless tanpa jahitan terlihat saat diulang 4×4; boolean shape lolos uji kasus tepi (self-intersection, lubang); AI "sulit" di tic-tac-toe tidak pernah kalah.
- **Skill:** `algorithmic-art`, `gooey-blob-system`, `ship-web-games`, `test-playable-web-games`.

### Fase 5 — Auth & akun (±1 minggu)
- **Lingkup:** Supabase Auth (Google, GitHub), mode tamu, migrasi proyek lokal ke cloud saat login, profil, proyek cloud + thumbnail, batasan tier (§2.1).
- **DoD:** login/logout di desktop dan HP; tamu → login tanpa kehilangan proyek; tes RLS menunjukkan user A tidak bisa membaca data user B.
- **Skill:** `login-flow`, `better-accessibility`, `security-review` (bawaan).

### Fase 6 — Ekonomi token & pembayaran (±2 minggu)
- **Lingkup:** tabel & fungsi SQL §3.4, `effect_catalog`, efek Pro pertama (6–8 buah), UI gembok Pro (preview boleh, export minta token), modal top-up, integrasi Midtrans/Xendit (sandbox → produksi), webhook idempoten, tiket export §3.5, riwayat transaksi & pemakaian, bonus daftar, halaman pricing, S&K/privasi/refund.
- **DoD:** uji konkurensi (100 export paralel tidak membuat saldo negatif); webhook ganda tidak menggandakan token; render gagal → token kembali; biaya di UI = biaya di server.
- **Skill:** `paywall-upgrade-cro`, `pricing-page`, `security-review`.

### Fase 7 — Render worker: HD & vector (±2 minggu)
- **Lingkup:** `services/render-worker` (Node + Chromium headless menjalankan `@dezign/engine`), antrean job, export HD 2×/4×, SVG (vector asli untuk efek yang mendukung, text→path), PDF (pdf-lib), upload R2 + URL bertanda tangan, cache download ulang 24 jam.
- **DoD:** hasil server identik dengan preview klien (diff piksel < 1%); SVG stipple/halftone terbuka bersih di Illustrator/Figma; job 4K selesai < 15 s.
- **Skill:** `full-output-enforcement`, `iterate-until-verified`.

### Fase 8 — 3D Lab (±3 minggu)
- **Lingkup:** three.js (lazy), extrude teks/SVG/shape, primitif, 7 material, preset lighting/HDRI (≤ 1 MB per HDRI), kamera orbit (sentuh), bloom/DoF, gambar → depth plane, render PNG, export GLB; hasil render bisa masuk ke Poster sebagai layer.
- **DoD:** 3D Lab dimuat < 2 s di 4G; ≥ 30 fps orbit di Android menengah; render 2048 px < 5 s; mode kualitas otomatis turun di perangkat lemah.
- **Skill:** `threejs`, `webgl-3d-object`, `3d-metal-material`, `3d-retina-resolution`, `mockup-device-3d`.

### Fase 9 — Animasi & export video (±1–2 minggu, opsional)
- **Lingkup:** animasi parameter efek (loop), slide/stack, text kinetic, export MP4 (WebCodecs) / GIF / Lottie untuk teks.
- **Skill:** `gsap-core`, `text-to-lottie`, `emil-design-eng`.

### Fase 10 — Font Editor (±3+ minggu, lanjutan)
- **Lingkup:** edit glyph bezier, metrik, kerning dasar, preview langsung, export OTF/WOFF2 dengan rename otomatis sesuai OFL.

### Fase 11 — Polish & peluncuran (±1–2 minggu)
- **Lingkup:** audit desain menyeluruh (`impeccable`, `hallmark` audit, `interface-review`), audit a11y, SEO (halaman font publik `/fonts/[family]`, OG image), analitik (event export/top-up, tanpa PII berlebih), monitoring error (Sentry), load test API token, review keamanan, backup DB.
- **DoD:** semua budget §4 terpenuhi di produksi; tidak ada temuan keamanan high; checklist peluncuran ditandatangani.

**Urutan ini disengaja:** produk bernilai yang bisa dirilis (Fase 1) keluar secepat mungkin tanpa server. Monetisasi sudah **dirancang** sejak Fase 0 (field `tier`/`cost` di kontrak efek, `docHash` di model dokumen), jadi Fase 6 tidak perlu menulis ulang apa pun.

---

## 9. Strategi pengujian

| Lapisan | Alat | Yang diuji |
|---|---|---|
| Unit engine | Vitest | skema dokumen, migrasi, kalkulasi biaya, RNG deterministik, exporter SVG |
| Visual | Playwright screenshot | output tiap efek vs snapshot (toleransi kecil) |
| E2E | Playwright (desktop + emulasi HP) | upload → edit → export; login; top-up sandbox; export berbayar |
| DB | pgTAP / skrip SQL | RLS, fungsi token, konkurensi |
| Performa | Lighthouse CI + bundle-size check | budget §4, gagal = CI merah |
| Manual | perangkat nyata | Android low-end, iPhone Safari |

## 10. Keputusan yang masih perlu Anda putuskan

1. **Harga & paket token** (§2.3): angka rupiah final? Apakah token punya masa berlaku (disarankan tidak, atau 12 bulan)?
2. **"Pro user" = hanya token**, atau juga ada **langganan bulanan** (mis. token bulanan + diskon)? Rekomendasi: mulai dengan token saja.
3. **Payment gateway pertama:** Midtrans atau Xendit? (Perlu badan usaha/NPWP untuk produksi.)
4. **Tamu boleh export tanpa watermark?** Rekomendasi: boleh untuk efek gratis ≤1080 px, karena itu menarik pengguna seperti tooooools.
5. **Nama brand & domain** (sementara: Dezign).
6. **Kurasi font awal:** murni dari Google Fonts (OFL), atau ada font orisinal sendiri?
