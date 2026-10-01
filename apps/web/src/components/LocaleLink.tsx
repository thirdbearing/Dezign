import NextLink from "next/link";
import type { ComponentProps } from "react";
import { getLocale } from "next-intl/server";
import { localizedPath, type Locale } from "@/i18n/routing";

/**
 * Server-side localized link. next-intl's own <Link> is a client component that needs the intl
 * provider and its runtime (~10 KB gz); resolving the path on the server keeps that off the page.
 */
export async function LocaleLink({
  href,
  locale,
  ...props
}: Omit<ComponentProps<typeof NextLink>, "href" | "locale"> & { href: string; locale?: Locale }) {
  const target = locale ?? ((await getLocale()) as Locale);
  return <NextLink href={localizedPath(href, target)} {...props} />;
}
