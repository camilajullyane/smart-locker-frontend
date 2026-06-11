import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <Card size="sm" className="bg-neutral-950/60">
      <CardContent className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-md bg-neutral-900 text-neutral-200">
          <Icon className="size-4" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
