# Grafish — panduan untuk agent

Studio desain grafis di browser (efek gambar, poster, font, pattern, shape, 2D/3D, tic-tac-toe).

- **Rencana & arsitektur:** `docs/PLAN.md` (sumber kebenaran). **Prompt kerja:** `PROMPT.md`.
- Status: Fase 0 (fondasi) selesai. Berikutnya Fase 1 (Effects Lab), lihat `docs/PLAN.md` §8.
- Desain: dunia visual **Studio Risograph**. Kontrak arah ada di `.impeccable/surfaces/`, sistem token di `DESIGN.md`, dan produk di `PRODUCT.md`.
- Jalankan pemeriksaan seperti CI: lihat `README.md`.

## Aturan inti

- Performa adalah fitur. Patuhi budget di PLAN §4, dan lazy-load modul berat (three.js, paper.js, opentype.js).
- Mobile-first (360 px). Panel kontrol menjadi bottom sheet di HP.
- `packages/engine` bebas React, deterministik (seeded RNG), dan dipakai bersama klien + render worker.
- Efek adalah data (`EffectDef`) dengan `tier` dan `cost`. UI kontrol di-generate dari `params`.
- Token hanya dihitung & dipotong di server lewat fungsi SQL idempoten. Preview tidak pernah memotong token.
- Font library hanya OFL/Apache. Sanitasi upload SVG/font.
- Klaim "selesai" harus disertai bukti (test, build, angka Lighthouse/bundle).

## Skill proyek (`.claude/skills/`)

| Kebutuhan              | Skill                                                                                                                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arah & kualitas desain | `impeccable`, `hallmark`, `design-taste-frontend`, `high-end-visual-design`, `minimalist-ui`, `redesign-existing-projects`                                                                              |
| Anti AI-slop & review  | `no-ai-design-slop`, `audit-ai-design-slop`, `interface-review`, `web-design-guidelines`, `design-first-ui-prompting`                                                                                   |
| UI detail              | `better-interface`, `better-layout`, `better-typography`, `better-colors`, `better-accessibility`, `color-expert`, `shadcn-ui`                                                                          |
| Efek 2D / generatif    | `shader-dev`, `canvas-design`, `algorithmic-art`, `dither-background`, `progressive-blur`, `css-alpha-masking`, `shaders-cursor-ripples`, `gooey-blob-system`, `liquid-metal-border`, `vfx-text-cursor` |
| 3D                     | `threejs`, `webgl-3d-object`, `3d-metal-material`, `3d-retina-resolution`, `mockup-device-3d`                                                                                                           |
| Gerak & animasi        | `emil-design-eng`, `gsap-core`, `gsap-performance`, `optimize-web-animations`, `text-to-lottie`                                                                                                         |
| Poster & marketing     | `poster-hero`, `pricing-page`, `paywall-upgrade-cro`, `login-flow`                                                                                                                                      |
| Game                   | `ship-web-games`, `test-playable-web-games`                                                                                                                                                             |
| Disiplin kerja         | `iterate-until-verified`, `full-output-enforcement`                                                                                                                                                     |

Sumber & versi skill tercatat di `skills-lock.json` dan `docs/SETUP-TOOLS.md`.
