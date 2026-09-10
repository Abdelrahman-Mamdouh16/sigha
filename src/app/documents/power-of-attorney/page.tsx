"use client";

import Link from "next/link";
import { FileSignature, Check } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";

export default function PoaIntroPage() {
  const { dict } = useLocale();
  const points = [
    "بيانات الموكل والوكيل",
    "نوع التوكيل ونطاقه وموضوعه",
    "الصلاحيات الممنوحة للوكيل والقيود عليها",
    "مراجعة نهائية قبل إنشاء المسودة",
  ];

  return (
    <>
     
      <main className="py-16 sm:py-24">
        <Container className="max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-soft-green)">
            <FileSignature className="h-7 w-7 text-(--color-deep)" />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-(--color-ink)">{dict.documentTypes.poa.title}</h1>
          <p className="mt-3 text-(--color-ink-muted)">{dict.documentTypes.poa.description}</p>

          <ul className="mx-auto mt-8 max-w-sm space-y-2.5 text-start">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-(--color-ink)">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-(--color-deep)" />
                {p}
              </li>
            ))}
          </ul>

          <Button asChild size="lg" className="mt-9">
            <Link href="/create/power-of-attorney">{dict.documentTypes.start}</Link>
          </Button>
        </Container>
      </main>
     
    </>
  );
}
