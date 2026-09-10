import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

export function FormField({
  label,
  htmlFor,
  error,
  optional,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-1.5 flex items-center justify-between">
        <Label htmlFor={htmlFor}>{label}</Label>
        {optional && <span className="text-[0.7rem] text-(--color-ink-faint)">اختياري</span>}
      </div>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-(--color-danger)">
          {error}
        </p>
      )}
    </div>
  );
}
