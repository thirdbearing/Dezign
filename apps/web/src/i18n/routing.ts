import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["id", "en"],
  defaultLocale: "id",
  // Indonesian lives at "/", English at "/en".
  localePrefix: "as-needed",
  // Indonesian is the default for everyone; English is an explicit choice, not a guess from
  // Accept-Language.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

/**
 * Localized path for the "as-needed" prefix strategy: Indonesian has no prefix, English gets
 * "/en". Kept as a plain function so nothing from next-intl's client navigation is bundled.
 */
export function localizedPath(href: string, locale: Locale): string {
  if (!href.startsWith("/"))
    throw new Error(`localizedPath expects an absolute path, got "${href}"`);
  if (locale === routing.defaultLocale) return href;
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

/** canonical + hreflang links for one page, in the shape Next's Metadata.alternates expects. */
export function alternatesFor(href: string, locale: Locale) {
  return {
    canonical: localizedPath(href, locale),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, localizedPath(href, l)])),
      "x-default": localizedPath(href, routing.defaultLocale),
    },
  };
}
