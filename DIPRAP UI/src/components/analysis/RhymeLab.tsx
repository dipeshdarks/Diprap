import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EvidencePanel } from "@/components/analysis/EvidencePanel";
import { LyricText } from "@/components/analysis/LyricText";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { analyzeText, isModelStale } from "@/lib/text-analysis";
import { useActiveProject, useLabStore } from "@/lib/store";

type Source = "model" | "spelling";

export function RhymeLab() {
  const project = useActiveProject();
  const setSelectedBar = useLabStore((state) => state.setSelectedBar);
  const estimate = useMemo(
    () => (project ? analyzeText(project.lyrics, project.language) : null),
    [project],
  );
  const stale = project?.model ? isModelStale(project.model.sourceLines, project.lyrics) : false;
  const modelReady = Boolean(project?.model && !stale && project.model.rhymes.length > 0);
  const [source, setSource] = useState<Source>(modelReady ? "model" : "spelling");
  const activeSource: Source = source === "model" && modelReady ? "model" : "spelling";
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!project || !estimate) {
    return (
      <EmptyState
        title="No lyrics to compare"
        body="Rhyme groups are built from a project. Paste lines you have the right to study."
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

  const spellingGroups = [...estimate.endGroups, ...estimate.internalGroups];
  const modelGroups = !stale && project.model ? project.model.rhymes : [];
  const groups = activeSource === "model" ? modelGroups : spellingGroups;
  const current = groups.find((group) => group.id === selectedId) ?? groups[0] ?? null;
  const words = current ? current.members.map((member) => member.word) : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-fg">Rhyme lab</h2>
          <p className="text-sm text-muted">
            Spelling groups are calculated here. Phonetic groups appear only after a model reading, and they stay guesses.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeSource === "spelling" ? "primary" : "secondary"}
            onClick={() => setSource("spelling")}
            aria-pressed={activeSource === "spelling"}
          >
            Spelling pass
          </Button>
          <Button
            variant={activeSource === "model" ? "primary" : "secondary"}
            onClick={() => setSource("model")}
            disabled={!modelReady}
            aria-pressed={activeSource === "model"}
          >
            Model reading
          </Button>
        </div>
      </div>
      {stale ? (
        <p className="rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-sm text-gold">
          The model rhyme list is hidden because the lyrics changed after that reading.
        </p>
      ) : null}
      {groups.length === 0 ? (
        <EmptyState
          title={activeSource === "model" ? "No rhyme groups in that reading" : "No shared endings yet"}
          body={
            activeSource === "model"
              ? "The model did not return rhyme groups whose words actually appear in the lines."
              : "The spelling pass only groups Latin endings that repeat, or in-line pairs that share an ending. It will not invent slant rhymes."
          }
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-5">
          <Card className="space-y-2 p-3 xl:col-span-2">
            {groups.map((group) => {
              const active = group.id === current?.id;
              const label = group.type;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedId(group.id)}
                  aria-pressed={active}
                  className={`w-full rounded-md border px-3 py-3 text-left ${
                    active ? "border-accent bg-accent/10" : "border-border hover:bg-raised"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={activeSource === "model" ? "accent" : "gold"}>
                      <span className="font-mono font-semibold">{group.letter}</span>
                      {label}
                    </Badge>
                    <span className="font-mono text-xs text-muted">
                      {"sound" in group ? group.sound : group.key}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-fg">
                    {group.members.map((member) => member.word).join(" · ")}
                  </p>
                </button>
              );
            })}
          </Card>
          <div className="space-y-4 xl:col-span-3">
            <Card className="divide-y divide-border">
              {estimate.lines.map((line) => {
                const inGroup = current?.members.some((member) => member.barIndex === line.index) ?? false;
                return (
                  <button
                    key={line.index}
                    type="button"
                    onClick={() => setSelectedBar(line.index)}
                    className={`flex w-full gap-3 px-4 py-3 text-left ${inGroup ? "bg-accent/10" : "hover:bg-raised"}`}
                  >
                    <span className="font-mono text-xs text-faint">{line.index + 1}</span>
                    <LyricText text={line.text} words={inGroup ? words : []} />
                  </button>
                );
              })}
            </Card>
            {current ? (
              <Card className="space-y-3 p-4">
                <h3 className="text-base font-semibold text-fg">
                  Group <span className="font-mono">{current.letter}</span> — {current.type}
                </h3>
                <ul className="space-y-2 text-sm text-muted">
                  {current.members.map((member) => (
                    <li key={`${member.barIndex}-${member.word}`}>
                      <span className="text-fg">Bar {member.barIndex + 1}:</span> {member.word}
                      {"note" in member && member.note ? ` — ${member.note}` : ""}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted">{current.explanation}</p>
                <EvidencePanel
                  evidenceType={activeSource === "model" ? "model_estimated" : "user_provided"}
                  source={
                    activeSource === "model"
                      ? "Sound labels are the model’s phonetic guess. Words were kept only when they appear in your line."
                      : "Grouped by matching Latin letters. Pronunciation was not checked."
                  }
                  uncertainty={
                    activeSource === "model"
                      ? "A guessed sound can be wrong, especially across accents."
                      : "Shared spelling is not the same thing as a rhyme."
                  }
                />
              </Card>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
