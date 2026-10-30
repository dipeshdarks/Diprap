import { useEffect, useMemo, useRef, useState } from "react";
import { EvidencePanel } from "@/components/analysis/EvidencePanel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { cn } from "@/lib/cn";
import { formatDuration, formatSampleRate } from "@/lib/format";
import { analyzeText, splitBars } from "@/lib/text-analysis";
import { useActiveProject, useLabStore } from "@/lib/store";
import type { SongSection } from "@/types/analysis";

const SECTION_COLOR: Record<SongSection["type"], string> = {
  intro: "#22d3ee",
  verse: "#8b5cf6",
  hook: "#f2c94c",
  bridge: "#f472b6",
  outro: "#8a8a96",
};

export function AudioPanel() {
  const project = useActiveProject();
  const audio = useLabStore((state) => state.audio);
  const attachAudio = useLabStore((state) => state.attachAudio);
  const clearAudio = useLabStore((state) => state.clearAudio);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showBars, setShowBars] = useState(true);
  const [showSections, setShowSections] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const attached = project && audio && audio.projectId === project.id ? audio : null;

  const barCount = useMemo(() => (project ? splitBars(project.lyrics).length : 0), [project]);
  const sections = useMemo(() => {
    if (!project) return [];
    const estimate = analyzeText(project.lyrics, project.language);
    if (project.model && project.model.structure.length > 0) return project.model.structure;
    return estimate.structure;
  }, [project]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !attached) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--color-accent").trim() || "#8b5cf6";
    const border = styles.getPropertyValue("--color-border").trim() || "#303038";
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(width * ratio));
    canvas.height = Math.max(1, Math.floor(height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    const mid = height / 2;
    const slot = width / attached.peaks.length;
    attached.peaks.forEach((peak, index) => {
      const barHeight = Math.max(2, peak * (height - 8));
      context.fillStyle = index / attached.peaks.length < progress ? accent : border;
      context.fillRect(index * slot, mid - barHeight / 2, Math.max(1, slot - 1), barHeight);
    });
    if (showSections && barCount > 0) {
      sections.forEach((section) => {
        const startX = (section.startIndex / barCount) * width;
        const endX = ((section.endIndex + 1) / barCount) * width;
        context.fillStyle = `${SECTION_COLOR[section.type]}44`;
        context.fillRect(startX, 0, Math.max(1, endX - startX), 6);
      });
    }
    if (showBars && barCount > 0) {
      context.strokeStyle = "#f5f5f466";
      context.lineWidth = 1;
      for (let bar = 1; bar < barCount; bar += 1) {
        const x = (bar / barCount) * width;
        context.beginPath();
        context.moveTo(x, height - 8);
        context.lineTo(x, height);
        context.stroke();
      }
    }
  }, [attached, progress, showBars, showSections, barCount, sections]);

  if (!project) return null;

  return (
    <Card className="space-y-4 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-fg">Audio</h2>
          <p className="text-sm text-muted">
            Attach a file you have rights to. It stays in this browser session and is never uploaded.
          </p>
        </div>
        <label className="inline-flex min-h-11 cursor-pointer items-center rounded-md border border-border bg-raised px-4 text-sm text-fg">
          Attach audio
          <input
            type="file"
            accept="audio/*"
            className="sr-only"
            suppressHydrationWarning
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              void attachAudio(project.id, file).then((result) => {
                setError(result.ok ? null : result.error);
                setProgress(0);
              });
            }}
          />
        </label>
      </div>
      {error ? <ErrorState title="Audio was not attached" message={error} /> : null}
      {attached ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-fg">{attached.fileName}</p>
            <div className="flex flex-wrap gap-1.5">
              <ToggleChip active={showSections} onClick={() => setShowSections((value) => !value)} label="Sections" />
              <ToggleChip active={showBars} onClick={() => setShowBars((value) => !value)} label="Bar markers" />
            </div>
          </div>
          <canvas ref={canvasRef} className="h-24 w-full rounded-md bg-bg" role="img" aria-label="Waveform measured from the attached file" />
          {barCount > 0 ? (
            <p className="text-xs text-muted">
              Markers are evenly spaced across the duration — an orientation aid, not a beat-matched transcription.
            </p>
          ) : null}
          <audio
            src={attached.url}
            controls
            className="w-full"
            onTimeUpdate={(event) => {
              const element = event.currentTarget;
              if (!element.duration) return;
              setProgress(element.currentTime / element.duration);
            }}
          />
          <dl className="grid gap-3 sm:grid-cols-3">
            <Stat label="Duration" value={formatDuration(attached.duration)} note="Measured" />
            <Stat label="Sample rate" value={formatSampleRate(attached.sampleRate)} note="Measured" />
            <Stat label="Tempo" value="Unavailable" note="No beat tracker" />
          </dl>
          <EvidencePanel
            evidenceType="measured"
            source="Duration, sample rate, and the waveform come from decoding the file in this browser."
            uncertainty="Bars are not aligned to the audio. Breaths, BPM, and mix notes were not measured."
          />
          <Button variant="secondary" onClick={clearAudio}>
            Remove audio
          </Button>
        </div>
      ) : (
        <EvidencePanel
          evidenceType="unavailable"
          source="No audio is attached, so there is no waveform, duration, or tempo."
          uncertainty="The lab will not draw a placeholder performance."
        />
      )}
    </Card>
  );
}

function ToggleChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-medium",
        active ? "border-accent bg-accent/15 text-accent" : "border-border bg-raised text-muted hover:text-fg",
      )}
    >
      {label}
    </button>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-md border border-border bg-bg px-3 py-2">
      <dt className="text-xs text-faint">{label}</dt>
      <dd className="text-sm font-medium text-fg">{value}</dd>
      <p className="text-xs text-muted">{note}</p>
    </div>
  );
}
