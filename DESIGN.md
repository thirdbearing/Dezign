---
name: Grafish
description: A riso print room in the browser. Paper stock, black drum ink, and a few riso inks that mean something.
colors:
  paper: "#f7f7f4"
  press-bed: "#e4e3df"
  sheet: "#ffffff"
  ink: "#121212"
  ink-soft: "#4a4a48"
  ink-faint: "#686763"
  rule-soft: "#c9c8c3"
  riso-pink: "#ff48b0"
  riso-blue: "#3255a4"
  riso-yellow: "#ffe800"
  riso-teal: "#00838a"
  riso-red: "#f15060"
  paper-dark: "#161615"
  press-bed-dark: "#0c0c0c"
  ink-dark: "#f2f1ec"
  ink-soft-dark: "#b9b8b2"
  ink-faint-dark: "#8e8d88"
  rule-soft-dark: "#3a3a38"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(4.5rem, 22vw, 15rem)"
    fontWeight: 900
    lineHeight: 0.82
    letterSpacing: "-0.01em"
    fontVariation: '"wdth" 62'
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
    fontVariation: '"wdth" 100'
    fontFeature: '"tnum" 1'
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
    fontVariation: '"wdth" 100'
    fontFeature: '"tnum" 1'
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontVariation: '"wdth" 100'
    fontFeature: '"tnum" 1'
  lede:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.375
    fontVariation: '"wdth" 100'
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
    fontVariation: '"wdth" 62'
    fontFeature: '"tnum" 1'
rounded:
  none: "0"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  top-strip: "48px"
  rail: "64px"
  sheet-peek: "96px"
  param-sheet: "320px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  button-unavailable:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  lab-rail-item:
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "64px"
    width: "64px"
  lab-rail-item-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    size: "32px"
  locale-link:
    textColor: "{colors.ink-faint}"
    typography: "{typography.label}"
    size: "44px"
  locale-link-current:
    textColor: "{colors.ink}"
  param-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "16px"
    width: "320px"
  artboard-sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
---

# Design System: Grafish

## Overview

**Creative North Star: "The Riso Print Room"**

Grafish is a print room, not a dark pro editor. The interface is paper stock and black drum ink: hairline rules, square corners, condensed caps slugs, and a faint printed tooth on every chrome surface. The user's artboard sits on a grey press bed with crop marks and registration targets at its trim, so the work reads as a proof on a sheet, and the chrome around it stays quiet enough never to compete with it.

Riso inks are a vocabulary, not a decoration. Fluorescent pink, medium blue and yellow mark identity (a lab's drum, the wordmark's passes, the misregistered state); teal and bright red are held back for state and alerts. Ink appears in the chrome only as small marks, hairline offsets and highlighter passes; the only place ink fills an area is the artboard, because that is artwork. The dark theme is black stock printed with white and fluorescent ink, not a graphite editor.

Motion is a quick press-in, nothing floats. The signature interaction is misregistration: a current, hovered or pressed control prints a second ink pass 2px off register, the way a real drum lands slightly off on the sheet. The rejected default is the category's graphite panels with one neon accent and everything floating in cards.

**Key Characteristics:**

- Paper ground (light) or black stock (dark), one black/white ink for text and rules.
- Three identity inks plus two state inks; inks never flood chrome.
- Archivo variable only: condensed caps for labels, normal width for UI text, tabular figures everywhere.
- Square corners, 1px rules, no soft shadows, no floating cards.
- Misregistration as the single hard-offset device; halftone screen tint for unavailable.
- Functional print marks: crop marks, registration targets, slugs.

## Colors

A neutral stock and ink pair carries every surface; five riso inks carry meaning in small doses.

### Primary

- **Riso Black** (ink): all text, 1px structural rules, crop marks, registration targets, and the one filled action (primary button, current lab tile). On dark it inverts to **Press White** (ink-dark).

### Secondary

- **Fluorescent Pink** (riso-pink): identity ink. First misregister pass, first wordmark pass, a lab drum. Focus ring on the dark theme.
- **Medium Blue** (riso-blue): identity ink. Second misregister pass on light, second wordmark pass, a lab drum. Focus ring on the light theme.
- **Riso Yellow** (riso-yellow): identity ink. A lab drum, the text-selection pass on light, the highlighter flash that points at text, and the second misregister pass on dark.

### Tertiary

