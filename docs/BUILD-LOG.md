# Build Log — pemakaian token AI per fase

Sumber angka: metadata sesi Claude Code (`get_session` → `external_metadata.usage`). Angkanya **kumulatif per sesi**, jadi pemakaian satu fase = snapshot akhir fase dikurangi snapshot sebelumnya. Kalau sebuah fase dikerjakan di sesi baru, hitungan sesi itu mulai dari nol dan dicatat sebagai baris baru.

`cost_usd` adalah estimasi biaya API dari harness, bukan tagihan langganan claude.ai Anda. Angka tagihan yang sebenarnya ada di pengaturan akun claude.ai.

| Fase                      | Sesi              | Snapshot (UTC)   | Input | Output | Cache read | Cache write | Est. USD (kumulatif) | Δ USD fase |
| ------------------------- | ----------------- | ---------------- | ----- | ------ | ---------- | ----------- | -------------------- | ---------- |
| Perencanaan + setup skill | session_01DJRyuh… | 2026-10-01 11:23 | 691   | 37.680 | 2.686.073  | 83.894      | 1,96                 | 1,96       |
