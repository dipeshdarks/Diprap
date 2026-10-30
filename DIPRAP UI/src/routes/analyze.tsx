import { createFileRoute } from "@tanstack/react-router";
import { AnalysisWorkspace } from "@/components/analysis/AnalysisWorkspace";
import { ANALYSIS_VIEWS, type AnalysisView } from "@/types/analysis";

export const Route = createFileRoute("/analyze")({
  validateSearch: (search: Record<string, unknown>): { view: AnalysisView } => {
    const view = search.view;
    if (typeof view === "string" && (ANALYSIS_VIEWS as readonly string[]).includes(view)) {
      return { view: view as AnalysisView };
    }
    return { view: "overview" };
  },
  head: () => ({ meta: [{ title: "Analysis · DIPRAP" }] }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const { view } = Route.useSearch();
  return <AnalysisWorkspace view={view} />;
}
