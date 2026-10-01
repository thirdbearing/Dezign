import { getLocale, getTranslations } from "next-intl/server";
import { LocaleLink as Link } from "./LocaleLink";
import { routing } from "@/i18n/routing";

/** Server-rendered links, no client JS. `path` keeps the user on the same page. */
export async function LocaleSwitch({ path = "/" }: { path?: string }) {
  const locale = await getLocale();
  const t = await getTranslations("studio");

  return (
    <nav aria-label={t("language")} className="flex items-center gap-1">
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={path}
          locale={l}
          aria-current={l === locale ? "true" : undefined}
          className="slug inline-flex min-h-11 min-w-11 items-center justify-center text-ink-faint aria-[current]:text-ink"
        >
          {l}
        </Link>
      ))}
    </nav>
  );
}
