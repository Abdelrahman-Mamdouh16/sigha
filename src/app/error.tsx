"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log server-side-visible details only to the console; never render internals to the user.
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold text-(--color-ink)">حدث خطأ غير متوقع</h1>
      <p className="mt-3 text-(--color-ink-muted)">حاول مرة أخرى، أو ارجع للصفحة الرئيسية.</p>
      <Button className="mt-6" onClick={() => reset()}>
        حاول مرة أخرى
      </Button>
    </Container>
  );
}
