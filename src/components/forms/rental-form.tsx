"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { Sparkles } from "lucide-react";
import { rentalSchema } from "@/schemas/rental";
import { RENTAL_DEMO_DATA, type RentalFormValues } from "@/types/rental";
import { StepWizard } from "@/components/forms/step-wizard";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ReviewSection, ReviewItem } from "@/components/review/review-section";

const STEP_LABELS = ["الأطراف", "بيانات العقار والإيجار", "الشروط والتفاصيل", "المراجعة"];

const STEP_FIELDS: (keyof RentalFormValues | `landlord.${string}` | `tenant.${string}` | `property.${string}` | `lease.${string}` | `additional.${string}`)[][] = [
  ["contractDate", "placeOfContract", "landlord.fullName", "landlord.nationality", "landlord.nationalId", "landlord.address", "tenant.fullName", "tenant.nationality", "tenant.nationalId", "tenant.address"],
  ["property.type", "property.description", "property.governorate", "property.city", "property.district", "property.street", "property.buildingNumber", "property.intendedUse", "lease.startDate", "lease.endDate", "lease.rentAmount", "lease.rentFrequency", "lease.paymentMethod", "lease.paymentDueDay"],
  ["additional.maintenanceResponsibilities", "additional.utilitiesResponsibilities"],
];

const emptyDefaults: RentalFormValues = {
  contractDate: "",
  placeOfContract: "",
  landlord: { fullName: "", nationality: "", nationalId: "", address: "" },
  tenant: { fullName: "", nationality: "", nationalId: "", address: "" },
  property: {
    type: "residential",
    description: "",
    governorate: "",
    city: "",
    district: "",
    street: "",
    buildingNumber: "",
    floor: "",
    unitNumber: "",
    intendedUse: "",
  },
  lease: {
    startDate: "",
    endDate: "",
    rentAmount: 0,
    rentFrequency: "monthly",
    paymentMethod: "",
    paymentDueDay: 1,
    securityDeposit: undefined,
  },
  additional: {
    subleaseAllowed: false,
    assignmentAllowed: false,
    alterationsAllowed: false,
    maintenanceResponsibilities: "",
    utilitiesResponsibilities: "",
    earlyTerminationTerms: "",
    additionalClauses: "",
  },
  signatures: { witness1: "", witness2: "" },
};