- **Teal** (riso-teal) and **Bright Red** (riso-red): reserved for state and alerts. Not used as lab identity and not yet used in the shipped chrome. Neither reaches 4.5:1 on paper (teal 4.3:1, red 3.2:1), so they mark with bars, dots, rules or fills behind ink text, never as small text colour.

### Neutral

- **Paper Stock** (paper): the chrome ground (top strip, lab rail, parameter sheet, entry page) and the text colour on filled ink (on-ink).
- **Press Bed** (press-bed): the workspace around the artboard, one step darker than paper so the sheet lifts without a shadow.
- **Sheet White** (sheet): the default artboard, white in both themes because it is the user's paper.
- **Soft Ink** (ink-soft): secondary text and inactive lab labels (8.4:1 on paper).
- **Faint Ink** (ink-faint): tertiary slugs, inactive locale, scrollbar thumb (5.3:1 on paper; the floor for any text).
- **Soft Rule** (rule-soft): internal dividers inside a panel (definition-list rows, the sheet header rule). Structural boundaries between regions use full ink.
- Dark theme stock: **Black Stock** (paper-dark), **Dark Press Bed** (press-bed-dark), **Press White** (ink-dark), **Soft Press White** (ink-soft-dark), **Faint Press White** (ink-faint-dark), **Dark Soft Rule** (rule-soft-dark). Themes switch by prefers-color-scheme and by an explicit theme attribute; both carry identical values.

### Named Rules

**The Drum Identity Rule.** Identity is printed in pink, blue and yellow only. Seven labs share three drums, so drums repeat by design; never pull teal or red into identity to make them unique.

**The Ink-Is-Artwork Rule.** Riso inks never fill large areas of the chrome. Ink at scale is allowed only on the artboard, because that is artwork. In the chrome, ink is a 1-2px pass, a small mark, or a transient highlighter.

**The Focus Swap Rule.** Focus is a 2px outline in blue on light stock and pink on dark stock, offset 2px (inset where the control is flush to an edge).

## Typography

**Display Font:** Archivo variable (with ui-sans-serif, system-ui, sans-serif), self-hosted, clipped to wght 400-900 and wdth 62-100, Latin subset.
**Body Font:** Archivo variable, same file.
**Label Font:** Archivo variable at its condensed width.

**Character:** One grotesque in two widths. Condensed heavy caps are the printer's slug and the masthead; normal-width Archivo is the working voice. Tabular figures are on globally so values never jump.

### Hierarchy

- **Display** (900, clamp(4.5rem, 22vw, 15rem), 0.82, condensed caps): the wordmark only. The same treatment prints at 1.375rem in the top strip.
- **Headline** (700, 1.25rem, 1.25): the current lab name at the head of the parameter sheet.
- **Title** (600, 1rem): project title, values in definition lists, button text.
- **Body** (400, 1rem, 1.5): sheet copy. Secondary copy at 0.875rem in Soft Ink.
- **Lede** (400, 1.125rem to 1.25rem, 1.375, max 38ch): the entry page statement.
- **Label / Slug** (700, 0.75rem, 1, 0.06em, uppercase, wdth 62): panel titles, definition terms, dimensions, captions, locale codes, status.

### Named Rules

**The Two Widths Rule.** Condensed caps (wdth 62) are for slugs, labels and the wordmark; everything a user reads as a sentence is normal width (wdth 100). Never set running text condensed.

**The Steady Figures Rule.** Tabular figures are on globally. Dimensions, phases and parameter values must not reflow as they change.

## Layout

The studio is a fixed full-viewport grid that never scrolls as a page. Desktop (768px and up): a 48px top strip across the full width; below it a 64px lab rail, a fluid press bed, and a 320px parameter sheet. Phones (from 360px): top strip, press bed, and a 64px bottom lab bar; the parameter sheet becomes a bottom sheet anchored above the lab bar that peeks 96px (its header plus the first row) and slides up to 55% of the screen.

The artboard is sized with container units so it always fits the press bed at its own aspect ratio, leaving room for its print marks and caption. On phones the press bed reserves bottom space so the peeking sheet never covers the artboard.

Spacing follows a 4px step: 4 and 8 inside controls and list rows, 12 and 16 between elements and as panel padding, 24 for button inset and wide gaps. Touch targets are at least 44px. The entry page is a single centred column (max 72rem) with 16px gutters on phones and 32px from 640px.

**The Peek Rule.** The mobile parameter sheet peeks 96px and moves with transform only; opening it never triggers layout.

## Elevation & Depth

