import { Link } from "@tanstack/react-router";
import { EvidencePanel } from "@/components/analysis/EvidencePanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { isModelStale } from "@/lib/text-analysis";
import { useActiveProject } from "@/lib/store";
import type { AnalysisInsight } from "@/types/analysis";

const SECTIONS: { key: "themes" | "metaphors" | "doubleMeanings" | "punchlines" | "culturalReferences" | "alternativeInterpretations"; title: string; empty: string }[] = [
  { key: "themes", title: "Themes and narrative", empty: "No themes were returned." },
  { key: "metaphors", title: "Metaphors", empty: "No metaphors were returned." },
  { key: "doubleMeanings", title: "Double meanings", empty: "No double meanings were returned." },
  { key: "punchlines", title: "Punchlines", empty: "No punchlines were returned." },
  { key: "culturalReferences", title: "Cultural references", empty: "No cultural references were returned." },
  { key: "alternativeInterpretations", title: "Alternative interpretations", empty: "No alternatives were returned." },
];

export function ContextInsights() {
  const project = useActiveProject();
  if (!project) {
    return (
      <EmptyState
        title="No project open"
        body="Insights stay attached to a project. Open one, or start from the lyrics you have the right to use."
        action={
          <Button asChild>
            <Link to="/projects">My projects</Link>
          </Button>
        }
      />
    );
  }

  const model = project.model;
  const stale = model ? isModelStale(model.sourceLines, project.lyrics) : false;

  if (!model || stale) {
    return (
      <EmptyState
        title={stale ? "This reading does not match the current lyrics" : "No model reading yet"}
        body={
          stale
            ? "Context cards from the previous reading are hidden so they are not treated as a reading of the new text."
            : "Overall meaning, themes, and references appear here only after you run Analyze. A text estimate does not invent them."
        }
        action={
          <Button asChild>
            <Link to="/analyze" search={{ view: "lyrics" }}>
              Review lyrics and analyze
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-fg">Overall meaning</h2>
          <Badge tone="accent">Model interpretation</Badge>
        </div>
        <p className="text-sm text-muted">
          {model.overallMeaning || "The model did not return an overall reading."}
        </p>
        {model.story ? (
          <dl className="mt-2 space-y-2 text-sm">
            <div>
              <dt className="font-medium text-fg">Central message</dt>
              <dd className="text-muted">{model.story.centralMessage}</dd>
            </div>
            <div>
              <dt className="font-medium text-fg">Narrative arc</dt>
              <dd className="text-muted">{model.story.narrativeArc}</dd>
            </div>
            <div>
              <dt className="font-medium text-fg">Atmosphere</dt>
              <dd className="text-muted">{model.story.atmosphere}</dd>
            </div>
            <div>
              <dt className="font-medium text-fg">Perspective</dt>
              <dd className="text-muted">{model.story.perspective}</dd>
            </div>
            <div>
              <dt className="font-medium text-fg">Language notes</dt>
              <dd className="text-muted">{model.story.languageNotes}</dd>
            </div>
          </dl>
        ) : null}
        <p className="text-sm text-faint">{model.disclaimer}</p>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {SECTIONS.map((section) => (
          <InsightCard
            key={section.key}
            title={section.title}
            empty={section.empty}
            items={model[section.key]}
          />
        ))}
      </div>
      <EvidencePanel
        evidenceType="interpretive"
        source={`Reading produced ${new Date(model.generatedAt).toLocaleString()} by ${model.model} from the lines saved with this project. Cultural references are marked unverified inside their cards.`}
        uncertainty={model.limitations}
      />
    </div>
  );
}

function InsightCard({
  title,
  items,
  empty,
}: {
  title: string;
  items: AnalysisInsight[];
  empty: string;
}) {
  return (
    <Card className="space-y-3 p-4">
      <h3 className="text-base font-semibold text-fg">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted">{empty}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-fg">{item.title}</p>
                <Badge tone={item.evidenceType === "unverified" ? "gold" : "accent"}>
                  {item.evidenceType === "unverified" ? "Unverified context" : "Model interpretation"}
                </Badge>
              </div>
              <p className="text-sm text-muted">{item.explanation}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