export function RentalForm({ onGenerate }: { onGenerate: (values: RentalFormValues) => void }) {
  const [step, setStep] = useState(0);
  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    watch,
    formState: { errors },
  } = useForm<RentalFormValues>({
    resolver: joiResolver(rentalSchema),
    defaultValues: emptyDefaults,
    mode: "onBlur",
  });

  // eslint-disable-next-line react-hooks/incompatible-library -- RHF watch() is the documented way to read live values for the review step
  const values = watch();

  // Restore data from a previous attempt in this session (e.g. the person came
  // back from the preview screen via "edit details") without causing an SSR/hydration mismatch.
  useEffect(() => {
    const raw = sessionStorage.getItem("sigha:formdata:rental");
    if (raw) {
      try {
        reset(JSON.parse(raw));
      } catch {
        /* ignore malformed session data */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function goNext() {
    const fields = STEP_FIELDS[step];
    const valid = fields ? await trigger(fields as never) : true;
    if (valid) setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  const err = errors as Record<string, unknown>;
  const msg = (path: string): string | undefined => {
    const parts = path.split(".");
    let cur: unknown = err;
    for (const p of parts) {
      if (!cur || typeof cur !== "object") return undefined;
      cur = (cur as Record<string, unknown>)[p];
    }
    if (cur && typeof cur === "object" && "message" in cur) return (cur as { message?: string }).message;
    return undefined;
  };

  return (
    <StepWizard steps={STEP_LABELS} currentStep={step}>
      <div className="mb-6 flex justify-end">
        <Button type="button" variant="secondary" size="sm" onClick={() => reset(RENTAL_DEMO_DATA)}>
          <Sparkles className="h-3.5 w-3.5" />
          تجربة نموذج
        </Button>
      </div>

      <form onSubmit={handleSubmit(onGenerate)}>
        {step === 0 && (
          <div className="space-y-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="تاريخ تحرير العقد" htmlFor="contractDate" error={msg("contractDate")}>
                <Input id="contractDate" type="date" {...register("contractDate")} />
              </FormField>
              <FormField label="مكان تحرير العقد" htmlFor="placeOfContract" error={msg("placeOfContract")}>
                <Input id="placeOfContract" {...register("placeOfContract")} />
              </FormField>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-(--color-ink)">المؤجر (الطرف الأول)</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="الاسم بالكامل" htmlFor="landlord.fullName" error={msg("landlord.fullName")}>
                  <Input id="landlord.fullName" {...register("landlord.fullName")} />
                </FormField>
                <FormField label="الجنسية" htmlFor="landlord.nationality" error={msg("landlord.nationality")}>
                  <Input id="landlord.nationality" {...register("landlord.nationality")} />
                </FormField>
                <FormField label="الرقم القومي" htmlFor="landlord.nationalId" error={msg("landlord.nationalId")}>
                  <Input id="landlord.nationalId" {...register("landlord.nationalId")} />
                </FormField>
                <FormField label="العنوان" htmlFor="landlord.address" error={msg("landlord.address")}>
                  <Input id="landlord.address" {...register("landlord.address")} />
                </FormField>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-(--color-ink)">المستأجر (الطرف الثاني)</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="الاسم بالكامل" htmlFor="tenant.fullName" error={msg("tenant.fullName")}>
                  <Input id="tenant.fullName" {...register("tenant.fullName")} />
                </FormField>
                <FormField label="الجنسية" htmlFor="tenant.nationality" error={msg("tenant.nationality")}>
                  <Input id="tenant.nationality" {...register("tenant.nationality")} />
                </FormField>
                <FormField label="الرقم القومي" htmlFor="tenant.nationalId" error={msg("tenant.nationalId")}>
                  <Input id="tenant.nationalId" {...register("tenant.nationalId")} />
                </FormField>
                <FormField label="العنوان" htmlFor="tenant.address" error={msg("tenant.address")}>
                  <Input id="tenant.address" {...register("tenant.address")} />
                </FormField>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-(--color-ink)">بيانات العقار</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="نوع العقار" htmlFor="property.type">
                  <Controller
                    control={control}
                    name="property.type"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="property.type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">سكني</SelectItem>
                          <SelectItem value="commercial">تجاري</SelectItem>
                          <SelectItem value="other">أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
                <FormField label="الغرض من الاستخدام" htmlFor="property.intendedUse" error={msg("property.intendedUse")}>
                  <Input id="property.intendedUse" {...register("property.intendedUse")} />
                </FormField>
                <FormField
                  label="وصف العقار"
                  htmlFor="property.description"
                  error={msg("property.description")}
                  className="sm:col-span-2"
                >
                  <Textarea id="property.description" {...register("property.description")} />
                </FormField>
                <FormField label="المحافظة" htmlFor="property.governorate" error={msg("property.governorate")}>
                  <Input id="property.governorate" {...register("property.governorate")} />
                </FormField>
                <FormField label="المدينة" htmlFor="property.city" error={msg("property.city")}>
                  <Input id="property.city" {...register("property.city")} />
                </FormField>
                <FormField label="الحي" htmlFor="property.district" error={msg("property.district")}>
                  <Input id="property.district" {...register("property.district")} />
                </FormField>
                <FormField label="الشارع" htmlFor="property.street" error={msg("property.street")}>
                  <Input id="property.street" {...register("property.street")} />
                </FormField>
                <FormField label="رقم المبنى" htmlFor="property.buildingNumber" error={msg("property.buildingNumber")}>
                  <Input id="property.buildingNumber" {...register("property.buildingNumber")} />
                </FormField>
                <FormField label="الطابق" htmlFor="property.floor" optional>
                  <Input id="property.floor" {...register("property.floor")} />
                </FormField>
                <FormField label="رقم الوحدة" htmlFor="property.unitNumber" optional>
                  <Input id="property.unitNumber" {...register("property.unitNumber")} />
                </FormField>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-(--color-ink)">مدة العقد والقيمة الإيجارية</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="تاريخ البداية" htmlFor="lease.startDate" error={msg("lease.startDate")}>
                  <Input id="lease.startDate" type="date" {...register("lease.startDate")} />
                </FormField>
                <FormField label="تاريخ النهاية" htmlFor="lease.endDate" error={msg("lease.endDate")}>
                  <Input id="lease.endDate" type="date" {...register("lease.endDate")} />
                </FormField>
                <FormField label="قيمة الإيجار (جنيه)" htmlFor="lease.rentAmount" error={msg("lease.rentAmount")}>
                  <Input id="lease.rentAmount" type="number" step="0.01" {...register("lease.rentAmount", { valueAsNumber: true })} />
                </FormField>
                <FormField label="دورية السداد" htmlFor="lease.rentFrequency">
                  <Controller
                    control={control}
                    name="lease.rentFrequency"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="lease.rentFrequency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">شهري</SelectItem>
                          <SelectItem value="quarterly">ربع سنوي</SelectItem>
                          <SelectItem value="yearly">سنوي</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
                <FormField label="طريقة السداد" htmlFor="lease.paymentMethod" error={msg("lease.paymentMethod")}>
                  <Input id="lease.paymentMethod" {...register("lease.paymentMethod")} />
                </FormField>
                <FormField label="يوم الاستحقاق (1-28)" htmlFor="lease.paymentDueDay" error={msg("lease.paymentDueDay")}>
                  <Input id="lease.paymentDueDay" type="number" min={1} max={28} {...register("lease.paymentDueDay", { valueAsNumber: true })} />
                </FormField>
                <FormField label="مبلغ التأمين" htmlFor="lease.securityDeposit" optional>
                  <Input id="lease.securityDeposit" type="number" step="0.01" {...register("lease.securityDeposit", { valueAsNumber: true })} />
                </FormField>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-3">
              <label className="flex items-center gap-2 text-sm text-(--color-ink)">
                <input type="checkbox" {...register("additional.subleaseAllowed")} className="h-4 w-4" />
                السماح بالتأجير من الباطن
              </label>
              <label className="flex items-center gap-2 text-sm text-(--color-ink)">
                <input type="checkbox" {...register("additional.assignmentAllowed")} className="h-4 w-4" />
                السماح بالتنازل عن العقد
              </label>
              <label className="flex items-center gap-2 text-sm text-(--color-ink)">
                <input type="checkbox" {...register("additional.alterationsAllowed")} className="h-4 w-4" />
                السماح بتعديلات على العقار
              </label>
            </div>

            <FormField
              label="مسؤولية الصيانة"
              htmlFor="additional.maintenanceResponsibilities"
              error={msg("additional.maintenanceResponsibilities")}
            >
              <Textarea id="additional.maintenanceResponsibilities" {...register("additional.maintenanceResponsibilities")} />
            </FormField>
            <FormField
              label="مسؤولية المرافق"
              htmlFor="additional.utilitiesResponsibilities"
              error={msg("additional.utilitiesResponsibilities")}
            >
              <Textarea id="additional.utilitiesResponsibilities" {...register("additional.utilitiesResponsibilities")} />
            </FormField>
            <FormField label="شروط الإنهاء المبكر" htmlFor="additional.earlyTerminationTerms" optional>
              <Textarea id="additional.earlyTerminationTerms" {...register("additional.earlyTerminationTerms")} />
            </FormField>
            <FormField label="بنود إضافية" htmlFor="additional.additionalClauses" optional>
              <Textarea id="additional.additionalClauses" {...register("additional.additionalClauses")} />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="الشاهد الأول" htmlFor="signatures.witness1" optional>
                <Input id="signatures.witness1" {...register("signatures.witness1")} />
              </FormField>
              <FormField label="الشاهد الثاني" htmlFor="signatures.witness2" optional>
                <Input id="signatures.witness2" {...register("signatures.witness2")} />
              </FormField>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <ReviewSection title="الأطراف" onEdit={() => setStep(0)}>
              <ReviewItem label="المؤجر" value={values.landlord.fullName} />
              <ReviewItem label="المستأجر" value={values.tenant.fullName} />
              <ReviewItem label="تاريخ العقد" value={values.contractDate} />
              <ReviewItem label="مكان التحرير" value={values.placeOfContract} />
            </ReviewSection>
            <ReviewSection title="العقار والإيجار" onEdit={() => setStep(1)}>
              <ReviewItem label="العنوان" value={`${values.property.street}, ${values.property.city}`} />
              <ReviewItem label="مدة العقد" value={`${values.lease.startDate} → ${values.lease.endDate}`} />
              <ReviewItem label="قيمة الإيجار" value={`${values.lease.rentAmount} جنيه`} />
              <ReviewItem label="مبلغ التأمين" value={values.lease.securityDeposit || "—"} />
            </ReviewSection>
            <ReviewSection title="الشروط الإضافية" onEdit={() => setStep(2)}>
              <ReviewItem label="التأجير من الباطن" value={values.additional.subleaseAllowed ? "مسموح" : "غير مسموح"} />
              <ReviewItem label="التنازل عن العقد" value={values.additional.assignmentAllowed ? "مسموح" : "غير مسموح"} />
            </ReviewSection>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button type="button" variant="secondary" onClick={goBack} disabled={step === 0}>
            رجوع
          </Button>
          {step < STEP_LABELS.length - 1 ? (
            <Button type="button" onClick={goNext}>
              التالي
            </Button>
          ) : (
            <Button type="submit">تأكيد وإنشاء المسودة</Button>
          )}
        </div>
      </form>
    </StepWizard>
  );
}
