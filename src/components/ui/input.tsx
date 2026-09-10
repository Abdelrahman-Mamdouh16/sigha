import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-[var(--radius-control)] border border-(--color-border-strong) bg-(--color-paper-raised) px-3.5 text-sm text-(--color-ink) placeholder:text-(--color-ink-faint) outline-none transition-colors focus:border-(--color-deep) disabled:opacity-50",
        "aria-invalid:border-(--color-danger)",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
