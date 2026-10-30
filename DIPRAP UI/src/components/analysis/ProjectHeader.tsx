import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { ChevronDown, Download, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { downloadJson, slugify } from "@/lib/download";
import { splitBars } from "@/lib/text-analysis";
import { isModelStale } from "@/lib/text-analysis";
import { useLabStore } from "@/lib/store";
import type { LabProject } from "@/types/song";

export function ProjectHeader({ project }: { project: LabProject }) {
  const markSaved = useLabStore((state) => state.markSaved);
  const lastSavedAt = useLabStore((state) => state.lastSavedAt);
  const createProject = useLabStore((state) => state.createProject);
  const defaultLanguage = useLabStore((state) => state.defaultLanguage);
  const analyzing = useLabStore((state) => state.analyzingProjectId === project.id);
  const navigate = useNavigate();
  const bars = splitBars(project.lyrics).length;
  const stale = project.model ? isModelStale(project.model.sourceLines, project.lyrics) : false;
  const moduleCount = project.modules.length;

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <Link to="/projects" className="text-sm text-muted hover:text-fg">
          Back to projects
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold text-fg">{project.title}</h1>
          {analyzing ? (
            <Badge tone="accent">Reading…</Badge>
          ) : project.model && !stale ? (
            <Badge tone="ok">Analysis Complete</Badge>
          ) : stale ? (
            <Badge tone="gold">Reading is stale</Badge>
          ) : (
            <Badge tone="gold">Draft</Badge>
          )}
          {project.isDemo ? <Badge tone="gold">Lab demo</Badge> : null}
        </div>
        <p className="mt-1 text-sm text-muted">
          {project.artist}
          <span aria-hidden> · </span>
          {project.language}
          <span aria-hidden> · </span>
          {bars} {bars === 1 ? "line" : "lines"}
          <span aria-hidden> · </span>
          {moduleCount} / 7 modules
          {lastSavedAt ? (
            <>
              <span aria-hidden> · </span>
              Saved {format(new Date(lastSavedAt), "MMM d, h:mm a")}
            </>
          ) : null}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            markSaved();
            toast.success("Saved in this browser.");
          }}
        >
          <Save className="size-4" aria-hidden />
          Save
        </Button>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="secondary">
              <Download className="size-4" aria-hidden />
              Export
              <ChevronDown className="size-4" aria-hidden />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="z-50 min-w-48 rounded-md border border-border bg-raised p-1" sideOffset={8}>
              <DropdownMenu.Item
                className="min-h-11 cursor-pointer rounded px-3 py-2 text-sm text-fg outline-none data-[highlighted]:bg-surface"
                onSelect={() => {
                  downloadJson(`${slugify(project.title)}.diprap.json`, {
                    exportedFrom: "DIPRAP",
                    notice:
                      "Model fields are interpretations. Text estimates are rule-based. Audio files are not included.",
                    project,
                  });
                  toast.success("Exported JSON.");
                }}
              >
                Download JSON
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="min-h-11 cursor-pointer rounded px-3 py-2 text-sm text-fg outline-none data-[highlighted]:bg-surface"
                onSelect={() => {
                  void navigator.clipboard.writeText(project.lyrics).then(
                    () => toast.success("Lyrics copied."),
                    () => toast.error("Could not copy lyrics."),
                  );
                }}
              >
                Copy lyrics
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <Button
          onClick={() => {
            createProject({
              title: "Untitled analysis",
              artist: "",
              language: defaultLanguage,
            });
            void navigate({ to: "/analyze", search: { view: "lyrics" } });
          }}
        >
          <Plus className="size-4" aria-hidden />
          New analysis
        </Button>
      </div>
    </div>
  );
}
