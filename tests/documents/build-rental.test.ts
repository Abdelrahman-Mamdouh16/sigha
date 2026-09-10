import { describe, it, expect, beforeEach } from "vitest";
import { buildRentalDocument } from "@/lib/documents/build-rental";
import { RENTAL_DEMO_DATA } from "@/types/rental";
import { documentModelSchema } from "@/lib/validation/document-model";

describe("buildRentalDocument", () => {
  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  it("produces a DocumentModel that passes its own validation schema", async () => {
    const { document } = await buildRentalDocument(RENTAL_DEMO_DATA);
    const { error } = documentModelSchema.validate(document);
    expect(error).toBeUndefined();
  });

  it("has exactly 10 sections matching the fixed rental template", async () => {
    const { document } = await buildRentalDocument(RENTAL_DEMO_DATA);
    expect(document.sections).toHaveLength(10);
  });

  it("omits witnesses entirely when none were provided", async () => {
    const v = structuredClone(RENTAL_DEMO_DATA);
    v.signatures = {};
    const { document } = await buildRentalDocument(v);
    expect(document.witnesses).toHaveLength(0);
  });

  it("states no security deposit was agreed when omitted", async () => {
    const v = structuredClone(RENTAL_DEMO_DATA);
    delete (v.lease as Partial<typeof v.lease>).securityDeposit;
    const { document } = await buildRentalDocument(v);
    const depositSection = document.sections.find((s) => s.heading.includes("التأمين"));
    expect(depositSection?.clauses[0].body).toContain("لم يتفق الطرفان");
  });

  it("handles an unusually long property description without truncation errors", async () => {
    const v = structuredClone(RENTAL_DEMO_DATA);
    v.property.description = "وصف تفصيلي للعقار. ".repeat(15);
    await expect(buildRentalDocument(v)).resolves.toBeDefined();
  });

  it("always includes the AI-assisted disclaimer notice", async () => {
    const { document } = await buildRentalDocument(RENTAL_DEMO_DATA);
    expect(document.notices.length).toBeGreaterThan(0);
  });
});
