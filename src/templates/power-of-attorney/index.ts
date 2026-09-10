import type { PoaFormValues } from "@/types/power-of-attorney";
import type { ClauseSlot } from "@/templates/types";

const typeAr: Record<string, string> = { general: "عام", special: "خاص" };

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
}

function powersList(powers: string) {
  return powers
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);
}

export const poaClauseSlots: ClauseSlot<PoaFormValues>[] = [
  {
    id: "scope",
    heading: "البند الأول: نطاق التوكيل وموضوعه",
    instruction: (v) =>
      `صِغ جملة رسمية توضح أن هذا توكيل ${typeAr[v.poa.type]} في نطاق: "${v.poa.scope}"، بخصوص: "${v.poa.matter}". لا تضف أي نطاق أو موضوع آخر.`,
    fallback: (v) =>
      `يُعتبر هذا توكيلاً ${typeAr[v.poa.type]}، في نطاق: ${v.poa.scope}، بخصوص: ${v.poa.matter}.`,
  },
  {
    id: "powers",
    heading: "البند الثاني: الصلاحيات الممنوحة",
    instruction: (v) =>
      `أعد صياغة الصلاحيات التالية فقط بأسلوب قانوني رسمي دون إضافة أي صلاحية جديدة: ${powersList(v.poa.powers).join("؛ ")}.`,
    fallback: (v) => `فوّض الموكل الوكيل في القيام بما يلي: ${powersList(v.poa.powers).join("؛ ")}.`,
  },
  {
    id: "limitations",
    heading: "البند الثالث: القيود على الصلاحيات",
    instruction: (v) =>
      v.poa.limitations
        ? `صِغ جملة رسمية بالقيود التالية فقط دون إضافة: "${v.poa.limitations}".`
        : `اكتب جملة واحدة تفيد بعدم وجود قيود إضافية على الصلاحيات الممنوحة عدا ما ورد صراحة في هذا التوكيل.`,
    fallback: (v) => v.poa.limitations || "لا توجد قيود إضافية على الصلاحيات الممنوحة عدا ما ورد صراحة في هذا التوكيل.",
  },
  {
    id: "duration",
    heading: "البند الرابع: مدة التوكيل",
    instruction: (v) => `اكتب جملة رسمية تفيد بأن مدة هذا التوكيل: "${v.poa.duration}".`,
    fallback: (v) => `مدة هذا التوكيل: ${v.poa.duration}.`,
  },
  {
    id: "revocation",
    heading: "البند الخامس: أحكام عامة",
    instruction: () =>
      `اكتب جملة رسمية عامة تفيد بأن للموكل الحق في عزل الوكيل أو إلغاء هذا التوكيل كتابياً في أي وقت، وأن الوكيل يلتزم بالتصرف في حدود الصلاحيات الممنوحة له فقط.`,
    fallback: () =>
      "للموكل الحق في عزل الوكيل أو إلغاء هذا التوكيل كتابياً في أي وقت، ويلتزم الوكيل بالتصرف في حدود الصلاحيات الممنوحة له في هذا التوكيل دون تجاوزها.",
  },
];

export function buildPoaIntroduction(v: PoaFormValues) {
  return `أقر أنا الموكل: ${v.principal.fullName}، ${v.principal.nationality} الجنسية، ويحمل بطاقة رقم قومي ${v.principal.nationalId}، ومقيم بـ${v.principal.address}، بأنني قد وكّلت عني توكيلاً ${typeAr[v.poa.type]}: ${v.agent.fullName}، ${v.agent.nationality} الجنسية، ويحمل بطاقة رقم قومي ${v.agent.nationalId}، ومقيم بـ${v.agent.address}، وذلك بتاريخ ${fmtDate(v.date)} في ${v.place}، للقيام بما يلي:`;
}

export const poaClosing =
  "أقر الموكل بمضمون هذا التوكيل وبمنح الصلاحيات الواردة فيه للوكيل المذكور، وبالتوقيع أدناه يصبح هذا التوكيل نافذاً.";
