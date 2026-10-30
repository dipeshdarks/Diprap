import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useMemo } from "react";
import { AnalysisOptions } from "@/components/analysis/AnalysisOptions";
import { AudioPanel } from "@/components/analysis/AudioPanel";
import { BarByBarExplorer } from "@/components/analysis/BarByBarExplorer";
import { ContextInsights } from "@/components/analysis/ContextInsights";
import { FlowCadenceLab } from "@/components/analysis/FlowCadenceLab";
import { PracticeLab } from "@/components/analysis/PracticeLab";
import { ProjectHeader } from "@/components/analysis/ProjectHeader";
import { RhymeLab } from "@/components/analysis/RhymeLab";
import { LyricsInput } from "@/components/lyrics/LyricsInput";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { analyzeText, countWords, isModelStale, syllableSummary } from "@/lib/text-analysis";
import { useActiveProject, useLabStore } from "@/lib/store";
import { validateLyrics } from "@/lib/validation";
import { ANALYSIS_VIEWS, SCORE_LABEL, type AnalysisView, type Language } from "@/types/analysis";

const VIEW_LABEL: Record<AnalysisView, string> = {
  overview: "Overview",
  lyrics: "Lyrics",
  story: "Story",
  bars: "Bars",
  rhymes: "Rhymes",
  flow: "Flow",
  production: "Production",
  practice: "Practice",
};

