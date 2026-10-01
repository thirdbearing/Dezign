import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternatesFor, type Locale } from "@/i18n/routing";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { Wordmark } from "@/components/Wordmark";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: { absolute: t("title") }, alternates: alternatesFor("/", locale as Locale) };
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  // No grain on this page: it holds the < 1.8 s LCP budget (PLAN §4), and grain costs ~0.6 s.

  return (
    <main className="min-h-dvh bg-paper">
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 py-6 sm:px-8 sm:py-10">
        <header className="flex items-center justify-between border-b border-rule pb-3">
          <span className="slug text-ink-soft">{t("status")}</span>
          <LocaleSwitch />
        </header>

        <section className="flex flex-1 flex-col justify-center gap-8 py-16">
          <h1 className="text-[clamp(4.5rem,22vw,15rem)]">
            <Wordmark />
          </h1>
          <p className="max-w-[38ch] text-lg leading-snug text-balance text-ink sm:text-xl">
            {t("lede")}
          </p>
          <div>
            <Link
              href="/studio/effects"
              className="misregister inline-flex min-h-12 items-center bg-ink px-6 text-base font-semibold text-on-ink"
            >
              {t("open")}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
