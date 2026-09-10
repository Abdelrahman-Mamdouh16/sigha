import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/generate/route";
import { RENTAL_DEMO_DATA } from "@/types/rental";
import { POA_DEMO_DATA } from "@/types/power-of-attorney";

function makeRequest(body: unknown, ip = `test-${Math.random()}`) {
  return new NextRequest("http://localhost/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

describe("POST /api/generate", () => {
  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  it("returns a valid document for a valid rental request", async () => {
    const res = await POST(makeRequest({ documentType: "rental", data: RENTAL_DEMO_DATA }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.document.type).toBe("rental");
    expect(json.data.document.sections.length).toBeGreaterThan(0);
  });

  it("returns a valid document for a valid power-of-attorney request", async () => {
    const res = await POST(makeRequest({ documentType: "power-of-attorney", data: POA_DEMO_DATA }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.document.type).toBe("power-of-attorney");
  });

  it("rejects invalid data with 422 and never leaks internal details", async () => {
    const res = await POST(makeRequest({ documentType: "rental", data: { nonsense: true } }));
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("VALIDATION_ERROR");
    expect(JSON.stringify(json)).not.toMatch(/at .*\.ts:\d+/); // no stack traces
  });

  it("rejects malformed JSON with 400", async () => {
    const req = new NextRequest("http://localhost/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": `test-${Math.random()}` },
      body: "{not valid json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects an unsupported document type", async () => {
    const res = await POST(makeRequest({ documentType: "last-will", data: RENTAL_DEMO_DATA }));
    expect(res.status).toBe(422);
  });

  it("enforces the rate limit for a single identifier", async () => {
    const ip = `rate-test-${Math.random()}`;
    let lastStatus = 200;
    for (let i = 0; i < 10; i++) {
      const res = await POST(makeRequest({ documentType: "rental", data: RENTAL_DEMO_DATA }, ip));
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });

  it("rejects an oversized payload", async () => {
    const huge = structuredClone(RENTAL_DEMO_DATA);
    huge.property.description = "أ".repeat(60_000);
    const res = await POST(makeRequest({ documentType: "rental", data: huge }));
    expect(res.status).toBe(413);
  });
});
