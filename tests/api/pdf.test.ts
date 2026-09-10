import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/pdf/route";
import { buildRentalDocument } from "@/lib/documents/build-rental";
import { RENTAL_DEMO_DATA } from "@/types/rental";

function makeRequest(body: unknown, ip = `test-${Math.random()}`) {
  return new NextRequest("http://localhost/api/pdf", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

describe("POST /api/pdf", () => {
  it("returns a real application/pdf response for a valid document", async () => {
    const { document } = await buildRentalDocument(RENTAL_DEMO_DATA);
    const res = await POST(makeRequest(document));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    const buf = Buffer.from(await res.arrayBuffer());
    expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
  }, 30000);

  it("rejects a malformed document with 422", async () => {
    const res = await POST(makeRequest({ nonsense: true }));
    expect(res.status).toBe(422);
  });

  it("rejects an unsupported document type", async () => {
    const { document } = await buildRentalDocument(RENTAL_DEMO_DATA);
    const res = await POST(makeRequest({ ...document, type: "invoice" }));
    expect(res.status).toBe(422);
  });
});
