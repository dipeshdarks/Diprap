import { Loader2 } from "lucide-react";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="flex min-h-40 flex-col items-center justify-center gap-3 text-muted">
      <Loader2 className="size-6 animate-spin text-accent motion-reduce:animate-none" aria-hidden />
      <p className="text-sm">{label}</p>
    </div>
  );
}
