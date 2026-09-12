import { NextRequest, NextResponse } from "next/server";
import { documentModelSchema } from "@/lib/validation/document-model";
import { checkRateLimit } from "@/lib/validation/rate-limit";
import { generateDocumentPdf } from "@/lib/pdf/generate-pdf";
import type { ApiResponse } from "@/types/document";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BODY_BYTES = 60_000;

function errorResponse(
  code: string,
  message: string,
  status: number,
): NextResponse {
  const body: ApiResponse<never> = { success: false, error: { code, message } };
  return NextResponse.json(body, { status });
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return errorResponse(
      "PAYLOAD_TOO_LARGE",
      "Request body is too large.",
      413,
    );
  }

  const identifier =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const rate = checkRateLimit(identifier);
  if (!rate.allowed) {
    return errorResponse("RATE_LIMITED", "Too many requests.", 429);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return errorResponse(
      "INVALID_JSON",
      "Request body must be valid JSON.",
      400,
    );
  }

  const { error, value } = documentModelSchema.validate(parsed, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: error.details.map((detail) => ({
            field: detail.path.join("."),
            message: detail.message,
          })),
        },
      },
      { status: 422 },
    );
  }

  try {
    const pdfBuffer = await generateDocumentPdf(value);
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="sigha-${value.type}.pdf"`,
      },
    });
  } catch (err) {
    console.error("pdf route failed", err);
    return errorResponse("PDF_FAILED", "Could not generate the PDF.", 500);
  }
}
