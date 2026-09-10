"use client";

import Link from "next/link";
import { FileSignature, Home, Lock } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/components/providers/locale-provider";

export default function DocumentsPage() {
  const { dict } = useLocale();
  const t = dict.documentTypes;

  return (
    <>
     
      <main className="py-14 sm:py-20">
        <Container>
          <div className="mb-10 max-w-lg">
            <h1 className="text-3xl font-bold text-(--color-ink)">{dict.documentsPage.heading}</h1>
            <p className="mt-3 text-(--color-ink-muted)">{dict.documentsPage.sub}</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/documents/rental">
              <Card className="h-full transition-shadow hover:shadow-lg">
                <CardContent className="p-7">
                  <Home className="h-7 w-7 text-(--color-deep)" />
                  <h2 className="mt-4 text-lg font-semibold text-(--color-ink)">{t.rental.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-(--color-ink-muted)">{t.rental.description}</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/documents/power-of-attorney">
              <Card className="h-full transition-shadow hover:shadow-lg">
                <CardContent className="p-7">
                  <FileSignature className="h-7 w-7 text-(--color-deep)" />
                  <h2 className="mt-4 text-lg font-semibold text-(--color-ink)">{t.poa.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-(--color-ink-muted)">{t.poa.description}</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="h-full opacity-60">
              <CardContent className="p-7">
                <Lock className="h-7 w-7 text-(--color-ink-faint)" />
                <h2 className="mt-4 text-lg font-semibold text-(--color-ink-muted)">{t.comingSoon}</h2>
                <p className="mt-2 text-sm leading-relaxed text-(--color-ink-faint)">
                  عقد بيع، عقد عمل، إقرار — قريباً.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </main>
     
    </>
  );
}
