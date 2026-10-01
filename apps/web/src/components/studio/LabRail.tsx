import { Box, Contrast, Hash, LayoutGrid, PenTool, RectangleVertical, Type } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { LABS, type LabId } from "@/lib/labs";

const ICONS: Record<LabId, typeof Box> = {
  effects: Contrast,
  poster: RectangleVertical,
  type: Type,
  pattern: LayoutGrid,
  shape: PenTool,
  "3d": Box,
  play: Hash,
};

/** Left rail on desktop, bottom bar on phones. Plain links: no client JS. */
export async function LabRail({ active }: { active: LabId }) {
  const t = await getTranslations();

  return (
    <nav
      aria-label={t("studio.nav")}
      className="grain relative z-20 order-last row-start-3 border-t border-rule bg-paper md:order-none md:row-start-2 md:border-t-0 md:border-r"
    >
      <ul className="flex h-full items-stretch justify-between overflow-x-auto md:flex-col md:justify-start md:gap-1 md:overflow-visible md:py-3">
        {LABS.map((lab) => {
          const Icon = ICONS[lab.id];
          const current = lab.id === active;
          return (
            <li key={lab.id} className="flex-1 md:flex-none">
              <Link
                href={`/studio/${lab.id}`}
                aria-current={current ? "page" : undefined}
                className="group flex h-full min-h-11 flex-col items-center justify-center gap-1 px-1 text-ink-soft focus-visible:-outline-offset-2 aria-[current=page]:text-ink md:h-16"
              >
                <span
                  className="misregister grid size-8 place-items-center group-aria-[current=page]:bg-ink group-aria-[current=page]:text-on-ink"
                  data-active={current || undefined}
                >
                  <Icon aria-hidden="true" size={18} strokeWidth={1.75} />
                </span>
                <span className="slug text-[0.625rem]">{t(`labs.${lab.id}.name`)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
