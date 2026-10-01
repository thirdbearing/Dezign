"use client";

import { ChevronUp } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

/**
 * Parameter panel. A fixed right column from md up; on phones a bottom sheet that peeks above
 * the lab bar and opens to half the screen. Content is server-rendered and passed in.
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

  return (
    <aside
      aria-label={title}
      data-open={open}
      className="fixed inset-x-0 bottom-16 z-10 flex max-h-[55dvh] flex-col overflow-hidden border-t border-rule bg-paper transition-[max-height] duration-200 ease-[var(--ease-press)] data-[open=false]:max-h-12 motion-reduce:transition-none md:static md:z-auto md:row-start-2 md:max-h-none md:border-t-0 md:border-l md:data-[open=false]:max-h-none"
    >
      <h2 className="flex h-12 shrink-0 items-center border-b border-rule-soft">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          aria-label={open ? hideLabel : showLabel}
          onClick={() => setOpen((v) => !v)}
          className="flex h-full w-full items-center justify-between px-4 text-left md:pointer-events-none"
        >
          <span className="slug">{title}</span>
          <ChevronUp
            aria-hidden="true"
            size={18}
            strokeWidth={1.75}
            className="transition-transform duration-200 data-[open=true]:rotate-180 md:hidden"
            data-open={open}
          />
        </button>
      </h2>
      <div id={bodyId} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        {children}
      </div>
    </aside>
  );
}
