import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { splitBars } from "@/lib/text-analysis";
import { useLabStore } from "@/lib/store";

export function Dashboard() {
  const projects = useLabStore((state) => state.projects);
  const active = useLabStore((state) =>
    state.projects.find((project) => project.id === state.activeProjectId),
  );
  const createProject = useLabStore((state) => state.createProject);
  const defaultLanguage = useLabStore((state) => state.defaultLanguage);
  const navigate = useNavigate();
  const analyzed = projects.filter((project) => project.model).length;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-accent">DIPRAP</p>
          <h1 className="mt-2 text-3xl font-semibold text-fg">Rap lyrics, read closely.</h1>
          <p className="mt-2 text-muted">
            Break a verse into bars, separate spelling from sound, and ask for a model reading only when you want one. Nothing here pretends to be a finished fact.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {active ? (
            <Button asChild>
              <Link to="/analyze" search={{ view: "overview" }}>
                Continue
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          ) : null}
          <Button
            variant="secondary"
            onClick={() => {
              createProject({ title: "Untitled analysis", artist: "", language: defaultLanguage });
              void navigate({ to: "/analyze", search: { view: "lyrics" } });
            }}
          >
            <Plus className="size-4" aria-hidden />
            New analysis
          </Button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-faint">Projects on this device</p>
          <p className="font-mono text-2xl tabular-nums text-fg">{projects.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-faint">With a model reading</p>
          <p className="font-mono text-2xl tabular-nums text-fg">{analyzed}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-faint">Bars in the open project</p>
          <p className="font-mono text-2xl tabular-nums text-fg">
            {active ? splitBars(active.lyrics).length : 0}
          </p>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <h2 className="text-lg font-semibold text-fg">Open project</h2>
          {active ? (
            <div className="mt-3 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-medium text-fg">{active.title}</p>
                {active.isDemo ? <Badge tone="gold">Lab demo</Badge> : null}
                <Badge tone={active.model ? "ok" : "muted"}>
                  {active.model ? "Model reading" : "Text estimate"}
                </Badge>
              </div>
              <p className="text-sm text-muted">{active.artist}</p>
              <ol className="space-y-2">
                {splitBars(active.lyrics)
                  .slice(0, 4)
                  .map((line, index) => (
                    <li key={`${index}-${line}`} className="flex gap-3 text-sm text-fg">
                      <span className="font-mono text-xs text-faint">{index + 1}</span>
                      <span>{line}</span>
                    </li>
                  ))}
              </ol>
              <Button variant="secondary" asChild>
                <Link to="/analyze" search={{ view: "bars" }}>
                  Open bar by bar
                </Link>
              </Button>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">No project is open.</p>
          )}
        </Card>
        <Card className="space-y-3 p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-fg">What a label means</h2>
          <p className="text-sm text-muted">
            <span className="text-fg">Text estimate.</span> Counts and spelling from the excerpt.
          </p>
          <p className="text-sm text-muted">
            <span className="text-fg">Model interpretation.</span> A reading you request. It can miss.
          </p>
          <p className="text-sm text-muted">
            <span className="text-fg">Measured.</span> Only from audio you attach in this session.
          </p>
          <p className="text-sm text-muted">
            <span className="text-fg">Unavailable.</span> BPM, breath timing, and verified pronunciation stay blank on purpose.
          </p>
        </Card>
      </div>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-fg">Recent projects</h2>
          <Link to="/projects" className="text-sm text-accent">
            View all
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {projects.slice(0, 4).map((project) => (
            <Card key={project.id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate font-medium text-fg">{project.title}</p>
                <p className="truncate text-sm text-muted">
                  {project.artist} · {splitBars(project.lyrics).length} bars
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  useLabStore.getState().setActiveProject(project.id);
                  void navigate({ to: "/analyze", search: { view: "overview" } });
                }}
              >
                Open
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
