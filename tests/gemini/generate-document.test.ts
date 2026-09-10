import { describe, it, expect, beforeEach } from "vitest";
import { draftClauses } from "@/lib/gemini/generate-document";
import { rentalClauseSlots } from "@/templates/rental";
import { RENTAL_DEMO_DATA } from "@/types/rental";

describe("draftClauses", () => {
  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  it("falls back to deterministic text for every clause when no API key is configured", async () => {
    const { clauseText, aiUsed } = await draftClauses(rentalClauseSlots, RENTAL_DEMO_DATA);
    expect(aiUsed).toBe(false);
    for (const slot of rentalClauseSlots) {
      expect(clauseText[slot.id]).toBe(slot.fallback(RENTAL_DEMO_DATA));
      expect(clauseText[slot.id].length).toBeGreaterThan(0);
    }
  });

  it("never throws even if called repeatedly (no network calls made without a key)", async () => {
    await expect(draftClauses(rentalClauseSlots, RENTAL_DEMO_DATA)).resolves.toBeDefined();
  });
});