export function AnalysisWorkspace({ view }: { view: AnalysisView }) {
  const project = useActiveProject();
  if (!project) {
    return (
      <div className="p-4 md:p-6">
        <EmptyState
          title="No project open"
          body="Create a project from Song Search, or restore the lab demo in Settings."
          action={
            <Button asChild>
              <Link to="/search">Find a song</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 md:p-6">
      <ProjectHeader project={project} />
      <nav aria-label="Analysis views" className="flex gap-1 overflow-x-auto border-b border-border">
        {ANALYSIS_VIEWS.map((item) => (
          <Link
            key={item}
            to="/analyze"
            search={{ view: item }}
            aria-current={item === view ? "page" : undefined}
            className={`shrink-0 border-b-2 px-3 py-3 text-sm ${
              item === view
                ? "border-accent text-fg"
                : "border-transparent text-muted hover:text-fg"
            }`}
          >
            {VIEW_LABEL[item]}
          </Link>
        ))}
      </nav>
      {view === "overview" ? <Overview /> : null}
      {view === "lyrics" ? <LyricsPane /> : null}
      {view === "story" ? <ContextInsights /> : null}
      {view === "bars" ? <BarByBarExplorer /> : null}
      {view === "rhymes" ? <RhymeLab /> : null}
      {view === "flow" ? <FlowCadenceLab /> : null}
      {view === "production" ? <ProductionPane /> : null}
      {view === "practice" ? <PracticeLab /> : null}
    </div>
  );
}

function Overview() {
  const project = useActiveProject();
  const analyzing = useLabStore((state) => state.analyzingProjectId);
  const analyzeProject = useLabStore((state) => state.analyzeProject);
  const estimate = useMemo(
    () => (project ? analyzeText(project.lyrics, project.language) : null),
    [project],
  );
  if (!project || !estimate) return null;
  const summary = syllableSummary(estimate);
  const stale = project.model ? isModelStale(project.model.sourceLines, project.lyrics) : false;
  const lyricsError = validateLyrics(project.lyrics);
  const busy = analyzing === project.id;

  return (
    <div className="space-y-4">
      {project.isDemo ? (
        <p className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted">
          Street Dreams is an original demo written for this lab. It is not a commercial song. Nothing below is a model reading until you press Analyze.
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-faint">Lines</p>
          <p className="font-mono text-2xl tabular-nums text-fg">{estimate.lines.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-faint">Words</p>
          <p className="font-mono text-2xl tabular-nums text-fg">{countWords(project.lyrics)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-faint">Est. syllables</p>
          <p className="font-mono text-2xl tabular-nums text-fg">{summary ? summary.total : "—"}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-faint">Spelling groups</p>
          <p className="font-mono text-2xl tabular-nums text-fg">{estimate.endGroups.length}</p>
        </Card>
      </div>
      <Card className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-fg">Where the reading stands</h2>
          {project.model && !stale ? <Badge tone="ok">Model reading saved</Badge> : <Badge tone="muted">Text estimate only</Badge>}
        </div>
        {project.model && !stale ? (
          <p className="text-sm text-muted">{project.model.overallMeaning || project.model.disclaimer}</p>
        ) : (
          <p className="text-sm text-muted">{estimate.disclaimer}</p>
        )}
        {stale ? (
          <p className="text-sm text-gold">Lyrics changed after the last reading. Analyze again before trusting it.</p>
        ) : null}
        {project.modelError ? (
          <ErrorState message={project.modelError} onRetry={() => void analyzeProject(project.id)} />
        ) : null}
        {lyricsError ? <p className="text-sm text-danger">{lyricsError}</p> : null}
        <Button
          disabled={Boolean(lyricsError) || busy || project.modules.length === 0}
          onClick={() => {
            void analyzeProject(project.id).then(() => {
              const latest = useLabStore.getState().projects.find((item) => item.id === project.id);
              if (latest?.model && !latest.modelError) {
                toast.success("Reading ready. Treat it as an interpretation, not a fact.");
              }
            });
          }}
        >
          {busy ? "Analyzing…" : "Analyze"}
        </Button>
      </Card>
      {project.model && !stale && project.model.scorecard.length > 0 ? (
        <Card className="space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-fg">Scorecard</h2>
            <Badge tone="accent">Model interpretation</Badge>
          </div>
          <ul className="space-y-3">
            {project.model.scorecard.map((entry) => (
              <li key={entry.dimension}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-fg">{SCORE_LABEL[entry.dimension]}</p>
                  <p className="font-mono text-sm tabular-nums text-fg">
                    {entry.score.toFixed(1)} / 10
                  </p>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-raised">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.min(100, Math.max(0, entry.score * 10))}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted">{entry.evidence}</p>
              </li>
            ))}
          </ul>
          {project.model.strongestMoments.length > 0 || project.model.weaknesses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {project.model.strongestMoments.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium text-fg">Strongest moments</h3>
                  <ul className="mt-2 space-y-2 text-sm text-muted">
                    {project.model.strongestMoments.map((moment) => (
                      <li key={`${moment.barIndex}-${moment.moment}`}>
                        <span className="font-mono text-xs text-accent">Line {moment.barIndex + 1}</span>
                        {" — "}
                        {moment.moment} <span className="text-faint">({moment.why})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {project.model.weaknesses.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium text-fg">Weaknesses</h3>
                  <ul className="mt-2 space-y-2 text-sm text-muted">
                    {project.model.weaknesses.map((weakness) => (
                      <li key={weakness.observation}>
                        {weakness.observation} <span className="text-faint">({weakness.evidence})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
          <p className="text-xs text-faint">
            Scores are critical opinion of the model reading, not measurements of quality.
          </p>
        </Card>
      ) : null}
    </div>
  );
}

function LyricsPane() {
  const project = useActiveProject();
  const setLyrics = useLabStore((state) => state.setLyrics);
  const patchProject = useLabStore((state) => state.patchProject);
  const toggleModule = useLabStore((state) => state.toggleModule);
  const analyzeProject = useLabStore((state) => state.analyzeProject);
  const analyzing = useLabStore((state) => state.analyzingProjectId);
  if (!project) return null;
  const lyricsError = validateLyrics(project.lyrics);
  const busy = analyzing === project.id;

  return (
    <Card className="space-y-5 p-4 md:p-5">
      <div>
        <h2 className="text-lg font-semibold text-fg">{project.title}</h2>
        <p className="text-sm text-muted">
          {project.artist} · {project.language}
          {project.sourceUrl ? (
            <>
              {" "}
              ·{" "}
              <a className="text-accent underline" href={project.sourceUrl} target="_blank" rel="noreferrer">
                Reference link
              </a>
            </>
          ) : null}
        </p>
      </div>
      <LyricsInput
        lyrics={project.lyrics}
        language={project.language}
        error={project.lyrics.trim() ? lyricsError : null}
        onLyrics={(value) => setLyrics(project.id, value)}
        onLanguage={(language: Language) => patchProject(project.id, { language })}
        onClear={() => setLyrics(project.id, "")}
      />
      <AnalysisOptions selected={project.modules} onToggle={(moduleId) => toggleModule(project.id, moduleId)} />
      {project.modelError ? <ErrorState message={project.modelError} onRetry={() => void analyzeProject(project.id)} /> : null}
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={Boolean(lyricsError) || busy || project.modules.length === 0}
          onClick={() => void analyzeProject(project.id)}
        >
          {busy ? "Analyzing…" : "Analyze"}
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/analyze" search={{ view: "bars" }}>
            Open bars
          </Link>
        </Button>
      </div>
    </Card>
  );
}

function ProductionPane() {
  return (
    <div className="space-y-4">
      <Card className="space-y-2 p-5">
        <h2 className="text-lg font-semibold text-fg">Production</h2>
        <p className="max-w-2xl text-sm text-muted">
          Mix, sample, and arrangement notes are unavailable. DIPRAP does not invent a producer report. If you attach audio, the only measured facts are duration, sample rate, and a waveform.
        </p>
      </Card>
      <AudioPanel />
    </div>
  );
}
