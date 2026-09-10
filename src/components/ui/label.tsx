"use client";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils/cn";

export function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn("mb-1.5 block text-[0.8125rem] font-medium text-(--color-ink-muted)", className)}
      {...props}
    />
  );
}
