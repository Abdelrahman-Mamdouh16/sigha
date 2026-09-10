"use client";

import { Check, Loader2, Circle } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";

export function GenerationStages({ activeIndex }: { activeIndex: number }) {
  const { dict } = useLocale();
  const stages = dict.generation.stages;

  return (
    <div className="mx-auto max-w-sm space-y-3 py-10">
      {stages.map((label, i) => {
        const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "pending";
        return (
          <div key={label} className="flex items-center gap-3">
            {state === "done" && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-(--color-deep) text-(--color-paper-raised)">
                <Check className="h-3.5 w-3.5" />
              </span>
            )}
            {state === "active" && <Loader2 className="h-6 w-6 animate-spin text-(--color-deep)" />}
            {state === "pending" && <Circle className="h-6 w-6 text-(--color-border-strong)" />}
            <span
              className={
                state === "pending" ? "text-sm text-(--color-ink-faint)" : "text-sm font-medium text-(--color-ink)"
              }
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
