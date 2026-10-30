import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AudioPanel } from "@/components/analysis/AudioPanel";
import { EvidencePanel } from "@/components/analysis/EvidencePanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/cn";
import { analyzeText, isModelStale, syllableSummary } from "@/lib/text-analysis";
import { useActiveProject, useLabStore } from "@/lib/store";
import type { SongSection, TextEstimate } from "@/types/analysis";

const SECTION_HUE: Record<SongSection["type"], string> = {
  intro: "bg-cyan/40 text-cyan",
  verse: "bg-accent/40 text-accent",
  hook: "bg-gold/40 text-gold",
  bridge: "bg-pink/40 text-pink",
  outro: "bg-raised text-muted",
};

const SECTION_SHORT: Record<SongSection["type"], string> = {
  intro: "Intro",
  verse: "Verse",
  hook: "Hook",
  bridge: "Bridge",
  outro: "Outro",
};

export function FlowCadenceLab() {
  const project = useActiveProject();
  const selectedBar = useLabStore((state) => state.selectedBar);
  const setSelectedBar = useLabStore((state) => state.setSelectedBar);
  const estimate = useMemo(
    () => (project ? analyzeText(project.lyrics, project.language) : null),
    [project],
  );

  if (!project || !estimate || estimate.lines.length === 0) {
    return (
      <EmptyState
        title="Nothing to chart"
        body="Flow notes start from the lines you paste. Audio stays optional, and only then is anything measured."
        action={
          <Button asChild>
            <Link to="/analyze" search={{ view: "lyrics" }}>
              Add lyrics
            </Link>
          </Button>
        }
      />
    );
  }

  const summary = syllableSummary(estimate);
  const stale = project.model ? isModelStale(project.model.sourceLines, project.lyrics) : false;
  const model = project.model && !stale ? project.model : null;
  const sections = model && model.structure.length > 0 ? model.structure : estimate.structure;
  const selected = estimate.lines[Math.min(selectedBar, estimate.lines.length - 1)] ?? estimate.lines[0];
  const data = estimate.lines.map((line) => ({
    bar: line.index + 1,
    syllables: line.syllables ?? 0,
  }));
  const chartable = estimate.lines.some((line) => line.syllables != null);
  const pauseCount = estimate.lines.filter((line) => line.pauseNote).length;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-fg">Flow and cadence</h2>
        <p className="text-sm text-muted">
          Charts below are text estimates. They are not a timeline of a performance.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Written lines"
          value={String(estimate.lines.length)}
          note="Non-empty lines you pasted"
          evidence="estimated"
        />
        <Metric
          label="Est. syllables"
          value={summary ? String(summary.total) : "—"}
          note={summary ? `About ${summary.average.toFixed(1)} per counted line` : "Unavailable"}
          evidence="estimated"
        />
        <Metric
          label="Punctuation breaks"
          value={String(pauseCount)}
          note="Not timed breaths"
          evidence="estimated"
        />
        <Metric label="BPM" value="—" note="Unavailable without beat tracking" evidence="none" />
      </div>
      <div className="grid gap-4 xl:grid-cols-5">
        <Card className="p-4 xl:col-span-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-fg">Syllable density</h3>
            <Badge tone="gold">Text estimate</Badge>
          </div>
          {chartable ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="bar" stroke="currentColor" tick={{ fill: "currentColor", fontSize: 12 }} />
                  <YAxis allowDecimals={false} stroke="currentColor" tick={{ fill: "currentColor", fontSize: 12 }} width={32} />
                  <Tooltip
                    content={({ active, payload, label }) =>
                      active && payload && payload.length ? (
                        <div className="rounded-md border border-border bg-raised px-3 py-2 text-xs text-fg">
                          Bar {label}: {payload[0]?.value} estimated syllables
                        </div>
                      ) : null
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="syllables"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-muted">Syllable estimates need Latin-script words. This excerpt does not have enough of them.</p>
          )}
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {estimate.patterns.length > 0 ? (
              <li>
                Stanza patterns:{" "}
                {estimate.patterns
                  .map((pattern) => `${pattern.label} (lines ${pattern.start + 1}–${pattern.end + 1})`)
                  .join(", ")}
                .
              </li>
            ) : null}
            {estimate.observations.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </Card>
        <Card className="space-y-3 p-4 xl:col-span-2">
          <h3 className="text-sm font-medium text-fg">Selected bar</h3>
          <label className="block text-sm text-muted" htmlFor="flow-bar">
            Bar
            <select
              id="flow-bar"
              className="mt-1 h-11 w-full rounded-md border border-border bg-bg px-2 text-fg"
              value={selected?.index ?? 0}
              onChange={(event) => setSelectedBar(Number(event.target.value))}
            >
              {estimate.lines.map((line) => (
                <option key={line.index} value={line.index}>
                  {line.index + 1}. {line.text.slice(0, 48)}
                </option>
              ))}
            </select>
          </label>
          {selected ? (
            <>
              <p className="text-sm text-fg">{selected.text}</p>
              <p className="text-sm text-muted">{selected.syllableBasis}</p>
              <p className="text-sm text-muted">
                {selected.pauseNote ?? "No punctuation break on this line. That does not mean the performer takes no breath."}
              </p>
            </>
          ) : null}
          <div>
            <h4 className="text-sm font-medium text-fg">Cadence notes</h4>
            {model ? (
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
                {[...model.cadenceNotes, ...model.flowNotes].map((note) => (
                  <li key={note}>{note}</li>
                ))}
                {model.cadenceNotes.length + model.flowNotes.length === 0 ? (
                  <li>The model did not add cadence notes.</li>
                ) : null}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">
                Qualitative delivery notes appear here after Analyze. They will still not include a BPM.
              </p>
            )}
          </div>
          <EvidencePanel
            evidenceType={model ? "interpretive" : "user_provided"}
            source={
              model
                ? "Numbers in the chart are still text estimates. Sentences from the model are interpretations, not measurements."
                : estimate.disclaimer
            }
            uncertainty="No vocal timing was captured."
          />
        </Card>
      </div>
      <Card className="p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-fg">Structure timeline</h3>
          <Badge tone={model ? "accent" : "gold"}>
            {model && model.structure.length > 0 ? "Model reading" : "Text estimate"}
          </Badge>
        </div>
        <StructureTimeline sections={sections} total={estimate.lines.length} selected={selected?.index ?? 0} onSelect={setSelectedBar} />
      </Card>
      <Card className="p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-fg">Cadence map</h3>
          <Badge tone="gold">Text estimate</Badge>
        </div>
        <CadenceMap estimate={estimate} sections={sections} selected={selected?.index ?? 0} onSelect={setSelectedBar} />
      </Card>
      {model && model.flowMap.length > 0 ? (
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-fg">Flow map</h3>
            <Badge tone="accent">Model reading</Badge>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {model.flowMap.map((entry) => (
              <li key={`${entry.section}-${entry.flowStyle}`} className="rounded-md border border-border bg-bg p-3">
                <p className="text-sm font-medium text-fg">{entry.section}</p>
                <dl className="mt-2 space-y-1 text-sm text-muted">
                  <div>
                    <dt className="inline font-medium text-fg">Flow: </dt>
                    <dd className="inline">{entry.flowStyle}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-fg">Rhythm: </dt>
                    <dd className="inline">{entry.rhythm}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-fg">Rhyme technique: </dt>
                    <dd className="inline">{entry.rhymeTechnique}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-fg">Effect: </dt>
                    <dd className="inline">{entry.effect}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
      <AudioPanel />
    </div>
  );
}

function StructureTimeline({
  sections,
  total,
  selected,
  onSelect,
}: {
  sections: SongSection[];
  total: number;
  selected: number;
  onSelect: (index: number) => void;
}) {
  if (sections.length === 0) {
    return <p className="text-sm text-muted">No structure was detected. Paste more lines or run Analyze for a model reading.</p>;
  }
  return (
    <ul className="space-y-2">
      {sections.map((section) => {
        const length = section.endIndex - section.startIndex + 1;
        const width = `${Math.max(4, (length / total) * 100)}%`;
        const active = selected >= section.startIndex && selected <= section.endIndex;
        return (
          <li key={`${section.label}-${section.startIndex}`}>
            <button
              type="button"
              onClick={() => onSelect(section.startIndex)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left",
                active ? "border-accent bg-accent/10" : "border-border hover:bg-raised",
              )}
            >
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", SECTION_HUE[section.type])}>
                {SECTION_SHORT[section.type]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-fg">{section.label}</span>
                <span className="block text-xs text-muted">
                  Lines {section.startIndex + 1}–{section.endIndex + 1}
                  {section.note ? ` · ${section.note}` : ""}
                </span>
              </span>
              <span className="hidden h-2 shrink-0 overflow-hidden rounded-full bg-raised sm:block" style={{ width: "20%" }}>
                <span className={cn("block h-full rounded-full", SECTION_HUE[section.type].split(" ")[0])} style={{ width }} />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function CadenceMap({
  estimate,
  sections,
  selected,
  onSelect,
}: {
  estimate: TextEstimate;
  sections: SongSection[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  const maxSyllables = Math.max(
    1,
    ...estimate.lines.map((line) => line.syllables ?? 0),
  );
  return (
    <ul className="space-y-1.5">
      {estimate.lines.map((line) => {
        const section = sections.find((item) => line.index >= item.startIndex && line.index <= item.endIndex);
        const hue = section ? SECTION_HUE[section.type].split(" ")[0] : "bg-accent";
        const width = `${Math.max(4, ((line.syllables ?? 0) / maxSyllables) * 100)}%`;
        const active = line.index === selected;
        return (
          <li key={line.index}>
            <button
              type="button"
              onClick={() => onSelect(line.index)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-2 py-1 text-left",
                active ? "bg-accent/10 ring-1 ring-accent ring-inset" : "hover:bg-raised",
              )}
            >
              <span className="w-6 shrink-0 text-right font-mono text-xs text-muted">{line.index + 1}</span>
              <span className="h-3 flex-1 overflow-hidden rounded-full bg-raised">
                <span className={cn("block h-full rounded-full", hue)} style={{ width }} />
              </span>
              <span className="w-14 shrink-0 text-right font-mono text-xs text-muted">
                {line.syllables ?? "—"} syl
              </span>
              <span
                className={cn(
                  "w-12 shrink-0 rounded-full px-1.5 py-0.5 text-center text-[10px] font-medium",
                  line.pauseNote ? "bg-raised text-gold" : "bg-bg text-faint",
                )}
              >
                {line.pauseNote ? "break" : "—"}
              </span>
            </button>
          </li>
        );
      })}
      <li className="pt-2 text-xs text-muted">
        Phrase color follows the section. “break” marks a punctuation pause in the text — not a measured breath.
      </li>
    </ul>
  );
}

function Metric({
  label,
  value,
  note,
  evidence,
}: {
  label: string;
  value: string;
  note: string;
  evidence: "estimated" | "measured" | "none";
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-faint">{label}</p>
        {evidence === "estimated" ? (
          <Badge tone="gold">Estimated</Badge>
        ) : evidence === "measured" ? (
          <Badge tone="ok">Measured</Badge>
        ) : (
          <Badge tone="muted">Unavailable</Badge>
        )}
      </div>
      <p className="mt-1 font-mono text-2xl text-fg tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted">{note}</p>
    </Card>
  );
}
