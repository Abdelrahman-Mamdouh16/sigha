import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/validation/rate-limit";

describe("checkRateLimit", () => {
  it("allows the first several requests from a fresh identifier", () => {
    const id = `test-${Math.random()}`;
    for (let i = 0; i < 8; i++) {
      expect(checkRateLimit(id).allowed).toBe(true);
    }
  });

  it("blocks once the limit is exceeded within the window", () => {
    const id = `test-${Math.random()}`;
    for (let i = 0; i < 8; i++) checkRateLimit(id);
    const result = checkRateLimit(id);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks separate identifiers independently", () => {
    const idA = `a-${Math.random()}`;
    const idB = `b-${Math.random()}`;
    for (let i = 0; i < 8; i++) checkRateLimit(idA);
    expect(checkRateLimit(idA).allowed).toBe(false);
    expect(checkRateLimit(idB).allowed).toBe(true);
  });
});
