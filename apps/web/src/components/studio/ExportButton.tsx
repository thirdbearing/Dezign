"use client";

import { EXPORT_REASON_ID, SHOW_EXPORT_REASON } from "@/lib/studio-events";

/**
 * Export, while no lab can export yet. It stays focusable (aria-disabled, not disabled) and wears a
 * screen tint, the way a riso proof marks an inactive area. Activating it reveals the reason
 * instead of doing nothing.
 */
export function ExportButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-disabled="true"
      aria-describedby={EXPORT_REASON_ID}
      onClick={() => window.dispatchEvent(new Event(SHOW_EXPORT_REASON))}
      className="screen-tint h-full shrink-0 cursor-not-allowed border-l border-rule px-4 font-semibold text-ink-soft focus-visible:-outline-offset-4 md:px-6"
    >
      <span className="bg-paper px-1">{label}</span>
    </button>
  );
}
