import { describe, it, expect } from "vitest";
import { poaSchema } from "@/schemas/power-of-attorney";
import { POA_DEMO_DATA } from "@/types/power-of-attorney";

describe("poaSchema", () => {
  it("accepts the demo data as-is", () => {
    const { error } = poaSchema.validate(POA_DEMO_DATA);
    expect(error).toBeUndefined();
  });

  it("rejects a missing national ID", () => {
    const bad = structuredClone(POA_DEMO_DATA);
    // @ts-expect-error intentionally invalid for the test
    delete bad.agent.nationalId;
    const { error } = poaSchema.validate(bad);
    expect(error).toBeDefined();
  });

  it("rejects an unknown poa type", () => {
    const bad = structuredClone(POA_DEMO_DATA);
    // @ts-expect-error intentionally invalid for the test
    bad.poa.type = "unlimited";
    const { error } = poaSchema.validate(bad);
    expect(error).toBeDefined();
  });

  it("allows limitations to be omitted", () => {
    const ok = structuredClone(POA_DEMO_DATA);
    delete (ok.poa as Partial<typeof ok.poa>).limitations;
    const { error } = poaSchema.validate(ok);
    expect(error).toBeUndefined();
  });

  it("rejects an empty powers field", () => {
    const bad = structuredClone(POA_DEMO_DATA);
    bad.poa.powers = "";
    const { error } = poaSchema.validate(bad);
    expect(error).toBeDefined();
  });
});
