import { Badge, evidenceLabel, evidenceTone } from "@/components/ui/Badge";
import type { EvidenceType } from "@/types/analysis";

export function EvidencePanel({
  evidenceType,
  source,
  uncertainty,
}: {
  evidenceType: EvidenceType;
  source: string;
  uncertainty?: string;
}) {
  return (
    <section className="rounded-lg border border-border bg-bg p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-fg">Evidence</h3>
        <Badge tone={evidenceTone(evidenceType)}>{evidenceLabel(evidenceType)}</Badge>
      </div>
      <p className="mt-2 text-sm text-muted">{source}</p>
      {uncertainty ? (
        <p className="mt-2 text-sm text-fg">
          <span className="text-muted">Uncertainty: </span>
          {uncertainty}
        </p>
      ) : null}
    </section>
  );
}
