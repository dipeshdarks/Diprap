import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Card role="alert" className="flex flex-col items-start gap-3 border-danger/40 p-5">
      <TriangleAlert className="size-5 text-danger" aria-hidden />
      <h2 className="text-base font-semibold text-fg">{title}</h2>
      <p className="text-sm text-muted">{message}</p>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </Card>
  );
}
