# Setup tools agent (skills, plugin, MCP)

## 1. Sudah terpasang di repo (`.claude/skills/`, `.claude/agents/`)

| Sumber                                       | Skill yang dipasang                                                                                                                                                                                                                                                                                                                                          | Catatan                                                                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `npx skills add Leonxlnx/taste-skill`        | design-taste-frontend, high-end-visual-design, minimalist-ui, redesign-existing-projects, full-output-enforcement                                                                                                                                                                                                                                            | Skill imagegen-* tidak dipasang (hanya menghasilkan gambar, bukan kode)                                          |
| `npx impeccable install`                     | impeccable + 4 agent (`.claude/agents/impeccable-*`)                                                                                                                                                                                                                                                                                                         | Binary 16 MB di-gitignore. Jalankan ulang `npx impeccable install -y --project --providers=claude` di mesin baru |
| `npx skills add diffusionstudio/lottie`      | text-to-lottie                                                                                                                                                                                                                                                                                                                                               |                                                                                                                  |
| `npx skills add nutlope/hallmark`            | hallmark                                                                                                                                                                                                                                                                                                                                                     |                                                                                                                  |
| `nexu-io/open-design`                        | threejs, shader-dev, canvas-design, algorithmic-art, poster-hero, color-expert, gsap-core, gsap-performance, login-flow, paywall-upgrade-cro, shadcn-ui, web-design-guidelines, emil-design-eng, mockup-device-3d, vfx-text-cursor                                                                                                                           | Repo ini berisi >150 skill. Hanya yang relevan yang dipasang agar konteks agent tetap ringan                     |
| `MengTo/Skills` (MIT, commit `d5bd3a7`)      | no-ai-design-slop, audit-ai-design-slop, design-first-ui-prompting, optimize-web-animations, iterate-until-verified, dither-background, progressive-blur, css-alpha-masking, shaders-cursor-ripples, webgl-3d-object, gooey-blob-system, liquid-metal-border, pricing-page, 3d-metal-material, 3d-retina-resolution, ship-web-games, test-playable-web-games | Disalin manual; aset gambar demo dihapus (±10 MB)                                                                |
| `jakubkrehel/skills` (MIT, commit `267330e`) | better-typography, better-colors, better-layout, better-accessibility, better-interface, interface-review                                                                                                                                                                                                                                                    | Disalin manual                                                                                                   |

Update skill dari `npx skills`: `npx skills update -p -y`.

## 2. Perlu Anda aktifkan sendiri

Agent tidak diizinkan mengubah konfigurasinya sendiri (`.claude/settings.json`, `.mcp.json`), jadi bagian ini perlu Anda jalankan.

### Opsi A: lewat chat Claude Code (interaktif)

```
/plugin install skill-creator@claude-plugins-official
/plugin install superpowers@claude-plugins-official
/plugin install frontend-design@claude-plugins-official
/plugin marketplace add mksglu/context-mode
/plugin install context-mode@context-mode
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem@thedotmack
/plugin marketplace add codeswithroh/tastemaker
/plugin install tastemaker@codeswithroh
/plugin marketplace add Owl-Listener/designer-skills
/plugin install ui-design@designer-skills
/plugin install interaction-design@designer-skills
/plugin install design-systems@designer-skills
/plugin install visual-critique@designer-skills
/plugin install accessibility-decisions@designer-skills
```

Lalu, untuk MCP inspirasi desain: `npx -y inspo-mcp install`.

### Opsi B: simpan di repo (berlaku untuk semua sesi, termasuk cloud)

Buat `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "claude-plugins-official": {
      "source": { "source": "github", "repo": "anthropics/claude-plugins-official" }
    },
    "context-mode": { "source": { "source": "github", "repo": "mksglu/context-mode" } },
    "thedotmack": { "source": { "source": "github", "repo": "thedotmack/claude-mem" } },
    "codeswithroh": { "source": { "source": "github", "repo": "codeswithroh/tastemaker" } },
    "designer-skills": { "source": { "source": "github", "repo": "Owl-Listener/designer-skills" } }
  },
  "enabledPlugins": {
    "skill-creator@claude-plugins-official": true,
    "superpowers@claude-plugins-official": true,
    "frontend-design@claude-plugins-official": true,
    "context-mode@context-mode": true,
    "claude-mem@thedotmack": true,
    "tastemaker@codeswithroh": true,
    "ui-design@designer-skills": true,
    "interaction-design@designer-skills": true,
    "design-systems@designer-skills": true,
    "visual-critique@designer-skills": true,
    "accessibility-decisions@designer-skills": true
  }
}
```

Lalu buat `.mcp.json`:

```json
{ "mcpServers": { "inspo": { "type": "http", "url": "https://inspomcp.dev/api/mcp" } } }
```

**Hook impeccable:** installer menaruh hook pemeriksa desain (setelah Edit/Write dan saat Stop) di `.claude/settings.local.json`. File itu bersifat lokal dan tidak di-commit. Kalau Anda ingin hook ini aktif untuk semua orang/sesi, pindahkan blok `"hooks"` dari file itu ke `.claude/settings.json`.

Catatan: `claude-mem` menjalankan worker latar belakang di setiap sesi. Kalau sesi terasa berat, nonaktifkan plugin ini dulu.
