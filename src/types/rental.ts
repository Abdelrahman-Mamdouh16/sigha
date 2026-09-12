export interface RentalParty {
  fullName: string;
  nationality: string;
  nationalId: string;
  address: string;
}

export type PropertyType = "residential" | "commercial" | "other";
export type RentFrequency = "monthly" | "quarterly" | "yearly";
export type paymentMethod = "cash" | "bank_transfer" | "credit_card";

export interface RentalFormValues {
  contractDate: string;
  placeOfContract: string;

  landlord: RentalParty;
  tenant: RentalParty;

  property: {
    type: PropertyType;
    description: string;
    governorate: string;
    city: string;
    district: string;
    street: string;
    buildingNumber: string;
    floor?: string;
    unitNumber?: string;
    intendedUse: string;
  };

  lease: {
    startDate: string;
    endDate: string;
    rentAmount: number;
    rentFrequency: RentFrequency;
    paymentMethod: paymentMethod;
    paymentDueDay: number;
    securityDeposit?: number;
  };

  additional: {
    subleaseAllowed: boolean;
    assignmentAllowed: boolean;
    alterationsAllowed: boolean;
    maintenanceResponsibilities: string;
    utilitiesResponsibilities: string;
    earlyTerminationTerms?: string;
    additionalClauses?: string;
  };

  signatures: {
    witness1?: string;
    witness2?: string;
  };
}

export const RENTAL_DEMO_DATA: RentalFormValues = {
  contractDate: "2026-09-10",
  placeOfContract: "القاهرة",
  landlord: {
    fullName: "أحمد محمد علي",
    nationality: "مصري",
    nationalId: "29001011234567",
    address: "12 شارع النصر، مدينة نصر، القاهرة",
  },
  tenant: {
    fullName: "محمد محمود حسن",
    nationality: "مصري",
    nationalId: "29305071122334",
    address: "5 شارع الجمهورية، المنصورة، الدقهلية",
  },
  property: {
    type: "residential",
    description: "شقة سكنية بالدور الثالث تتكون من ثلاث غرف وصالة ومطبخ وحمامين",
    governorate: "القاهرة",
    city: "القاهرة",
    district: "مدينة نصر",
    street: "شارع مكرم عبيد",
    buildingNumber: "18",
    floor: "3",
    unitNumber: "7",
    intendedUse: "سكن خاص",
  },
  lease: {
    startDate: "2026-10-01",
    endDate: "2027-09-30",
    rentAmount: 3500,
    rentFrequency: "monthly",
    paymentMethod: "cash",
    paymentDueDay: 5,
    securityDeposit: 7000,
  },
  additional: {
    subleaseAllowed: false,
    assignmentAllowed: false,
    alterationsAllowed: false,
    maintenanceResponsibilities: "يلتزم المستأجر بالصيانة الدورية البسيطة، ويلتزم المؤجر بالإصلاحات الجوهرية.",
    utilitiesResponsibilities: "يتحمل المستأجر مصاريف الكهرباء والمياه والغاز خلال مدة الإيجار.",
    earlyTerminationTerms: "يجوز لأي من الطرفين إنهاء العقد بإخطار كتابي قبل 60 يوماً.",
    additionalClauses: "",
  },
  signatures: {
    witness1: "كريم عبد الله",
    witness2: "سارة يوسف",
  },
};
