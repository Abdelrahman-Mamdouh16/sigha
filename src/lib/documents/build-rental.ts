import "server-only";
import { randomUUID } from "crypto";
import type { RentalFormValues } from "@/types/rental";
import type { DocumentModel } from "@/types/document";
import { rentalClauseSlots, buildRentalIntroduction, rentalClosing } from "@/templates/rental";
import { draftClauses } from "@/lib/gemini/generate-document";

export async function buildRentalDocument(v: RentalFormValues): Promise<{ document: DocumentModel; aiUsed: boolean }> {
  const { clauseText, aiUsed } = await draftClauses(rentalClauseSlots, v);

  const document: DocumentModel = {
    id: randomUUID(),
    type: "rental",
    title: "عقد إيجار",
    place: v.placeOfContract,
    date: v.contractDate,
    introduction: buildRentalIntroduction(v),
    parties: [
      { role: "المؤجر (الطرف الأول)", name: v.landlord.fullName, details: v.landlord.address },
      { role: "المستأجر (الطرف الثاني)", name: v.tenant.fullName, details: v.tenant.address },
    ],
    sections: rentalClauseSlots.map((slot) => ({
      heading: slot.heading,
      clauses: [{ body: clauseText[slot.id] ?? slot.fallback(v) }],
    })),
    closing: rentalClosing,
    signatures: [
      { role: "الطرف الأول (المؤجر)", name: v.landlord.fullName },
      { role: "الطرف الثاني (المستأجر)", name: v.tenant.fullName },
    ],
    witnesses: [
      ...(v.signatures.witness1 ? [{ role: "الشاهد الأول", name: v.signatures.witness1 }] : []),
      ...(v.signatures.witness2 ? [{ role: "الشاهد الثاني", name: v.signatures.witness2 }] : []),
    ],
    // notices: ["هذه مسودة مولدة بمساعدة الذكاء الاصطناعي، ويُنصح بمراجعتها من مختص قانوني قبل استخدامها."],
    generatedAt: new Date().toISOString(),
  };

  return { document, aiUsed };
}
