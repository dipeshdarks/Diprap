import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <Card className="flex flex-col items-start gap-3 p-6">
      {icon ? <div className="text-accent">{icon}</div> : null}
      <h2 className="text-lg font-semibold text-fg">{title}</h2>
      <p className="max-w-xl text-sm text-muted">{body}</p>
      {action}
    </Card>
  );
}
