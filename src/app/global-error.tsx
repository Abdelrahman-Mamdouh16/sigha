"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ fontFamily: "sans-serif", textAlign: "center", padding: "4rem 1rem" }}>
        <h1>حدث خطأ غير متوقع</h1>
        <p>حاول مرة أخرى.</p>
        <button onClick={() => reset()}>حاول مرة أخرى</button>
      </body>
    </html>
  );
}
