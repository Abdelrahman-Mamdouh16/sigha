"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "./container";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";

export function Navbar() {
  const { dict } = useLocale();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/documents", label: dict.nav.documents },
    { href: "/#how-it-works", label: dict.nav.howItWorks },
    { href: "/#about", label: dict.nav.about },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-(--color-border) bg-(--color-paper)/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-heading text-xl font-semibold tracking-tight text-(--color-ink)">
          صِيغة
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-(--color-ink-muted) transition-colors hover:text-(--color-ink)"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/documents">{dict.nav.cta}</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="القائمة"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-(--color-border) md:hidden">
          <Container className="flex flex-col gap-4 py-5">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-(--color-ink)" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <Button asChild>
              <Link href="/documents">{dict.nav.cta}</Link>
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
