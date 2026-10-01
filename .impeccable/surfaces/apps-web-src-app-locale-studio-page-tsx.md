---
version: 1
slug: "apps-web-src-app-locale-studio-page-tsx"
primary_target: "apps/web/src/app/[locale]/studio/page.tsx"
related_targets: []
---

# Surface: Studio (app shell)

Mode: Operate. Audience: graphic designers/illustrators (PRODUCT.md). Task: pick a lab, work on one artboard, tune parameters, export. Constraints: 360 px first, budgets in docs/PLAN.md §4, id default + en.

## Direction contract

THESIS: Grafish is a riso print room, not a dark pro editor. The category default (graphite panels, one neon accent, everything in floating cards) is refused; the studio is paper, black drum ink, and a few riso inks that mean something.

OWN-WORLD: Paper-white stock ground with a faint printed grain; Riso Black for text and rules; inks Fluorescent Pink, Medium Blue, Yellow (plus Teal, Bright Red for state) used only for layer/drum identity, active state, and alerts, never as large fills around the canvas. Dark theme is black stock printed with white and fluoro ink. Archivo variable: condensed caps for labels and headers, normal width for UI text, tabular figures for every value. Hairline 1px rules, square corners, registration targets and crop marks as functional artboard chrome.

STORY: A designer sees their artboard on paper, picks a lab from the rail, every layer wears its drum colour, values never jump, and export is one obvious action.

FIRST VIEWPORT: Desktop: 48px top strip (wordmark left, project title centre, Export right in black ink); 64px left rail of seven labs; centre artboard on neutral paper with crop marks and registration targets at its corners; 320px right parameter sheet. Mobile 360: top strip, artboard, bottom lab bar, parameter bottom sheet peeking 96px.

FORM: Studio Risograph, impeccable's pick (rank 1 of 7 grounded list), seed key 8bbc2233. Signature interaction: misregistration, active/pressed controls print a 2px offset ink pass behind them; motion is a quick press-in, nothing floats.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- Landing page (Persuade) is a separate surface, later phase; Phase 0 ships only a minimal entry page.
