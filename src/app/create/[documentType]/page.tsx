"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { RentalForm } from "@/components/forms/rental-form";
import { PoaForm } from "@/components/forms/poa-form";
import { GenerationStages } from "@/components/generation/generation-stages";
import type { RentalFormValues } from "@/types/rental";
import type { PoaFormValues } from "@/types/power-of-attorney";
import type { ApiResponse, DocumentModel } from "@/types/document";
import { useLocale } from "@/components/providers/locale-provider";

type Phase = "form" | "generating" | "error";

const TITLES: Record<string, string> = { rental: "عقد إيجار", "power-of-attorney": "توكيل" };

export default function CreateDocumentPage() {
  const params = useParams<{ documentType: string }>();
  const documentType = params.documentType;
  const router = useRouter();
  const { dict } = useLocale();

  const [phase, setPhase] = useState<Phase>("form");
  const [stageIndex, setStageIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  if (documentType !== "rental" && documentType !== "power-of-attorney") {
    return (
      <>
        <Navbar />
        <Container className="py-24 text-center">
          <h1 className="text-2xl font-bold text-(--color-ink)">{dict.errors.notFound}</h1>
          <p className="mt-2 text-(--color-ink-muted)">{dict.errors.notFoundBody}</p>
          <Button asChild className="mt-6">
            <a href="/documents">{dict.errors.goHome}</a>
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  async function submit(data: RentalFormValues | PoaFormValues) {
    const storageKey = documentType === "rental" ? "sigha:formdata:rental" : "sigha:formdata:poa";
    sessionStorage.setItem(storageKey, JSON.stringify(data));

    setPhase("generating");
    setStageIndex(0);
    timerRef.current = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, dict.generation.stages.length - 2));
    }, 650);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType, data }),
      });
      const json = (await res.json()) as ApiResponse<{ document: DocumentModel; aiUsed: boolean }>;

      if (timerRef.current) clearInterval(timerRef.current);
      setStageIndex(dict.generation.stages.length - 1);

      if (!json.success) {
        setTimeout(() => setPhase("error"), 300);
        return;
      }

      sessionStorage.setItem("sigha:lastDocument", JSON.stringify(json.data.document));
      sessionStorage.setItem("sigha:lastDocumentAiUsed", String(json.data.aiUsed));
      setTimeout(() => router.push("/preview"), 350);
    } catch {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase("error");
    }
  }

  return (
    <>
      <Navbar />
      <main className="py-12 sm:py-16">
        <Container className="max-w-3xl">
          {phase === "form" && (
            <>
              <h1 className="mb-8 text-2xl font-bold text-(--color-ink)">{TITLES[documentType]}</h1>
              {documentType === "rental" ? <RentalForm onGenerate={submit} /> : <PoaForm onGenerate={submit} />}
            </>
          )}

          {phase === "generating" && <GenerationStages activeIndex={stageIndex} />}

          {phase === "error" && (
            <div className="mx-auto max-w-sm py-16 text-center">
              <AlertTriangle className="mx-auto h-10 w-10 text-(--color-danger)" />
              <h2 className="mt-4 text-lg font-semibold text-(--color-ink)">{dict.generation.failedTitle}</h2>
              <p className="mt-2 text-sm text-(--color-ink-muted)">{dict.errors.generic}</p>
              <Button className="mt-6" onClick={() => setPhase("form")}>
                {dict.generation.retry}
              </Button>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
