"use client";

import Link from "next/link";
import { ListChecks, PenLine, Sparkles, FileDown, ShieldCheck, Globe, MousePointerClick } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";

const stepIcons = [ListChecks, PenLine, Sparkles, FileDown];
const whyIcons = [Globe, ShieldCheck, MousePointerClick];

export function HowItWorksSection() {
  const { dict } = useLocale();
  return (
    <section id="how-it-works" className="border-t border-(--color-border) bg-(--color-soft-green)/40 py-16 sm:py-20 scroll-mt-16">
      <Container>
        <h2 className="mb-10 text-3xl font-bold text-(--color-ink)">{dict.howItWorks.heading}</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {dict.howItWorks.steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <div key={step.title}>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-(--color-deep) text-(--color-paper-raised)">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-(--color-ink)">{step.title}</h3>
                <p className="mt-1.5 text-sm text-(--color-ink-muted)">{step.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function WhySighaSection() {
  const { dict } = useLocale();
  return (
    <section id="about" className="py-16 sm:py-20 scroll-mt-16">
      <Container>
        <h2 className="mb-10 text-3xl font-bold text-(--color-ink)">{dict.whySigha.heading}</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {dict.whySigha.points.map((p, i) => {
            const Icon = whyIcons[i];
            return (
              <div key={p.title}>
                <Icon className="h-6 w-6 text-(--color-gold)" />
                <h3 className="mt-3 font-semibold text-(--color-ink)">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-(--color-ink-muted)">{p.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function TrustSection() {
  const { dict } = useLocale();
  return (
    <section className="py-10 scroll-mt-16">
      <Container>
        <div className="rounded-[var(--radius-card)] border border-(--color-border) bg-(--color-paper-raised) p-7">
          <h3 className="text-sm font-semibold text-(--color-ink)">{dict.trust.heading}</h3>
          <p className="mt-2 text-sm leading-relaxed text-(--color-ink-muted)">{dict.trust.body}</p>
        </div>
      </Container>
    </section>
  );
}

export function CtaSection() {
  const { dict } = useLocale();
  return (
    <section className="py-16 sm:py-20 scroll-mt-16">
      <Container className="flex flex-col items-center gap-5 rounded-[var(--radius-card)] bg-(--color-deep) px-8 py-14 text-center">
        <h2 className="text-2xl font-bold text-(--color-paper-raised) sm:text-3xl">{dict.cta.heading}</h2>
        <Button asChild size="lg" variant="gold">
          <Link href="/documents">{dict.cta.button}</Link>
        </Button>
      </Container>
    </section>
  );
}
