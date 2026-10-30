import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, ChevronLeft, Filter } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { EvidencePanel } from "@/components/analysis/EvidencePanel";
import { LyricText } from "@/components/analysis/LyricText";
import { Badge, confidenceTone, toneForKind } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { analyzeText, isModelStale } from "@/lib/text-analysis";
import { useActiveProject, useLabStore } from "@/lib/store";
import type {
  BarTag,
  ModelAnalysis,
  ModelBar,
  TextBar,
  TextEstimate,
} from "@/types/analysis";

type FilterId = "all" | "end" | "internal" | "repeat" | "pause";

export function BarByBarExplorer() {
  const project = useActiveProject();
  const selectedBar = useLabStore((state) => state.selectedBar);
  const setSelectedBar = useLabStore((state) => state.setSelectedBar);
  const [filter, setFilter] = useState<FilterId>("all");
  const [collapsed, setCollapsed] = useState<Set<string>>(
    () => new Set(["Alternative reading", "Narrative function"]),
  );

  const estimate = useMemo(
    () => (project ? analyzeText(project.lyrics, project.language) : null),
    [project],
  );

  const lines = estimate?.lines ?? [];
  const stale = project?.model ? isModelStale(project.model.sourceLines, project.lyrics) : false;
  const model = project?.model && !stale ? project.model : null;
  const modelBars = model?.bars ?? null;

  const sharedKeys = new Set(estimate?.endGroups.map((group) => group.key) ?? []);
  const visible = lines.filter((line) => {
    if (filter === "end") return Boolean(line.endKey && sharedKeys.has(line.endKey));
    return matchesFilter(line, filter);
  });
  const selected = lines[Math.min(selectedBar, Math.max(lines.length - 1, 0))] ?? null;
  const selectedModel = selected && modelBars ? modelBars.find((bar) => bar.index === selected.index) : undefined;

  useEffect(() => {
    if (!selected) return;
    document.getElementById(`bar-${selected.index}`)?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
      if (lines.length === 0) return;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        setSelectedBar(Math.min(lines.length - 1, selectedBar + 1));
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        setSelectedBar(Math.max(0, selectedBar - 1));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lines.length, selectedBar, setSelectedBar]);

  if (!project) {
    return (
      <EmptyState
        title="No project open"
        body="Open a project or paste lyrics before stepping through bars."
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

  if (!estimate || lines.length === 0) {
    return (
      <EmptyState
        title="No bars yet"
        body="Paste a lyric excerpt. Each non-empty line becomes a bar you can select."
        action={
          <Button asChild>
            <Link to="/analyze" search={{ view: "lyrics" }}>
              Paste lyrics
            </Link>
          </Button>
        }
      />
    );
  }

  if (!selected) return null;

  const highlight = [
    ...highlightWords(selected),
    ...(model
      ? model.rhymes.flatMap((group) =>
          group.members.filter((member) => member.barIndex === selected.index).map((member) => member.word),
        )
      : []),
  ];
  const selectedTags = barTagChips(selected, selectedModel, estimate, model);
  const techniqueCount = (selectedModel?.wordplay.length ?? 0) + (selectedModel?.metaphors.length ?? 0);

  function toggleSection(title: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  return (
    <div className="grid gap-4 xl:grid-cols-5">
      <Card className="xl:col-span-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h2 className="text-base font-semibold text-fg">Bar-by-bar</h2>
            <p className="text-sm text-muted">Select a line. Arrow keys move when you are not typing.</p>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">
            <Filter className="size-4" aria-hidden />
            <span className="sr-only">Filter bars</span>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as FilterId)}
              className="h-11 rounded-md border border-border bg-bg px-2 text-fg"
            >
              <option value="all">All bars</option>
              <option value="end">Shared ending spelling</option>
              <option value="internal">In-line spelling match</option>
              <option value="repeat">Repeated word</option>
              <option value="pause">Punctuation break</option>
            </select>
          </label>
        </div>
        <ul className="divide-y divide-border">
          {visible.length === 0 ? (
            <li className="px-4 py-6 text-sm text-muted">No bars match this filter.</li>
          ) : (
            visible.map((line) => {
              const active = line.index === selected?.index;
              const barModel = modelBars?.find((bar) => bar.index === line.index);
              const chips = barTagChips(line, barModel, estimate, model);
              return (
                <li key={line.index}>
                  <button
                    id={`bar-${line.index}`}
                    type="button"
                    aria-current={active ? "true" : undefined}
                    onClick={() => setSelectedBar(line.index)}
                    className={`flex w-full flex-col gap-3 px-4 py-3 text-left sm:flex-row sm:items-start ${
                      active ? "bg-accent/10 ring-1 ring-accent ring-inset" : "hover:bg-raised"
                    }`}
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-raised font-mono text-xs text-muted">
                      {line.index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <LyricText text={line.text} words={highlightWords(line)} />
                    </span>
                    <span className="flex flex-wrap gap-1">
                      {chips.map((chip) => (
                        <Badge key={`${chip.label}-${chip.kind}`} tone={toneForKind(chip.kind)}>
                          {chip.letter ? (
                            <span className="font-mono font-semibold">{chip.letter}</span>
                          ) : null}
                          {chip.label}
                        </Badge>
                      ))}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </Card>
      <Card className="space-y-4 p-4 xl:col-span-2">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-xs text-muted">
            Bar {selected.index + 1} of {lines.length}
          </p>
          <div className="flex gap-1">
            <Button
              variant="secondary"
              aria-label="Previous bar"
              onClick={() => setSelectedBar(Math.max(0, selected.index - 1))}
              disabled={selected.index === 0}
            >
              <ChevronLeft className="size-4" aria-hidden />
            </Button>
            <Button
              variant="secondary"
              aria-label="Next bar"
              onClick={() => setSelectedBar(Math.min(lines.length - 1, selected.index + 1))}
              disabled={selected.index === lines.length - 1}
            >
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {selectedTags.map((chip) => (
            <Badge key={`${chip.label}-${chip.kind}`} tone={toneForKind(chip.kind)}>
              {chip.letter ? <span className="font-mono font-semibold">{chip.letter}</span> : null}
              {chip.label}
            </Badge>
          ))}
          {selectedModel ? (
            <Badge tone={confidenceTone(selectedModel.confidence)}>
              {selectedModel.confidence === "high" ? "High" : selectedModel.confidence === "medium" ? "Medium" : "Low"} confidence
            </Badge>
          ) : null}
        </div>
        <h2 className="text-lg font-semibold text-fg">
          <LyricText text={selected.text} words={highlight} />
        </h2>
        {stale ? (
          <p className="rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-sm text-gold">
            The saved model reading was written for an older draft. It is hidden until you analyze again.
          </p>
        ) : null}
        <Section title="Meaning">
          {selectedModel?.meaning ? (
            <p className="text-sm text-muted">{selectedModel.meaning}</p>
          ) : (
            <p className="text-sm text-muted">
              No model reading for this line yet. The lab will not invent one. Run Analyze when you want an interpretation.
            </p>
          )}
        </Section>
        <Section
          title="Writing technique"
          collapsible
          count={techniqueCount || undefined}
          collapsed={collapsed.has("Writing technique")}
          onToggle={() => toggleSection("Writing technique")}
        >
          <BulletList
            items={[...(selectedModel?.wordplay ?? []), ...(selectedModel?.metaphors ?? [])]}
            empty="Nothing noted. A text estimate does not assign metaphors."
          />
        </Section>
        <Section title="Rhyme mechanics">
          <p className="text-sm text-muted">
            {selectedModel?.rhymeMechanics ||
              spellingNote(
                selected,
                estimate.endGroups.some((group) => group.members.some((member) => member.barIndex === selected.index)),
              )}
          </p>
        </Section>
        <Section
          title="Narrative function"
          collapsible
          collapsed={collapsed.has("Narrative function")}
          onToggle={() => toggleSection("Narrative function")}
        >
          <p className="text-sm text-muted">
            {selectedModel?.narrativeFunction || "Unavailable until a model reading is requested."}
          </p>
        </Section>
        <Section
          title="Alternative reading"
          collapsible
          collapsed={collapsed.has("Alternative reading")}
          onToggle={() => toggleSection("Alternative reading")}
        >
          <p className="text-sm text-muted">
            {selectedModel?.alternative || "No alternative reading was returned."}
          </p>
        </Section>
        <Section title="Text estimate">
          <ul className="space-y-1 text-sm text-muted">
            <li>{selected.syllables == null ? "Syllables unavailable." : `${selected.syllables} estimated syllables.`}</li>
            <li>{selected.syllableBasis}</li>
            <li>{selected.endWord ? `End word: ${selected.endWord}.` : "No end word detected."}</li>
            {selected.pauseNote ? <li>{selected.pauseNote}</li> : null}
          </ul>
        </Section>
        <EvidencePanel
          evidenceType={selectedModel ? "interpretive" : "user_provided"}
          source={
            selectedModel
              ? "Meaning and devices come from the model reading of your text. Spelling counts underneath are separate."
              : "Only the line you typed, plus spelling and syllable estimates. Meaning was not inferred."
          }
          uncertainty={selectedModel?.uncertainty ?? "Pronunciation, intent, and delivery were not verified."}
        />
      </Card>
    </div>
  );
}

function Section({
  title,
  children,
  collapsible = false,
  collapsed = false,
  onToggle,
  count,
}: {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  count?: number;
}) {
  const body =
    collapsible && collapsed ? null : <div className="mt-1">{children}</div>;
  return (
    <section>
      {collapsible ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          className="flex w-full items-center justify-between gap-2 rounded-md text-left hover:bg-raised"
        >
          <h3 className="flex items-center gap-2 text-sm font-medium text-fg">
            {title}
            {count ? (
              <Badge tone="pink" className="font-mono">
                {count}
              </Badge>
            ) : null}
          </h3>
          {collapsed ? (
            <ChevronRight className="size-4 text-muted" aria-hidden />
          ) : (
            <ChevronDown className="size-4 text-muted" aria-hidden />
          )}
        </button>
      ) : (
        <h3 className="text-sm font-medium text-fg">{title}</h3>
      )}
      {body}
    </section>
  );
}

function BulletList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <p className="text-sm text-muted">{empty}</p>;
  return (
    <ul className="list-disc space-y-1 pl-4 text-sm text-muted">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function matchesFilter(line: TextBar, filter: FilterId): boolean {
  if (filter === "all") return true;
  if (filter === "end") return Boolean(line.endKey);
  if (filter === "internal") return line.internalWords.length >= 2;
  if (filter === "repeat") return line.repeats.length > 0;
  return Boolean(line.pauseNote);
}

function spellingNote(line: TextBar, sharesEnding: boolean): string {
  const bits = [];
  if (sharesEnding && line.endKey) {
    bits.push(
      `The ending spelling “${line.endKey}” also shows up on another line. That is not a confirmed rhyme.`,
    );
  } else if (line.endWord) {
    bits.push(`The line ends on “${line.endWord}”. No other line shares its last three Latin letters.`);
  }
  if (line.internalWords.length >= 2) {
    bits.push(`Inside the line, ${line.internalWords.join(" and ")} share an ending spelling.`);
  }
  if (bits.length === 0) return "No shared Latin ending was found in this excerpt.";
  return bits.join(" ");
}

interface TagChip extends BarTag {
  letter?: string;
}

function barTagChips(
  line: TextBar,
  barModel: ModelBar | undefined,
  estimate: TextEstimate,
  model: ModelAnalysis | null,
): TagChip[] {
  if (barModel && barModel.tags.length > 0) {
    return barModel.tags.map((tag) => ({
      ...tag,
      letter: model ? letterForModelTag(tag, barModel.index, model) : undefined,
    }));
  }
  const chips: TagChip[] = [];
  if (line.endKey) {
    const group = estimate.endGroups.find((item) =>
      item.members.some((member) => member.barIndex === line.index),
    );
    chips.push({ label: "End Rhyme", kind: "end_rhyme", letter: group?.letter });
  }
  if (line.internalWords.length >= 2) {
    const group = estimate.internalGroups.find((item) =>
      item.members.some((member) => member.barIndex === line.index),
    );
    chips.push({ label: "Internal", kind: "internal_rhyme", letter: group?.letter });
  }
  if (line.repeats.length > 0) chips.push({ label: "Repetition", kind: "repetition" });
  if (line.syllables != null) chips.push({ label: `${line.syllables} syl`, kind: "cadence" });
  return chips;
}

function letterForModelTag(tag: BarTag, barIndex: number, model: ModelAnalysis): string | undefined {
  const type =
    tag.kind === "end_rhyme"
      ? "end"
      : tag.kind === "internal_rhyme"
        ? "internal"
        : tag.kind === "multisyllabic"
          ? "multisyllabic"
          : tag.kind === "slant"
            ? "slant"
            : null;
  if (!type) return undefined;
  const group = model.rhymes.find(
    (item) => item.type === type && item.members.some((member) => member.barIndex === barIndex),
  );
  return group?.letter;
}

function highlightWords(line: TextBar | null): string[] {
  if (!line) return [];
  return [...line.internalWords, ...line.repeats, line.endWord ?? ""].filter(Boolean);
}
