import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

/**
 * The sheet on the press bed. Sized with container units so it always fits the workspace at its
 * own aspect ratio; crop marks and registration targets show the trim edge like a real proof.
 */
export async function Artboard({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) {
  const t = await getTranslations("studio");
  const ratio = width / height;

  return (
    <main className="grain [container-type:size] relative bg-press-bed md:row-start-2">
      <div className="absolute inset-0 grid place-items-center pb-28 md:pb-0">
        <figure className="flex flex-col items-center gap-9">
          <div
            className="relative"
            style={{
              width: `min(100cqw - 4rem, (100cqh - 9rem) * ${ratio})`,
              aspectRatio: `${width} / ${height}`,
            }}
          >
            <CropMarks />
            <div className="[container-type:inline-size] absolute inset-0 overflow-hidden bg-sheet">
              {children}
            </div>
          </div>
          <figcaption className="slug text-ink-soft">
            {width} × {height} · {t("artboard")}
          </figcaption>
        </figure>
      </div>
    </main>
  );
}

/**
 * Corner crop marks (two 12px hairlines per corner, stopping 6px short of the trim) and
 * registration targets centred above and below the sheet.
 */
function CropMarks() {
  const corners = [
    "top-0 left-0 -translate-x-full -translate-y-full",
    "top-0 right-0 translate-x-full -translate-y-full scale-x-[-1]",
    "bottom-0 left-0 -translate-x-full translate-y-full scale-y-[-1]",
    "right-0 bottom-0 translate-x-full translate-y-full scale-[-1]",
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {corners.map((position) => (
        <span key={position} className={`absolute size-[18px] ${position}`}>
          {/* horizontal mark, aligned with the trim's top edge */}
          <span className="absolute right-[6px] bottom-0 h-px w-3 bg-ink" />
          {/* vertical mark, aligned with the trim's left edge */}
          <span className="absolute right-0 bottom-[6px] h-3 w-px bg-ink" />
        </span>
      ))}
      <RegistrationTarget className="top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(100%+6px)]" />
      <RegistrationTarget className="bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%+6px)]" />
    </div>
  );
}

function RegistrationTarget({ className }: { className: string }) {
  return (
    <svg
      viewBox="-9 -9 18 18"
      className={`absolute size-[18px] stroke-ink ${className}`}
      fill="none"
      strokeWidth="1"
    >
      <circle r="5" />
      <path d="M-9 0H9M0-9V9" />
    </svg>
  );
}
