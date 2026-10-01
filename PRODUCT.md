# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated, approved via docs/PLAN.md §0: pnpm + Turborepo monorepo, Next.js (App Router) + React + TypeScript strict, Tailwind CSS v4 + shadcn/ui, Zustand, WebGL2 + Web Workers, three.js (lazy), Supabase (Auth Google/GitHub, Postgres + RLS), Cloudflare R2, Xendit for payments. Hosting on Vercel.

## Users

Primary: graphic designers and illustrators who already know design. They come for experimental, non-generic image treatments (dithering, halftone, stippling, ASCII, 3D type) to use in client work, posters, and personal pieces, and they care about output quality and vector export. Secondary audiences (content creators, students) use the same tools, often as guests, but product decisions optimise for the designer.

## Product Purpose

Grafish is a browser studio for making graphic work: posters, image effects, type testing and type effects, patterns, shapes, and 2D/3D effects, with its own font library. Success is a designer finishing a piece entirely inside Grafish and exporting it at the quality they would hand to a client.

## Positioning

The effects are not generic: each one is crafted, distinctive, and high quality, not a preset filter. And everything in the studio is one connected ecosystem: a real 3D model can be placed directly on the poster canvas as a layer, then baked so 2D effects apply to it directly. The output of every lab is a layer every other lab can use.

## Operating Context

Used on desktop for serious work and on phones for quick work, often on Indonesian 4G networks and mid- to low-end Android devices. Guests can use free tools and export free effects up to 1080 px without signing in. Signed-in users (Google or GitHub) spend tokens to export Pro effects, 3D, HD, and vector output.

## Capabilities and Constraints

- Modules: Effects Lab, Poster Studio, Type Lab (library, tester, Text FX, later a font editor), Pattern Lab, Shape Lab, 3D Lab, Playground (tic-tac-toe).
- Previews are always free; tokens are charged only on final export, computed server-side.
- Font library: Google Fonts (OFL/Apache) only, for now.
- Payments: Xendit (QRIS, e-wallets, virtual accounts).
- Language: Bahasa Indonesia by default, English available.
- Undecided (to settle after all phases): token prices and packages, whether a subscription exists alongside tokens, domain.

## Brand Commitments

Name: **Grafish**. No logo or other brand assets exist yet.

## Evidence on Hand

None yet: no users, testimonials, customers, or benchmarks. Do not fabricate any.

## Product Principles

1. Effects are crafted, never generic. A new effect ships only if a designer would choose it over a preset filter.
2. One connected studio. Any lab's output (3D render, pattern, shape, styled text) becomes a layer anywhere else, and 3D can be baked into 2D.
3. Fast is a feature. The studio must feel instant on a mid-range Android phone over 4G.
4. Free to explore, pay to export. Never charge for looking or tweaking.

## Accessibility & Inclusion

Keyboard operable studio, WCAG AA contrast, respects prefers-reduced-motion, bilingual (id, en).
