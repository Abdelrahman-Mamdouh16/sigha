import type { DocumentModel } from "@/types/document";

function toArabicDigits(value: string | number) {
  return String(value).replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]);
}

export function DocumentPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto w-full max-w-[210mm] overflow-hidden rounded-sm border border-(--color-border) bg-white shadow-[var(--shadow-card)]">
        <div
          className="min-h-[297mm] px-8 py-12 text-neutral-900 sm:px-14 sm:py-16"
          dir="rtl"
        >
          {children}
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-neutral-500">
        هذه مسودة مولدة بمساعدة الذكاء الاصطناعي، ويُنصح بمراجعتها من مختص
        قانوني قبل استخدامها.
      </p>
    </>
  );
}

export function DocumentPreview({ document }: { document: DocumentModel }) {
  const dateLabel = toArabicDigits(
    new Date(document.date).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  );

  return (
    <DocumentPage>
      <h1 className="text-center font-heading text-2xl font-bold">
        {toArabicDigits(document.title)}
      </h1>

      <p className="mt-2 text-center text-xs text-neutral-500">
        {toArabicDigits(document.place)} — {dateLabel}
      </p>

      <p className="mt-8 text-justify text-sm leading-8">
        {toArabicDigits(document.introduction)}
      </p>

      <div className="mt-6 space-y-1.5 text-sm">
        {document.parties.map((p) => (
          <div key={p.role}>
            <span className="font-semibold">{toArabicDigits(p.role)}:</span>{" "}
            {toArabicDigits(p.name)}
            {p.details ? ` — ${toArabicDigits(p.details)}` : ""}
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        {document.sections.map((section) => (
          <section key={section.heading} className="break-inside-avoid">
            <h2 className="text-sm font-bold">
              {toArabicDigits(section.heading)}
            </h2>

            {section.clauses.map((c, ci) => (
              <p key={ci} className="mt-1.5 text-justify text-sm leading-8">
                {toArabicDigits(c.body)}
              </p>
            ))}
          </section>
        ))}
      </div>

      <p className="mt-10 text-justify text-sm leading-8">
        {toArabicDigits(document.closing)}
      </p>

      <div className="mt-14 flex flex-wrap justify-between gap-8">
        {document.signatures.map((s) => (
          <div key={s.role} className="min-w-[10rem] flex-1">
            <div className="h-10 border-t border-neutral-400" />
            <div className="mt-1.5 text-xs font-semibold">
              {toArabicDigits(s.role)}
            </div>
            <div className="text-xs text-neutral-600">
              {toArabicDigits(s.name)}
            </div>
          </div>
        ))}
      </div>

      {document.witnesses.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xs font-semibold text-neutral-500">الشهود</h3>

          <div className="mt-3 flex flex-wrap justify-between gap-8">
            {document.witnesses.map((w) => (
              <div key={w.role} className="min-w-[10rem] flex-1">
                <div className="h-8 border-t border-neutral-400" />

                <div className="mt-1.5 text-xs font-semibold">
                  {toArabicDigits(w.role)}
                </div>

                <div className="text-xs text-neutral-600">
                  {toArabicDigits(w.name)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DocumentPage>
  );
}
