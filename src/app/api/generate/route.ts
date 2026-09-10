import { NextRequest, NextResponse } from "next/server";
import { generateRequestSchema } from "@/lib/validation/generate-request";
import { checkRateLimit } from "@/lib/validation/rate-limit";
import { buildRentalDocument } from "@/lib/documents/build-rental";
import { buildPoaDocument } from "@/lib/documents/build-poa";
import type { ApiResponse } from "@/types/document";
import type { RentalFormValues } from "@/types/rental";
import type { PoaFormValues } from "@/types/power-of-attorney";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BODY_BYTES = 50_000;

function errorResponse(code: string, message: string, status: number): NextResponse {
  const body: ApiResponse<never> = { success: false, error: { code, message } };
  return NextResponse.json(body, { status });
}

export async function POST(req: NextRequest) {
  // --- abuse protection: size limit ---
  const rawBody = await req.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return errorResponse("PAYLOAD_TOO_LARGE", "Request body is too large.", 413);
  }

  // --- abuse protection: rate limit ---
  const identifier =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const rate = checkRateLimit(identifier);
  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, error: { code: "RATE_LIMITED", message: "Too many requests." } } satisfies ApiResponse<never>,
      { status: 429, headers: rate.retryAfterSeconds ? { "Retry-After": String(rate.retryAfterSeconds) } : {} }
    );
  }

  // --- parse ---
  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return errorResponse("INVALID_JSON", "Request body must be valid JSON.", 400);
  }

  // --- validate (never trust the client, even after client-side validation) ---
  const { error, value } = generateRequestSchema.validate(parsedBody, { abortEarly: false });
  if (error) {
    return errorResponse("VALIDATION_ERROR", "The submitted data did not pass validation.", 422);
  }

  const { documentType, data } = value as { documentType: "rental" | "power-of-attorney"; data: unknown };

  try {
    if (documentType === "rental") {
      const { document, aiUsed } = await buildRentalDocument(data as RentalFormValues);
      return NextResponse.json({ success: true, data: { document, aiUsed } } satisfies ApiResponse<unknown>);
    } else {
      const { document, aiUsed } = await buildPoaDocument(data as PoaFormValues);
      return NextResponse.json({ success: true, data: { document, aiUsed } } satisfies ApiResponse<unknown>);
    }
  } catch (err) {
    // Log server-side only; never leak stack traces or internals to the client.
    console.error("generate route failed", err);
    return errorResponse("GENERATION_FAILED", "Could not generate the document.", 500);
  }
}
