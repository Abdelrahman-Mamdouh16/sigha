import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-24 w-full rounded-[var(--radius-control)] border border-(--color-border-strong) bg-(--color-paper-raised) px-3.5 py-2.5 text-sm text-(--color-ink) placeholder:text-(--color-ink-faint) outline-none transition-colors focus:border-(--color-deep) disabled:opacity-50",
        "aria-invalid:border-(--color-danger)",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
