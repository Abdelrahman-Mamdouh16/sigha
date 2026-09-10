import { describe, it, expect, beforeEach } from "vitest";
import { buildPoaDocument } from "@/lib/documents/build-poa";
import { POA_DEMO_DATA } from "@/types/power-of-attorney";
import { documentModelSchema } from "@/lib/validation/document-model";

describe("buildPoaDocument", () => {
  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  it("produces a DocumentModel that passes its own validation schema", async () => {
    const { document } = await buildPoaDocument(POA_DEMO_DATA);
    const { error } = documentModelSchema.validate(document);
    expect(error).toBeUndefined();
  });

  it("never invents powers: the powers clause only reflects what was submitted", async () => {
    const v = structuredClone(POA_DEMO_DATA);
    v.poa.powers = "توقيع مستند واحد محدد فقط";
    const { document } = await buildPoaDocument(v);
    const powersSection = document.sections.find((s) => s.heading.includes("الصلاحيات"));
    expect(powersSection?.clauses[0].body).toContain("توقيع مستند واحد محدد فقط");
  });

  it("states no additional limitations when none were provided", async () => {
    const v = structuredClone(POA_DEMO_DATA);
    delete (v.poa as Partial<typeof v.poa>).limitations;
    const { document } = await buildPoaDocument(v);
    const limitSection = document.sections.find((s) => s.heading.includes("القيود"));
    expect(limitSection?.clauses[0].body).toContain("لا توجد قيود إضافية");
  });
});
