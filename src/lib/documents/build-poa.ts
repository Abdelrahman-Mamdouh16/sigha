import "server-only";
import { randomUUID } from "crypto";
import type { PoaFormValues } from "@/types/power-of-attorney";
import type { DocumentModel } from "@/types/document";
import { poaClauseSlots, buildPoaIntroduction, poaClosing } from "@/templates/power-of-attorney";
import { draftClauses } from "@/lib/gemini/generate-document";

export async function buildPoaDocument(v: PoaFormValues): Promise<{ document: DocumentModel; aiUsed: boolean }> {
  const { clauseText, aiUsed } = await draftClauses(poaClauseSlots, v);

  const document: DocumentModel = {
    id: randomUUID(),
    type: "power-of-attorney",
    title: "توكيل",
    place: v.place,
    date: v.date,
    introduction: buildPoaIntroduction(v),
    parties: [
      { role: "الموكل", name: v.principal.fullName, details: v.principal.address },
      { role: "الوكيل", name: v.agent.fullName, details: v.agent.address },
    ],
    sections: poaClauseSlots.map((slot) => ({
      heading: slot.heading,
      clauses: [{ body: clauseText[slot.id] ?? slot.fallback(v) }],
    })),
    closing: poaClosing,
    signatures: [
      { role: "الموكل", name: v.principal.fullName },
      { role: "الوكيل", name: v.agent.fullName },
    ],
    witnesses: [],
    notices: ["هذه مسودة مولدة بمساعدة الذكاء الاصطناعي، ويُنصح بمراجعتها من مختص قانوني قبل استخدامها."],
    generatedAt: new Date().toISOString(),
  };

  return { document, aiUsed };
}
