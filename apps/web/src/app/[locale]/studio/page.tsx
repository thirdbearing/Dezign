import { redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { localizedPath, routing } from "@/i18n/routing";

export default async function StudioIndex({ params }: PageProps<"/[locale]/studio">) {
  const { locale } = await params;
  redirect(localizedPath("/studio/effects", hasLocale(routing.locales, locale) ? locale : "id"));
}
