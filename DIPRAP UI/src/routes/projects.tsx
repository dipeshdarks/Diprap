import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/components/projects/ProjectsPage";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "My Projects · DIPRAP" }] }),
  component: ProjectsPage,
});
