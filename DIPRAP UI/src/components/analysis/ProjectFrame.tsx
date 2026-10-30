import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ProjectHeader } from "@/components/analysis/ProjectHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useActiveProject } from "@/lib/store";

export function ProjectFrame({ children }: { children: ReactNode }) {
  const project = useActiveProject();
  if (!project) {
    return (
      <div className="p-4 md:p-6">
        <EmptyState
          title="No project open"
          body="Choose a project before using this lab."
          action={
            <Button asChild>
              <Link to="/projects">My projects</Link>
            </Button>
          }
        />
      </div>
    );
  }
  return (
    <div className="space-y-5 p-4 md:p-6">
      <ProjectHeader project={project} />
      {children}
    </div>
  );
}
