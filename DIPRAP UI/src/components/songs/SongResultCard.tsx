import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { initials } from "@/lib/format";

export function SongResultCard({
  title,
  artist,
  meta,
  badge,
  footnote,
  geniusUrl,
  onOpen,
  openLabel = "Open",
}: {
  title: string;
  artist: string;
  meta: string;
  badge?: string;
  footnote?: string;
  geniusUrl?: string;
  onOpen: () => void;
  openLabel?: string;
}) {
  return (
    <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <div
        className="grid size-14 shrink-0 place-items-center rounded-md bg-raised text-sm font-semibold text-accent"
        aria-hidden
      >
        {initials(title)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-base font-semibold text-fg">{title}</h3>
          {badge ? <Badge tone="muted">{badge}</Badge> : null}
        </div>
        <p className="truncate text-sm text-muted">{artist}</p>
        <p className="mt-1 text-xs text-faint">{meta}</p>
        {footnote ? <p className="mt-2 text-xs text-muted">{footnote}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onOpen}>{openLabel}</Button>
        {geniusUrl ? (
          <Button variant="secondary" asChild>
            <a href={geniusUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" aria-hidden />
              Genius
            </a>
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
