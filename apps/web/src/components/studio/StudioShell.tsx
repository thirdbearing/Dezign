import { getTranslations } from "next-intl/server";
import { LABS, type LabId } from "@/lib/labs";
import { Artboard } from "./Artboard";
import { LabRail } from "./LabRail";
import { ParamSheet } from "./ParamSheet";
import { TopStrip } from "./TopStrip";

const ARTBOARD = { width: 1080, height: 1350 };

export async function StudioShell({ lab }: { lab: LabId }) {
  const t = await getTranslations();
  const phase = LABS.find((l) => l.id === lab)?.phase ?? 0;

  return (
    <div className="grid h-dvh grid-cols-1 grid-rows-[48px_minmax(0,1fr)_64px] overflow-hidden md:grid-cols-[76px_minmax(0,1fr)_320px] md:grid-rows-[48px_minmax(0,1fr)]">
      <TopStrip lab={lab} artboard={ARTBOARD} />
      <LabRail active={lab} />
      <Artboard {...ARTBOARD}>
        <div className="flex h-full flex-col justify-between p-[6%] text-[#121212]">
          <p className="slug text-[#4a4a48]">{t(`labs.${lab}.name`)}</p>
          <div className="space-y-3">
            <p className="text-[clamp(1.25rem,4.2cqw,2.75rem)] leading-[1.05] font-bold text-balance">
              {t(`labs.${lab}.blurb`)}
            </p>
            <p className="slug text-[#4a4a48]">{t("studio.arrives", { phase })}</p>
          </div>
        </div>
      </Artboard>
      <ParamSheet
        title={t("studio.params")}
        showLabel={t("studio.showParams")}
        hideLabel={t("studio.hideParams")}
      >
        <div className="space-y-4">
          <p className="text-xl leading-tight font-bold">{t(`labs.${lab}.name`)}</p>
          <p className="text-ink-soft">{t("studio.notYet")}</p>
          <dl className="divide-y divide-rule-soft border-y border-rule-soft">
            <div className="flex items-baseline justify-between py-2">
              <dt className="slug text-ink-faint">{t("studio.phase")}</dt>
              <dd className="font-semibold">{phase}</dd>
            </div>
            <div className="flex items-baseline justify-between py-2">
              <dt className="slug text-ink-faint">{t("studio.artboard")}</dt>
              <dd className="font-semibold">
                {ARTBOARD.width} × {ARTBOARD.height}
              </dd>
            </div>
          </dl>
          <p className="text-sm text-ink-soft">{t("studio.exportSoon")}</p>
        </div>
      </ParamSheet>
    </div>
  );
}
