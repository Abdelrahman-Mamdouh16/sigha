import { Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-(--color-ink)">{title}</h3>
          <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
            تعديل
          </Button>
        </div>
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">{children}</dl>
      </CardContent>
    </Card>
  );
}

export function ReviewItem({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="min-w-0">
      <dt className="text-xs text-(--color-ink-faint)">{label}</dt>
      <dd className="mt-0.5 truncate text-sm text-(--color-ink)">{String(value)}</dd>
    </div>
  );
}
