import { describe, it, expect } from "vitest";
import { rentalSchema } from "@/schemas/rental";
import { RENTAL_DEMO_DATA } from "@/types/rental";

describe("rentalSchema", () => {
  it("accepts the demo data as-is", () => {
    const { error } = rentalSchema.validate(RENTAL_DEMO_DATA);
    expect(error).toBeUndefined();
  });

  it("rejects a missing required field", () => {
    const bad = structuredClone(RENTAL_DEMO_DATA);
    // @ts-expect-error intentionally invalid for the test
    delete bad.landlord.fullName;
    const { error } = rentalSchema.validate(bad);
    expect(error).toBeDefined();
  });

  it("rejects when the end date is before the start date", () => {
    const bad = structuredClone(RENTAL_DEMO_DATA);
    bad.lease.startDate = "2027-01-01";
    bad.lease.endDate = "2026-01-01";
    const { error } = rentalSchema.validate(bad);
    expect(error).toBeDefined();
  });

  it("rejects negative rent", () => {
    const bad = structuredClone(RENTAL_DEMO_DATA);
    bad.lease.rentAmount = -100;
    const { error } = rentalSchema.validate(bad);
    expect(error).toBeDefined();
  });

  it("rejects an unreasonably huge rent value", () => {
    const bad = structuredClone(RENTAL_DEMO_DATA);
    bad.lease.rentAmount = 999_999_999;
    const { error } = rentalSchema.validate(bad);
    expect(error).toBeDefined();
  });

  it("rejects an invalid date string", () => {
    const bad = structuredClone(RENTAL_DEMO_DATA);
    bad.contractDate = "not-a-date";
    const { error } = rentalSchema.validate(bad);
    expect(error).toBeDefined();
  });

  it("accepts a zero security deposit and treats it as valid", () => {
    const ok = structuredClone(RENTAL_DEMO_DATA);
    ok.lease.securityDeposit = 0;
    const { error } = rentalSchema.validate(ok);
    expect(error).toBeUndefined();
  });

  it("allows the security deposit to be omitted (optional field missing)", () => {
    const ok = structuredClone(RENTAL_DEMO_DATA);
    delete (ok.lease as Partial<typeof ok.lease>).securityDeposit;
    const { error } = rentalSchema.validate(ok);
    expect(error).toBeUndefined();
  });

  it("rejects an extremely long free-text field", () => {
    const bad = structuredClone(RENTAL_DEMO_DATA);
    bad.property.description = "أ".repeat(5000);
    const { error } = rentalSchema.validate(bad);
    expect(error).toBeDefined();
  });

  it("accepts a long but valid mixed Arabic/English/number address", () => {
    const ok = structuredClone(RENTAL_DEMO_DATA);
    ok.landlord.address = "Building 12A, شارع التسعين الشمالي، التجمع الخامس، القاهرة الجديدة، مصر 11835";
    const { error } = rentalSchema.validate(ok);
    expect(error).toBeUndefined();
  });

  it("rejects a payment due day outside 1-28", () => {
    const bad = structuredClone(RENTAL_DEMO_DATA);
    bad.lease.paymentDueDay = 30;
    const { error } = rentalSchema.validate(bad);
    expect(error).toBeDefined();
  });

  it("rejects an unknown property type", () => {
    const bad = structuredClone(RENTAL_DEMO_DATA);
    // @ts-expect-error intentionally invalid for the test
    bad.property.type = "palace";
    const { error } = rentalSchema.validate(bad);
    expect(error).toBeDefined();
  });
});
