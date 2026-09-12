import type { RentalFormValues } from "@/types/rental";
import type { ClauseSlot } from "@/templates/types";

export type { ClauseSlot };

const propertyTypeAr: Record<string, string> = {
  residential: "سكني",
  commercial: "تجاري",
  other: "أخرى",
};

const frequencyAr: Record<string, string> = {
  monthly: "شهرياً",
  quarterly: "كل ثلاثة أشهر",
  yearly: "سنوياً",
};

const paymentMethodLabels: Record<string, string> = {
  cash: "الدفع نقداً",
  bank_transfer: "التحويل البنكي",
  credit_card: "البطاقة الائتمانية",
};

export function toArabicDigits(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]);
}

function arabicText(text: string): string {
  return toArabicDigits(text);
}

function fmtDate(iso: string) {
  const d = new Date(iso);

  return arabicText(
    d.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  );
}

export const rentalClauseSlots: ClauseSlot<RentalFormValues>[] = [
  {
    id: "subject",
    heading: "البند الأول: موضوع العقد",
    instruction: (v) =>
      arabicText(
        `صِغ بصياغة قانونية رسمية جملة أو جملتين تفيد بأن المؤجر أجّر للمستأجر العقار الموصوف التالي: ${v.property.description}، الكائن بالعنوان: ${v.property.street}، ${v.property.buildingNumber}، الطابق ${v.property.floor || "غير محدد"}، الوحدة ${v.property.unitNumber || "غير محدد"}، ${v.property.district}، ${v.property.city}، محافظة ${v.property.governorate}. نوع العقار: ${propertyTypeAr[v.property.type]}. الغرض من الاستخدام: ${v.property.intendedUse}. لا تضف أي بيانات غير مذكورة هنا.`,
      ),
    fallback: (v) =>
      arabicText(
        `يؤجر الطرف الأول للطرف الثاني العقار الكائن بـ${v.property.street}، مبنى رقم ${v.property.buildingNumber}${v.property.floor ? `، الطابق ${v.property.floor}` : ""}${v.property.unitNumber ? `، الوحدة رقم ${v.property.unitNumber}` : ""}، ${v.property.district}، ${v.property.city}، محافظة ${v.property.governorate}، وهو عبارة عن: ${v.property.description}. ويكون الغرض من استخدام العقار: ${v.property.intendedUse}.`,
      ),
  },

  {
    id: "term",
    heading: "البند الثاني: مدة العقد",
    instruction: (v) =>
      arabicText(
        `صِغ جملة رسمية تحدد أن مدة الإيجار تبدأ من ${fmtDate(v.lease.startDate)} وتنتهي في ${fmtDate(v.lease.endDate)}. لا تضف شروط تجديد لم تُذكر.`,
      ),
    fallback: (v) =>
      arabicText(
        `مدة هذا العقد تبدأ من ${fmtDate(v.lease.startDate)} وتنتهي في ${fmtDate(v.lease.endDate)}.`,
      ),
  },

  {
    id: "rent",
    heading: "البند الثالث: القيمة الإيجارية وطريقة السداد",
    instruction: (v) =>
      arabicText(
        `صِغ جملة رسمية تفيد بأن قيمة الإيجار هي ${v.lease.rentAmount} جنيه مصري تُسدد ${frequencyAr[v.lease.rentFrequency]} عن طريق ${paymentMethodLabels[v.lease.paymentMethod]}، وأن ميعاد الاستحقاق هو يوم ${v.lease.paymentDueDay} من كل شهر.`,
      ),
    fallback: (v) =>
      arabicText(
        `يلتزم الطرف الثاني بسداد قيمة إيجارية قدرها ${v.lease.rentAmount} جنيه مصري، تُسدد ${frequencyAr[v.lease.rentFrequency]} عن طريق ${paymentMethodLabels[v.lease.paymentMethod]}، على أن يكون ميعاد الاستحقاق يوم ${v.lease.paymentDueDay} من كل شهر ميلادي.`,
      ),
  },

  {
    id: "deposit",
    heading: "البند الرابع: مبلغ التأمين",
    instruction: (v) =>
      arabicText(
        v.lease.securityDeposit
          ? `صِغ جملة رسمية تفيد بأن المستأجر دفع مبلغ تأمين قدره ${v.lease.securityDeposit} جنيه مصري يُرد عند انتهاء العقد بعد التأكد من سلامة العقار وخلو ذمة المستأجر من أي التزامات مالية.`
          : "اكتب جملة واحدة تفيد بأنه لم يُتفق على مبلغ تأمين في هذا العقد.",
      ),
    fallback: (v) =>
      arabicText(
        v.lease.securityDeposit
          ? `دفع الطرف الثاني للطرف الأول مبلغ تأمين قدره ${v.lease.securityDeposit} جنيه مصري، يُرد للطرف الثاني عند انتهاء العقد وتسليم العقار بحالته، وبعد خصم أي مستحقات مالية إن وجدت.`
          : "لم يتفق الطرفان على مبلغ تأمين في هذا العقد.",
      ),
  },

  {
    id: "sublease",
    heading: "البند الخامس: التأجير من الباطن والتنازل",
    instruction: (v) =>
      arabicText(
        `صِغ جملة رسمية توضح أن التأجير من الباطن ${v.additional.subleaseAllowed ? "مسموح به" : "غير مسموح به"}، وأن التنازل عن العقد للغير ${v.additional.assignmentAllowed ? "مسموح به" : "غير مسموح به"} إلا بموافقة كتابية مسبقة من الطرف الأول.`,
      ),
    fallback: (v) =>
      arabicText(
        `${v.additional.subleaseAllowed ? "يجوز" : "لا يجوز"} للطرف الثاني تأجير العقار من الباطن، و${v.additional.assignmentAllowed ? "يجوز" : "لا يجوز"} له التنازل عن هذا العقد للغير، إلا بموافقة كتابية مسبقة من الطرف الأول.`,
      ),
  },

  {
    id: "alterations",
    heading: "البند السادس: التعديلات على العقار",
    instruction: (v) =>
      arabicText(
        `صِغ جملة رسمية توضح أن إجراء تعديلات على العقار ${v.additional.alterationsAllowed ? "مسموح به بموافقة كتابية مسبقة من الطرف الأول" : "غير مسموح به"}.`,
      ),
    fallback: (v) =>
      arabicText(
        `${v.additional.alterationsAllowed ? "يجوز للطرف الثاني إجراء تعديلات على العقار بعد الحصول على موافقة كتابية مسبقة من الطرف الأول" : "لا يجوز للطرف الثاني إجراء أي تعديلات على العقار"}.`,
      ),
  },

  {
    id: "maintenance",
    heading: "البند السابع: الصيانة والمرافق",
    instruction: (v) =>
      arabicText(
        `صِغ جملة أو جملتين رسميتين حول: مسؤولية الصيانة هي "${v.additional.maintenanceResponsibilities}"، ومسؤولية المرافق هي "${v.additional.utilitiesResponsibilities}".`,
      ),
    fallback: (v) =>
      arabicText(
        `${v.additional.maintenanceResponsibilities} كما ${v.additional.utilitiesResponsibilities}`,
      ),
  },

  {
    id: "termination",
    heading: "البند الثامن: الإنهاء المبكر",
    instruction: (v) =>
      arabicText(
        v.additional.earlyTerminationTerms
          ? `صِغ جملة رسمية بشروط الإنهاء المبكر التالية فقط، دون إضافة: "${v.additional.earlyTerminationTerms}".`
          : "اكتب جملة واحدة تفيد بأن العقد لا يجوز إنهاؤه قبل انتهاء مدته إلا باتفاق كتابي بين الطرفين.",
      ),
    fallback: (v) =>
      arabicText(
        v.additional.earlyTerminationTerms ||
          "لا يجوز إنهاء هذا العقد قبل انتهاء مدته المحددة إلا باتفاق كتابي بين الطرفين.",
      ),
  },

  {
    id: "handover",
    heading: "البند التاسع: تسليم العقار",
    instruction: () =>
      "اكتب جملة رسمية تفيد بأن الطرف الثاني يلتزم عند انتهاء مدة العقد بتسليم العقار للطرف الأول بالحالة التي استلمه عليها، مع مراعاة الإهلاك الناتج عن الاستعمال العادي.",
    fallback: () =>
      "يلتزم الطرف الثاني عند انتهاء مدة هذا العقد بتسليم العقار للطرف الأول بالحالة التي استلمه عليها، مع مراعاة ما يطرأ عليه من إهلاك ناتج عن الاستعمال العادي.",
  },

  {
    id: "jurisdiction",
    heading: "البند العاشر: أحكام عامة",
    instruction: () =>
      "اكتب جملة رسمية عامة تفيد بأن هذا العقد يحرر من نسختين بيد كل طرف نسخة، وأن أي نزاع ينشأ عنه يُحال إلى الجهات القضائية المختصة، دون ذكر اسم محكمة بعينها.",
    fallback: () =>
      "حُرر هذا العقد من نسختين بيد كل طرف نسخة للعمل بموجبها عند اللزوم، وأي نزاع ينشأ عن تنفيذ أو تفسير هذا العقد يُحال إلى الجهات القضائية المختصة.",
  },
];

export function buildRentalIntroduction(v: RentalFormValues) {
  return arabicText(
    `تم تحرير هذا العقد بتاريخ ${fmtDate(v.contractDate)} في ${v.placeOfContract}، بين كل من الطرف الأول (المؤجر): ${v.landlord.fullName}، ${v.landlord.nationality} الجنسية، ويحمل بطاقة رقم قومي ${v.landlord.nationalId}، ومقيم بـ${v.landlord.address}. والطرف الثاني (المستأجر): ${v.tenant.fullName}، ${v.tenant.nationality} الجنسية، ويحمل بطاقة رقم قومي ${v.tenant.nationalId}، ومقيم بـ${v.tenant.address}. وقد اتفق الطرفان على الشروط التالية:`,
  );
}

export const rentalClosing =
  "أقر الطرفان بقراءة بنود هذا العقد وفهم مضمونها والموافقة عليها، وبالتوقيع أدناه يصبح العقد نافذاً ومُلزماً لهما.";
