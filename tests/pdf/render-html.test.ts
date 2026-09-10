import { describe, it, expect } from "vitest";
import { renderDocumentHtml } from "@/lib/pdf/render-html";
import type { DocumentModel } from "@/types/document";

const baseDoc: DocumentModel = {
  id: "1",
  type: "rental",
  title: "عقد إيجار",
  place: "القاهرة",
  date: "2026-09-10",
  introduction: "مقدمة العقد",
  parties: [{ role: "المؤجر", name: "أحمد محمد" }],
  sections: [{ heading: "البند الأول", clauses: [{ body: "نص البند الأول" }] }],
  closing: "خاتمة العقد",
  signatures: [{ role: "المؤجر", name: "أحمد محمد" }],
  witnesses: [{ role: "الشاهد الأول", name: "سارة" }],
  notices: ["هذه مسودة مولدة بمساعدة الذكاء الاصطناعي"],
  generatedAt: new Date().toISOString(),
};

describe("renderDocumentHtml", () => {
  it("includes the document title and RTL direction", () => {
    const html = renderDocumentHtml(baseDoc);
    expect(html).toContain("عقد إيجار");
    expect(html).toContain('dir="rtl"');
  });

  it("embeds the Arabic font as a base64 data URI (no external font dependency at render time)", () => {
    const html = renderDocumentHtml(baseDoc);
    expect(html).toMatch(/data:font\/ttf;base64,[A-Za-z0-9+/=]{100,}/);
  });

  it("HTML-escapes user-supplied data to prevent markup injection", () => {
    const malicious = structuredClone(baseDoc);
    malicious.parties[0].name = '<script>alert("xss")</script>';
    const html = renderDocumentHtml(malicious);
    expect(html).not.toContain("<script>alert");
    expect(html).toContain("&lt;script&gt;");
  });

  it("renders every clause section and the closing statement", () => {
    const html = renderDocumentHtml(baseDoc);
    expect(html).toContain("البند الأول");
    expect(html).toContain("خاتمة العقد");
  });

  it("renders witnesses only when present", () => {
    const withoutWitnesses = { ...baseDoc, witnesses: [] };
    const html = renderDocumentHtml(withoutWitnesses);
    expect(html).not.toContain("الشهود");
  });
});
