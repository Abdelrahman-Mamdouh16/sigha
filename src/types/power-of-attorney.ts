export interface PoaParty {
  fullName: string;
  nationality: string;
  nationalId: string;
  address: string;
}

export type PoaType = "general" | "special";

export interface PoaFormValues {
  date: string;
  place: string;

  principal: PoaParty;
  agent: PoaParty;

  poa: {
    type: PoaType;
    scope: string;
    matter: string;
    powers: string;
    limitations?: string;
    duration: string;
  };
}

export const POA_DEMO_DATA: PoaFormValues = {
  date: "2026-09-10",
  place: "القاهرة",
  principal: {
    fullName: "منى إبراهيم سيد",
    nationality: "مصرية",
    nationalId: "28806123456789",
    address: "22 شارع الهرم، الجيزة",
  },
  agent: {
    fullName: "خالد سعيد فتحي",
    nationality: "مصري",
    nationalId: "29002034567891",
    address: "9 شارع التحرير، الجيزة",
  },
  poa: {
    type: "special",
    scope: "توكيل خاص لإدارة عقار وتحصيل إيجاراته",
    matter: "إدارة الوحدة السكنية الكائنة بالعنوان المذكور والتعامل مع مستأجريها",
    powers:
      "التوقيع على عقود الإيجار نيابة عن الموكل\nتحصيل قيمة الإيجار الشهري\nمتابعة أعمال الصيانة اللازمة للعقار",
    limitations: "لا يجوز للوكيل بيع العقار أو رهنه",
    duration: "سنة واحدة من تاريخ التوكيل، قابلة للتجديد",
  },
};
