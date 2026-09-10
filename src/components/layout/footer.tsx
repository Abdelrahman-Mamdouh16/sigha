"use client";

import Link from "next/link";
import { Container } from "./container";
import { useLocale } from "@/components/providers/locale-provider";

export function Footer() {
  const { dict } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-(--color-border) py-10">
      <Container className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-start">
        <div>
          <div className="font-heading text-lg font-semibold text-(--color-ink)">صِيغة</div>
          <p className="mt-1 text-sm text-(--color-ink-muted)">{dict.footer.tagline}</p>
        </div>
        <div className="text-xs text-(--color-ink-faint)">
          <p>
            © {year} صِيغة · Sigha — {dict.footer.rights}
          </p>
          <p className="mt-1">{dict.footer.disclaimerShort}</p>
        </div>
        <nav className="flex gap-5 text-sm text-(--color-ink-muted)">
          <Link href="/documents" className="hover:text-(--color-ink)">
            {dict.nav.documents}
          </Link>
          <Link href="/#about" className="hover:text-(--color-ink)">
            {dict.nav.about}
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
