import { describe, it, expect } from "vitest";
import { generateRequestSchema } from "@/lib/validation/generate-request";
import { RENTAL_DEMO_DATA } from "@/types/rental";
import { POA_DEMO_DATA } from "@/types/power-of-attorney";

describe("generateRequestSchema", () => {
  it("accepts a valid rental request", () => {
    const { error } = generateRequestSchema.validate({ documentType: "rental", data: RENTAL_DEMO_DATA });
    expect(error).toBeUndefined();
  });

  it("accepts a valid power-of-attorney request", () => {
    const { error } = generateRequestSchema.validate({
      documentType: "power-of-attorney",
      data: POA_DEMO_DATA,
    });
    expect(error).toBeUndefined();
  });

  it("rejects an unsupported document type", () => {
    const { error } = generateRequestSchema.validate({ documentType: "will", data: RENTAL_DEMO_DATA });
    expect(error).toBeDefined();
  });

  it("rejects rental data validated against the wrong shape (e.g. POA data sent as rental)", () => {
    const { error } = generateRequestSchema.validate({ documentType: "rental", data: POA_DEMO_DATA });
    expect(error).toBeDefined();
  });

  it("rejects a missing data object", () => {
    const { error } = generateRequestSchema.validate({ documentType: "rental" });
    expect(error).toBeDefined();
  });

  it("rejects an empty payload", () => {
    const { error } = generateRequestSchema.validate({});
    expect(error).toBeDefined();
  });
});
