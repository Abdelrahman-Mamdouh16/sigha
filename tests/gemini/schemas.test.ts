import { describe, it, expect } from "vitest";
import { buildClausesResponseSchema } from "@/lib/gemini/schemas";

describe("buildClausesResponseSchema", () => {
  it("accepts a response with exactly the requested clause ids", () => {
    const schema = buildClausesResponseSchema(["a", "b"]);
    const { error } = schema.validate({ clauses: { a: "نص أول", b: "نص ثانٍ" } });
    expect(error).toBeUndefined();
  });

  it("rejects a response missing a requested clause id", () => {
    const schema = buildClausesResponseSchema(["a", "b"]);
    const { error } = schema.validate({ clauses: { a: "نص أول" } });
    expect(error).toBeDefined();
  });

  it("rejects an empty clause body", () => {
    const schema = buildClausesResponseSchema(["a"]);
    const { error } = schema.validate({ clauses: { a: "" } });
    expect(error).toBeDefined();
  });

  it("rejects a clause body that is unreasonably long", () => {
    const schema = buildClausesResponseSchema(["a"]);
    const { error } = schema.validate({ clauses: { a: "س".repeat(5000) } });
    expect(error).toBeDefined();
  });

  it("rejects malformed JSON shapes (clauses as a string, not an object)", () => {
    const schema = buildClausesResponseSchema(["a"]);
    const { error } = schema.validate({ clauses: "not an object" });
    expect(error).toBeDefined();
  });

  it("rejects a completely different top-level shape", () => {
    const schema = buildClausesResponseSchema(["a"]);
    const { error } = schema.validate({ unexpected: true });
    expect(error).toBeDefined();
  });
});
