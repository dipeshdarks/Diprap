import { createFileRoute } from "@tanstack/react-router";
import { ProjectFrame } from "@/components/analysis/ProjectFrame";
import { RhymeLab } from "@/components/analysis/RhymeLab";

export const Route = createFileRoute("/rhyme-lab")({
  head: () => ({ meta: [{ title: "Rhyme Lab · DIPRAP" }] }),
  component: function RhymeLabPage() {
    return (
      <ProjectFrame>
        <RhymeLab />
      </ProjectFrame>
    );
  },
});
