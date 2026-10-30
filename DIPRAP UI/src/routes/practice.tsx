import { createFileRoute } from "@tanstack/react-router";
import { PracticeLab } from "@/components/analysis/PracticeLab";
import { ProjectFrame } from "@/components/analysis/ProjectFrame";

export const Route = createFileRoute("/practice")({
  head: () => ({ meta: [{ title: "Practice Lab · DIPRAP" }] }),
  component: function PracticePage() {
    return (
      <ProjectFrame>
        <PracticeLab />
      </ProjectFrame>
    );
  },
});
