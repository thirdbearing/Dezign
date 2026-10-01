import { LocaleLink as Link } from "@/components/LocaleLink";

export default function NotFound() {
  return (
    <main className="grain flex min-h-dvh flex-col items-start justify-center gap-6 px-4 sm:px-8">
      <p className="slug text-ink-soft">404</p>
      <h1 className="text-4xl font-bold">Halaman tidak ditemukan · Page not found</h1>
      <Link href="/" className="underline">
        Grafish
      </Link>
    </main>
  );
}
