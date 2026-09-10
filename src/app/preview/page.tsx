"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Pencil, FilePlus2, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { DocumentPreview } from "@/components/document-preview/document-preview";
import { useLocale } from "@/components/providers/locale-provider";
import type { DocumentModel } from "@/types/document";

export default function PreviewPage() {
  const router = useRouter();
  const { dict } = useLocale();
  const [document, setDocument] = useState<DocumentModel | null | undefined>(undefined);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("sigha:lastDocument");
    if (!raw) {
      // sessionStorage is only available after mount; this is a one-time read to
      // hydrate a value React can't know at SSR time, not a reaction to state changing.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDocument(null);
      return;
    }
    try {
      setDocument(JSON.parse(raw));
    } catch {
      setDocument(null);
    }
  }, []);

  async function downloadPdf() {
    if (!document) return;
    setDownloading(true);
    setDownloadError(false);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(document),
      });
      if (!res.ok) throw new Error("pdf failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = `sigha-${document.type}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError(true);
    } finally {
      setDownloading(false);
    }
  }

  function editDetails() {
    if (document) router.push(`/create/${document.type}`);
  }

  function startOver() {
    sessionStorage.removeItem("sigha:lastDocument");
    sessionStorage.removeItem("sigha:formdata:rental");
    sessionStorage.removeItem("sigha:formdata:poa");
    router.push("/documents");
  }

  return (
    <>
     
      <main className="py-10 sm:py-14">
        <Container>
          {document === undefined && <div className="py-24 text-center text-(--color-ink-muted)">{dict.common.loading}</div>}

          {document === null && (
            <div className="mx-auto max-w-sm py-24 text-center">
              <p className="text-(--color-ink-muted)">{dict.errors.notFoundBody}</p>
              <Button className="mt-6" onClick={() => router.push("/documents")}>
                {dict.errors.goHome}
              </Button>
            </div>
          )}

          {document && (
            <>
              <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-(--color-ink)">{dict.preview.heading}</h1>
                <div className="flex flex-wrap gap-2.5">
                  <Button variant="secondary" onClick={editDetails}>
                    <Pencil className="h-4 w-4" />
                    {dict.common.edit}
                  </Button>
                  <Button variant="ghost" onClick={startOver}>
                    <FilePlus2 className="h-4 w-4" />
                    {dict.common.startOver}
                  </Button>
                  <Button onClick={downloadPdf} disabled={downloading}>
                    {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {dict.common.download}
                  </Button>
                </div>
              </div>

              {downloadError && (
                <p className="no-print mb-4 rounded-md bg-(--color-danger-soft) px-4 py-2.5 text-sm text-(--color-danger)">
                  {dict.errors.pdfFailed}
                </p>
              )}

              <p className="no-print mb-6 text-sm text-(--color-ink-muted)">{dict.preview.disclaimer}</p>

              <DocumentPreview document={document} />
            </>
          )}
        </Container>
      </main>
     
    </>
  );
}