Flat. Depth comes from stock and ink, not light: the press bed is a tone darker than paper, the white sheet sits on it, and regions are separated by 1px ink rules. Texture is the printed grain: two fractal-noise speck masks (dark and light) over each chrome surface and the press bed, decorative and never intercepting input.

### Shadow Vocabulary

- **Misregister rest-on** (`box-shadow: -2px -1px 0 0 pink, 2px 1px 0 0 blue`): hover and current state on controls that carry the device. On dark the second pass is yellow.
- **Misregister pressed** (`box-shadow: -1px 0 0 0 pink, 1px 0 0 0 blue` with a 1px translate): active press.

### Named Rules

**The One Offset Rule.** Misregistration, a 2px offset ink pass, is the only hard-offset shadow allowed, and only on hover, active and current states. No resting offset shadows, no soft ambient shadows.

**The Grain Budget Rule.** Grain lives on the chrome and the press bed, never on the entry page, which holds a sub-1.8s LCP budget.

## Shapes

Square everywhere (0 radius). Boundaries are 1px hairlines: full ink between regions, soft rule inside a panel. The artboard is framed by print marks rather than a border: at each corner two 12px hairlines stopping 6px short of the trim, and an 18px registration target (a 5-unit circle crossed by hairlines) centred above and below the sheet. Icons are 18px line icons at 1.75 stroke. The favicon repeats the wordmark logic: pink and blue squares off register under a black square.

## Components

### Buttons

Printed, flat, decisive.

- **Shape:** square (0).
- **Primary:** a solid Riso Black slab with paper text, 48px tall, 24px inset, semibold. It is the one filled ink area the chrome allows.
- **Hover / Active:** misregistration (see Elevation); press-in on active. Transitions run 160ms on the press curve and switch off under reduced motion.
- **Unavailable:** the halftone screen tint (a 4px black-dot screen over paper) with the label on a paper patch in Soft Ink, aria-disabled and still focusable, never natively disabled. Activating it reveals the reason: on phones the sheet opens, the reason text takes focus and gets a yellow highlighter pass.

### Navigation

- **Lab rail:** seven labs as a 64px column on desktop and an evenly divided bottom bar on phones. Each item is a 32px icon tile above a condensed caps label, in Soft Ink.
- **Current lab:** the tile fills Riso Black with paper icon and carries misregistration at rest; its label goes to full ink.
- **Locale switch:** two condensed caps codes, 44px targets, Faint Ink inactive, full ink current.

### Cards / Containers

- **Parameter sheet:** paper, square, 1px ink boundary toward the press bed, a 48px header carrying the slug title over a soft rule, 16px padding. On phones the header is the sheet's handle with a chevron that turns 180 degrees when open.
- **Definition rows:** soft-rule dividers top and bottom, 8px vertical padding, slug term left in Faint Ink, semibold value right.

### Artboard (signature)

A sheet on the press bed with crop marks, registration targets, and a slug caption (dimensions and preset) below. Placeholder proofs print a two-drum halftone: the lab's identity ink overprinted with a black ramp running the other way, half a cell off register, multiplied.

### Wordmark (signature)

"Grafish" in condensed 900 caps printed three times: pink and blue passes slightly off register under black ink (multiply on light, screen on dark).

## Do's and Don'ts

### Do:

- **Do** keep chrome in paper and ink; let pink, blue and yellow appear only as drum identity, misregister passes, focus, selection and highlighter.
- **Do** repeat drums across labs; three identity inks for seven labs is the design.
- **Do** mark unavailable actions with the halftone screen tint and aria-disabled, and reveal the reason when activated.
- **Do** set slugs as condensed caps (wdth 62, 700, 0.75rem, 0.06em) and all sentences at normal width, with tabular figures.
- **Do** use 1px rules and square corners; full ink between regions, soft rule within a panel.
- **Do** keep text at or above Faint Ink (5.3:1 on paper).
- **Do** move the mobile sheet with transform only and keep motion to a quick press-in on the press curve (cubic-bezier(0.16, 1, 0.3, 1)), disabled under reduced motion.

### Don't:

- **Don't** fill large chrome areas with riso ink; ink at scale belongs on the artboard.
- **Don't** use teal or bright red for identity, and don't set either as small text on paper.
- **Don't** use native disabled on actions that need an explanation.
- **Don't** add hard-offset shadows other than misregistration, and never show misregistration at rest except on the current item.
- **Don't** add rounded corners, soft shadows, or floating cards.
- **Don't** put grain on the entry page.
- **Don't** set running text condensed or in caps.
