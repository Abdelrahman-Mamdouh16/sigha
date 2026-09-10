"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { Sparkles } from "lucide-react";
import { poaSchema } from "@/schemas/power-of-attorney";
import { POA_DEMO_DATA, type PoaFormValues } from "@/types/power-of-attorney";
import { StepWizard } from "@/components/forms/step-wizard";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ReviewSection, ReviewItem } from "@/components/review/review-section";

const STEP_LABELS = ["الأطراف", "بيانات التوكيل", "المراجعة"];

const STEP_FIELDS: string[][] = [
  ["date", "place", "principal.fullName", "principal.nationality", "principal.nationalId", "principal.address", "agent.fullName", "agent.nationality", "agent.nationalId", "agent.address"],
  ["poa.type", "poa.scope", "poa.matter", "poa.powers", "poa.duration"],
];

const emptyDefaults: PoaFormValues = {
  date: "",
  place: "",
  principal: { fullName: "", nationality: "", nationalId: "", address: "" },
  agent: { fullName: "", nationality: "", nationalId: "", address: "" },
  poa: { type: "special", scope: "", matter: "", powers: "", limitations: "", duration: "" },
};

export function PoaForm({ onGenerate }: { onGenerate: (values: PoaFormValues) => void }) {
  const [step, setStep] = useState(0);
  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    watch,
    formState: { errors },
  } = useForm<PoaFormValues>({
    resolver: joiResolver(poaSchema),
    defaultValues: emptyDefaults,
    mode: "onBlur",
  });

  // eslint-disable-next-line react-hooks/incompatible-library -- RHF watch() is the documented way to read live values for the review step
  const values = watch();

  useEffect(() => {
    const raw = sessionStorage.getItem("sigha:formdata:poa");
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
        <Button type="button" variant="secondary" size="sm" onClick={() => reset(POA_DEMO_DATA)}>
          <Sparkles className="h-3.5 w-3.5" />
          تجربة نموذج
        </Button>
      </div>

      <form onSubmit={handleSubmit(onGenerate)}>
        {step === 0 && (
          <div className="space-y-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="تاريخ التحرير" htmlFor="date" error={msg("date")}>
                <Input id="date" type="date" {...register("date")} />
              </FormField>
              <FormField label="مكان التحرير" htmlFor="place" error={msg("place")}>
                <Input id="place" {...register("place")} />
              </FormField>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-(--color-ink)">الموكل</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="الاسم بالكامل" htmlFor="principal.fullName" error={msg("principal.fullName")}>
                  <Input id="principal.fullName" {...register("principal.fullName")} />
                </FormField>
                <FormField label="الجنسية" htmlFor="principal.nationality" error={msg("principal.nationality")}>
                  <Input id="principal.nationality" {...register("principal.nationality")} />
                </FormField>
                <FormField label="الرقم القومي" htmlFor="principal.nationalId" error={msg("principal.nationalId")}>
                  <Input id="principal.nationalId" {...register("principal.nationalId")} />
                </FormField>
                <FormField label="العنوان" htmlFor="principal.address" error={msg("principal.address")}>
                  <Input id="principal.address" {...register("principal.address")} />
                </FormField>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-(--color-ink)">الوكيل</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="الاسم بالكامل" htmlFor="agent.fullName" error={msg("agent.fullName")}>
                  <Input id="agent.fullName" {...register("agent.fullName")} />
                </FormField>
                <FormField label="الجنسية" htmlFor="agent.nationality" error={msg("agent.nationality")}>
                  <Input id="agent.nationality" {...register("agent.nationality")} />
                </FormField>
                <FormField label="الرقم القومي" htmlFor="agent.nationalId" error={msg("agent.nationalId")}>
                  <Input id="agent.nationalId" {...register("agent.nationalId")} />
                </FormField>
                <FormField label="العنوان" htmlFor="agent.address" error={msg("agent.address")}>
                  <Input id="agent.address" {...register("agent.address")} />
                </FormField>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <FormField label="نوع التوكيل" htmlFor="poa.type">
              <Controller
                control={control}
                name="poa.type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="poa.type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">عام</SelectItem>
                      <SelectItem value="special">خاص</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="نطاق التوكيل" htmlFor="poa.scope" error={msg("poa.scope")}>
              <Input id="poa.scope" {...register("poa.scope")} />
            </FormField>
            <FormField label="موضوع التوكيل" htmlFor="poa.matter" error={msg("poa.matter")}>
              <Textarea id="poa.matter" {...register("poa.matter")} />
            </FormField>
            <FormField
              label="الصلاحيات الممنوحة (صلاحية في كل سطر)"
              htmlFor="poa.powers"
              error={msg("poa.powers")}
            >
              <Textarea id="poa.powers" rows={5} {...register("poa.powers")} />
            </FormField>
            <FormField label="القيود على الصلاحيات" htmlFor="poa.limitations" optional>
              <Textarea id="poa.limitations" {...register("poa.limitations")} />
            </FormField>
            <FormField label="مدة التوكيل" htmlFor="poa.duration" error={msg("poa.duration")}>
              <Input id="poa.duration" {...register("poa.duration")} />
            </FormField>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <ReviewSection title="الأطراف" onEdit={() => setStep(0)}>
              <ReviewItem label="الموكل" value={values.principal.fullName} />
              <ReviewItem label="الوكيل" value={values.agent.fullName} />
              <ReviewItem label="تاريخ التحرير" value={values.date} />
              <ReviewItem label="مكان التحرير" value={values.place} />
            </ReviewSection>
            <ReviewSection title="بيانات التوكيل" onEdit={() => setStep(1)}>
              <ReviewItem label="النطاق" value={values.poa.scope} />
              <ReviewItem label="الموضوع" value={values.poa.matter} />
              <ReviewItem label="المدة" value={values.poa.duration} />
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
