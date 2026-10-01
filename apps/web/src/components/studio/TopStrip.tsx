import { getTranslations } from "next-intl/server";
import { LocaleLink as Link } from "@/components/LocaleLink";
import type { LabId } from "@/lib/labs";
import { LocaleSwitch } from "../LocaleSwitch";
import { Wordmark } from "../Wordmark";
import { ExportButton } from "./ExportButton";

export async function TopStrip({
  lab,
  artboard,
}: {
  lab: LabId;
  artboard: { width: number; height: number };
}) {
  const t = await getTranslations("studio");

  return (
    <header className="grain col-span-full flex items-center gap-3 border-b border-rule bg-paper pl-3 md:gap-4 md:pl-4">
      <Link href="/" className="shrink-0 text-[1.375rem]">
        <Wordmark />
      </Link>
      <div className="flex min-w-0 flex-1 items-baseline gap-3 md:justify-center">
        <span className="truncate font-semibold">{t("untitled")}</span>
        <span className="slug hidden text-ink-faint sm:inline">
          {artboard.width} × {artboard.height}
        </span>
      </div>
      <LocaleSwitch path={`/studio/${lab}`} />
      <ExportButton label={t("export")} />
    </header>
  );
}
