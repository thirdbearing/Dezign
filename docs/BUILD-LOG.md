# Build Log — pemakaian token AI per fase

Sumber angka: metadata sesi Claude Code (`get_session` → `external_metadata.usage`). Angkanya **kumulatif per sesi**, jadi pemakaian satu fase = snapshot akhir fase dikurangi snapshot sebelumnya. Kalau sebuah fase dikerjakan di sesi baru, hitungan sesi itu mulai dari nol dan dicatat sebagai baris baru.

`cost_usd` adalah estimasi biaya API dari harness, bukan tagihan langganan claude.ai Anda. Angka tagihan yang sebenarnya ada di pengaturan akun claude.ai.

| Fase                      | Sesi              | Snapshot (UTC)   | Input | Output  | Cache read | Cache write | Est. USD (kumulatif) | Δ USD fase |
| ------------------------- | ----------------- | ---------------- | ----- | ------- | ---------- | ----------- | -------------------- | ---------- |
| Perencanaan + setup skill | session_01DJRyuh… | 2026-10-01 11:23 | 691   | 37.680  | 2.686.073  | 83.894      | 1,96                 | 1,96       |
| Fase 0 — fondasi          | session_01DJRyuh… | 2026-10-01 12:28 | 2.017 | 244.832 | 42.150.988 | 597.453     | 17,45                | 15,49      |

### Catatan Fase 0

- Subagent ikut bekerja: finish reviewer impeccable (2 putaran, ±158 rb token) dan documenter (±69 rb token). Saya belum bisa memastikan apakah `cost_usd` sesi sudah memasukkan pemakaian subagent, jadi angkanya dicatat terpisah di sini.
- Pemakaian terbesar berasal dari iterasi performa (anggaran JS, LCP, tekstur grain) dan review desain 2 putaran.

### Bukti DoD Fase 0 (1 Okt 2026)

| Kriteria                                      | Hasil                                                                                                                           |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm format:check / lint / typecheck / test` | hijau: engine 27 test (cakupan 97%), web 7 test                                                                                 |
| `pnpm build`                                  | 21 halaman statis                                                                                                               |
| E2E Playwright (desktop + Pixel 7)            | 20 lulus, 2 di-skip (khusus perangkat)                                                                                          |
| JS per halaman (gzip)                         | landing 134,1 KB (≤140), Studio 136,2 KB (≤180)                                                                                 |
| Lighthouse mobile slow-4G, median 3 run       | landing: perf 100, a11y/BP/SEO 100, LCP 1,86 s (terbaik 1,70); Studio: perf 98, a11y/BP/SEO 100, LCP 2,37 s; CLS 0; TBT < 80 ms |
| Review desain impeccable                      | putaran 1: _fix_ (7 temuan); putaran 2: 5 beres, 1 parsial, 2 regresi; semuanya ditangani di commit `1a01141` dan sesudahnya    |
| DESIGN.md + `.impeccable/design.json`         | ditulis documenter dari hasil build                                                                                             |
