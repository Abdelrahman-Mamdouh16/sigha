import { describe, it, expect } from "vitest";
import { documentModelSchema } from "@/lib/validation/document-model";

const validDoc = {
  id: "abc123",
  type: "rental",
  title: "عقد إيجار",
  place: "القاهرة",
  date: "2026-09-10",
  introduction: "مقدمة",
  parties: [{ role: "المؤجر", name: "أحمد" }],
  sections: [{ heading: "البند الأول", clauses: [{ body: "نص البند" }] }],
  closing: "خاتمة",
  signatures: [{ role: "المؤجر", name: "أحمد" }],
  witnesses: [],
  notices: ["إخلاء مسؤولية"],
  generatedAt: new Date().toISOString(),
};

describe("documentModelSchema", () => {
  it("accepts a well-formed document", () => {
    const { error } = documentModelSchema.validate(validDoc);
    expect(error).toBeUndefined();
  });

  it("rejects an unknown document type (defends /api/pdf against arbitrary payloads)", () => {
    const bad = { ...validDoc, type: "something-else" };
    const { error } = documentModelSchema.validate(bad);
    expect(error).toBeDefined();
  });

  it("rejects a document with zero sections", () => {
    const bad = { ...validDoc, sections: [] };
    const { error } = documentModelSchema.validate(bad);
    expect(error).toBeDefined();
  });

  it("rejects an oversized field (abuse protection)", () => {
    const bad = { ...validDoc, introduction: "أ".repeat(10000) };
    const { error } = documentModelSchema.validate(bad);
    expect(error).toBeDefined();
  });

  it("strips unknown extra fields rather than failing (stripUnknown at call site)", () => {
    const withExtra = { ...validDoc, hacked: "<script>alert(1)</script>" };
    const { error, value } = documentModelSchema.validate(withExtra, { stripUnknown: true });
    expect(error).toBeUndefined();
    expect(value.hacked).toBeUndefined();
  });
});
