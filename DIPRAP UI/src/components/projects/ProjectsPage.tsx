import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { splitBars } from "@/lib/text-analysis";
import { useLabStore } from "@/lib/store";

export function ProjectsPage() {
  const projects = useLabStore((state) => state.projects);
  const setActiveProject = useLabStore((state) => state.setActiveProject);
  const deleteProject = useLabStore((state) => state.deleteProject);
  const duplicateProject = useLabStore((state) => state.duplicateProject);
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const target = projects.find((project) => project.id === pendingDelete);

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-semibold text-fg">My projects</h1>
        <p className="mt-2 text-sm text-muted">Stored in this browser only. Clearing site data removes them.</p>
      </div>
      {projects.length === 0 ? (
        <EmptyState title="No projects" body="Create one from Song Search or restore the demo in Settings." />
      ) : (
        <div className="grid gap-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-base font-semibold text-fg">{project.title}</h2>
                  {project.isDemo ? <Badge tone="gold">Lab demo</Badge> : null}
                  <Badge tone={project.model ? "ok" : "muted"}>
                    {project.model ? "Model reading" : "Text estimate"}
                  </Badge>
                </div>
                <p className="text-sm text-muted">
                  {project.artist} · {project.language} · {splitBars(project.lyrics).length} bars
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setActiveProject(project.id);
                    void navigate({ to: "/analyze", search: { view: "overview" } });
                  }}
                >
                  Open
                </Button>
                <Button variant="secondary" onClick={() => duplicateProject(project.id)}>
                  Duplicate
                </Button>
                <Button variant="danger" onClick={() => setPendingDelete(project.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={Boolean(target)}
        title="Delete this project?"
        body={target ? `${target.title} will be removed from this browser.` : ""}
        confirmLabel="Delete"
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        onConfirm={() => {
          if (pendingDelete) deleteProject(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
