import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StudioShell } from "@/components/studio/StudioShell";
import { alternatesFor, type Locale } from "@/i18n/routing";
import { LABS, isLabId } from "@/lib/labs";

export function generateStaticParams() {
  return LABS.map((lab) => ({ lab: lab.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/studio/[lab]">): Promise<Metadata> {
  const { locale, lab } = await params;
  if (!isLabId(lab)) return {};
  const t = await getTranslations({ locale, namespace: "labs" });
  return {
    title: `${t(`${lab}.name`)} · Studio`,
    alternates: alternatesFor(`/studio/${lab}`, locale as Locale),
  };
}

export default async function LabPage({ params }: PageProps<"/[locale]/studio/[lab]">) {
  const { locale, lab } = await params;
  if (!isLabId(lab)) notFound();
  setRequestLocale(locale);
  return <StudioShell lab={lab} />;
}
