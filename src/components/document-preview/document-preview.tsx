import type { DocumentModel } from "@/types/document";

export function DocumentPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[210mm] overflow-hidden rounded-sm border border-(--color-border) bg-white shadow-[var(--shadow-card)]">
      <div className="min-h-[297mm] px-8 py-12 text-neutral-900 sm:px-14 sm:py-16" dir="rtl">
        {children}
      </div>
    </div>
  );
}

export function DocumentPreview({ document }: { document: DocumentModel }) {
  const dateLabel = new Date(document.date).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <DocumentPage>
      <h1 className="text-center font-heading text-2xl font-bold">{document.title}</h1>
      <p className="mt-2 text-center text-xs text-neutral-500">
        {document.place} — {dateLabel}
      </p>

      <p className="mt-8 text-justify text-sm leading-8">{document.introduction}</p>

      <div className="mt-6 space-y-1.5 text-sm">
        {document.parties.map((p) => (
          <div key={p.role}>
            <span className="font-semibold">{p.role}:</span> {p.name}
            {p.details ? ` — ${p.details}` : ""}
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        {document.sections.map((section) => (
          <section key={section.heading} className="break-inside-avoid">
            <h2 className="text-sm font-bold">{section.heading}</h2>
            {section.clauses.map((c, ci) => (
              <p key={ci} className="mt-1.5 text-justify text-sm leading-8">
                {c.body}
              </p>
            ))}
          </section>
        ))}
      </div>

      <p className="mt-10 text-justify text-sm leading-8">{document.closing}</p>

      <div className="mt-14 flex flex-wrap justify-between gap-8">
        {document.signatures.map((s) => (
          <div key={s.role} className="min-w-[10rem] flex-1">
            <div className="h-10 border-t border-neutral-400" />
            <div className="mt-1.5 text-xs font-semibold">{s.role}</div>
            <div className="text-xs text-neutral-600">{s.name}</div>
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
                <div className="mt-1.5 text-xs font-semibold">{w.role}</div>
                <div className="text-xs text-neutral-600">{w.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {document.notices.length > 0 && (
        <div className="mt-12 border-t border-dashed border-neutral-300 pt-4 text-center text-[0.7rem] text-neutral-500">
          {document.notices.map((n, i) => (
            <p key={i}>{n}</p>
          ))}
        </div>
      )}
    </DocumentPage>
  );
}
