/**
 * A two-drum riso proof: a halftone ramp in the lab's drum overprinted with a black ramp running
 * the other way, half a cell off register. It sits on the artboard, the one place riso ink may
 * fill an area, since that is artwork and not interface chrome.
 */

const COLS = 12;
const ROWS = 10;
const CELL = 10;

/** Identity inks. Teal and bright red exist in the token set but are reserved for state. */
const DRUMS = {
  pink: "#ff48b0",
  blue: "#3255a4",
  yellow: "#ffe800",
} as const;

export type IdentityDrum = keyof typeof DRUMS;

function ramp(axis: "x" | "y", reverse: boolean, offset: number) {
  const dots: string[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const along = axis === "x" ? (col + 0.5) / COLS : (row + 0.5) / ROWS;
      const t = reverse ? 1 - along : along;
      // Dot area, not radius, carries tone, as on a real screen.
      const r = (CELL / 2) * 0.98 * Math.sqrt(t);
      if (r < 0.35) continue;
      const cx = col * CELL + CELL / 2 + offset;
      const cy = row * CELL + CELL / 2 + offset;
      dots.push(
        `M${(cx - r).toFixed(2)} ${cy.toFixed(2)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2 * r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2 * r).toFixed(2)} 0`,
      );
    }
  }
  return dots.join("");
}

// Computed once per server process; the paths are identical for every lab.
const DRUM_RAMP = ramp("x", false, 0);
const BLACK_RAMP = ramp("y", true, CELL / 2);

export function HalftoneProof({ drum }: { drum: IdentityDrum }) {
  return (
    <svg
      viewBox={`0 0 ${COLS * CELL + CELL / 2} ${ROWS * CELL + CELL / 2}`}
      className="block w-full"
      aria-hidden="true"
    >
      <path d={DRUM_RAMP} fill={DRUMS[drum]} />
      <path d={BLACK_RAMP} fill="#121212" style={{ mixBlendMode: "multiply" }} />
    </svg>
  );
}
