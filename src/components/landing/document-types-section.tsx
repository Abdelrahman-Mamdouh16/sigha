"use client";

import Link from "next/link";
import { FileSignature, Home, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { useLocale } from "@/components/providers/locale-provider";

export function DocumentTypesSection() {
  const { dict } = useLocale();
  const t = dict.documentTypes;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mb-10 max-w-lg">
          <h2 className="text-3xl font-bold text-(--color-ink)">{t.heading}</h2>
          <p className="mt-3 text-(--color-ink-muted)">{t.sub}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/documents/rental">
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardContent className="p-7">
                <Home className="h-7 w-7 text-(--color-deep)" />
                <h3 className="mt-4 text-lg font-semibold text-(--color-ink)">{t.rental.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-(--color-ink-muted)">{t.rental.description}</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/documents/power-of-attorney">
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardContent className="p-7">
                <FileSignature className="h-7 w-7 text-(--color-deep)" />
                <h3 className="mt-4 text-lg font-semibold text-(--color-ink)">{t.poa.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-(--color-ink-muted)">{t.poa.description}</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="h-full opacity-60">
            <CardContent className="p-7">
              <Lock className="h-7 w-7 text-(--color-ink-faint)" />
              <h3 className="mt-4 text-lg font-semibold text-(--color-ink-muted)">{t.comingSoon}</h3>
              <p className="mt-2 text-sm leading-relaxed text-(--color-ink-faint)">
                عقد بيع، عقد عمل، إقرار — قريباً.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
