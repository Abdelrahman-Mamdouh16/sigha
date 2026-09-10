"use client";

import Link from "next/link";
import { FileText, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { useLocale } from "@/components/providers/locale-provider";

export function Hero() {
  const { dict, dir } = useLocale();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-(--color-border-strong) bg-(--color-paper-raised) px-3.5 py-1.5 text-xs text-(--color-ink-muted)">
            {dict.hero.eyebrow}
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.2] text-(--color-ink) sm:text-5xl">
            {dict.hero.heading}
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-(--color-ink-muted)">{dict.hero.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/documents">
                {dict.hero.ctaPrimary}
                <Arrow className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="#how-it-works">{dict.hero.ctaSecondary}</Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-(--color-soft-green)" aria-hidden />
          <div className="rounded-2xl border border-(--color-border) bg-(--color-paper-raised) p-7 shadow-[var(--shadow-card)]">
            <div className="mb-5 flex items-center justify-between">
              <FileText className="h-5 w-5 text-(--color-gold)" />
              <span className="font-heading text-sm text-(--color-ink-faint)">صِيغة</span>
            </div>
            <div className="h-3.5 w-2/3 rounded bg-(--color-ink) opacity-90" />
            <div className="mt-5 space-y-2.5">
              <div className="h-2 w-full rounded bg-(--color-border-strong)" />
              <div className="h-2 w-11/12 rounded bg-(--color-border-strong)" />
              <div className="h-2 w-4/5 rounded bg-(--color-border-strong)" />
            </div>
            <div className="mt-6 h-2.5 w-1/3 rounded bg-(--color-gold-soft)" />
            <div className="mt-3 space-y-2.5">
              <div className="h-2 w-full rounded bg-(--color-border-strong)" />
              <div className="h-2 w-10/12 rounded bg-(--color-border-strong)" />
            </div>
            <div className="mt-6 h-2.5 w-1/3 rounded bg-(--color-gold-soft)" />
            <div className="mt-3 space-y-2.5">
              <div className="h-2 w-full rounded bg-(--color-border-strong)" />
              <div className="h-2 w-9/12 rounded bg-(--color-border-strong)" />
            </div>
            <div className="mt-8 flex justify-between gap-6">
              <div className="h-8 flex-1 rounded border-t border-(--color-border-strong)" />
              <div className="h-8 flex-1 rounded border-t border-(--color-border-strong)" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
