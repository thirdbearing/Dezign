"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useId, useState, type ReactNode } from "react";
import { EXPORT_REASON_ID, SHOW_EXPORT_REASON } from "@/lib/studio-events";

/**
 * Parameter panel. A fixed right column from md up. On phones it is a bottom sheet that peeks
 * 96px above the lab bar (header plus the first row of content) and slides up to 55% of the
 * screen. It moves with transform only, so opening it never triggers layout.
 */
export function ParamSheet({
  title,
  showLabel,
  hideLabel,
  children,
}: {
  title: string;
  showLabel: string;
  hideLabel: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();

  // Export asks to explain itself: open the sheet (phones) and mark the reason text.
  useEffect(() => {
    const show = () => {
      setOpen(true);
      const reason = document.getElementById(EXPORT_REASON_ID);
      if (!reason) return;
      reason.focus({ preventScroll: true });
      reason.scrollIntoView({ block: "nearest" });
      reason.removeAttribute("data-flash");
      void reason.offsetWidth; // restart the highlight animation
      reason.setAttribute("data-flash", "");
    };
    window.addEventListener(SHOW_EXPORT_REASON, show);
    return () => window.removeEventListener(SHOW_EXPORT_REASON, show);
  }, []);

  return (
    <aside
      aria-label={title}
      data-open={open}
      className="grain fixed inset-x-0 bottom-16 z-10 flex h-[55dvh] translate-y-[calc(100%-6rem)] flex-col border-t border-rule bg-paper transition-transform duration-200 ease-[var(--ease-press)] data-[open=true]:translate-y-0 motion-reduce:transition-none md:static md:z-auto md:row-start-2 md:h-auto md:translate-y-0 md:border-t-0 md:border-l"
    >
      <h2 className="flex h-12 shrink-0 items-center border-b border-rule-soft">
        {/* Phones: the heading is the sheet's handle. */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          aria-label={open ? hideLabel : showLabel}
          onClick={() => setOpen((v) => !v)}
          className="flex h-full w-full items-center justify-between px-4 text-left md:hidden"
        >
          <span className="slug">{title}</span>
          <ChevronUp
            aria-hidden="true"
            size={18}
            strokeWidth={1.75}
            data-open={open}
            className="transition-transform duration-200 data-[open=true]:rotate-180 motion-reduce:transition-none"
          />
        </button>
        {/* Desktop: the panel is always open, so the heading is plain text. */}
        <span className="slug hidden px-4 md:inline">{title}</span>
      </h2>
      <div id={bodyId} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        {children}
      </div>
    </aside>
  );
}
