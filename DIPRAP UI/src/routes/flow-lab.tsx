import { createFileRoute } from "@tanstack/react-router";
import { FlowCadenceLab } from "@/components/analysis/FlowCadenceLab";
import { ProjectFrame } from "@/components/analysis/ProjectFrame";

export const Route = createFileRoute("/flow-lab")({
  head: () => ({ meta: [{ title: "Flow & Cadence · DIPRAP" }] }),
  component: function FlowLabPage() {
    return (
      <ProjectFrame>
        <FlowCadenceLab />
      </ProjectFrame>
    );
  },
});
