"use client";

import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";

export function StepWizard({
  steps,
  currentStep,
  children,
}: {
  steps: string[];
  currentStep: number;
  children: React.ReactNode;
}) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div>
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs text-(--color-ink-muted)">
          <span>
            خطوة {currentStep + 1} من {steps.length}
          </span>
          <span className="font-medium text-(--color-ink)">{steps[currentStep]}</span>
        </div>
        <Progress value={progress} />
        <ol className="mt-4 hidden gap-2 sm:flex">
          {steps.map((s, i) => (
            <li
              key={s}
              className={cn(
                "flex flex-1 items-center gap-2 rounded-full border px-3 py-1.5 text-xs",
                i < currentStep && "border-(--color-deep) bg-(--color-soft-green) text-(--color-deep)",
                i === currentStep && "border-(--color-deep) text-(--color-ink) font-medium",
                i > currentStep && "border-(--color-border) text-(--color-ink-faint)"
              )}
            >
              {i < currentStep ? (
                <Check className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-current/10 text-[0.65rem]">
                  {i + 1}
                </span>
              )}
              <span className="truncate">{s}</span>
            </li>
          ))}
        </ol>
      </div>
      {children}
    </div>
  );
}
