import type { ReactNode } from "react";
import type { Confidence, EvidenceType, TagKind } from "@/types/analysis";
import { EVIDENCE_LABEL } from "@/types/analysis";
import { cn } from "@/lib/cn";

const tones = {
  accent: "bg-accent/15 text-accent",
  gold: "bg-gold/15 text-gold",
  cyan: "bg-cyan/15 text-cyan",
  ok: "bg-ok/15 text-ok",
  danger: "bg-danger/15 text-danger",
  muted: "bg-raised text-muted",
  blue: "bg-blue/15 text-blue",
  teal: "bg-teal/15 text-teal",
  pink: "bg-pink/15 text-pink",
  rose: "bg-rose/15 text-rose",
  orange: "bg-orange/15 text-orange",
  indigo: "bg-indigo/15 text-indigo",
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({
  tone = "muted",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function toneForKind(kind: TagKind): BadgeTone {
  switch (kind) {
    case "end_rhyme":
      return "gold";
    case "internal_rhyme":
      return "blue";
    case "multisyllabic":
      return "teal";
    case "wordplay":
      return "pink";
    case "cadence":
      return "accent";
    case "slant":
      return "rose";
    case "theme":
      return "orange";
    case "metaphor":
      return "ok";
    case "repetition":
      return "indigo";
    default:
      return "muted";
  }
}

export function confidenceTone(confidence: Confidence): BadgeTone {
  if (confidence === "high") return "ok";
  if (confidence === "medium") return "gold";
  return "muted";
}

export function evidenceTone(evidence: EvidenceType): BadgeTone {
  if (evidence === "measured" || evidence === "user_provided") return "ok";
  if (evidence === "unavailable") return "muted";
  if (evidence === "unverified") return "gold";
  return "accent";
}

export function evidenceLabel(evidence: EvidenceType): string {
  return EVIDENCE_LABEL[evidence];
}
