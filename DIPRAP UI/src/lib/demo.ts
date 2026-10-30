import type { LabProject } from "@/types/song";
import { DEMO_LYRICS, DEMO_MODEL_READING } from "@/lib/demo-model";

export const DEMO_PROJECT_ID = "demo-street-dreams";

export function createDemoProject(): LabProject {
  const now = "2026-01-01T00:00:00.000Z";
  return {
    id: DEMO_PROJECT_ID,
    title: "Street Dreams (Demo)",
    artist: "Lab demo",
    language: "English",
    lyrics: DEMO_LYRICS,
    modules: ["meaning", "wordplay", "rhyme", "narrative", "flow", "story", "scorecard"],
    createdAt: now,
    updatedAt: now,
    model: DEMO_MODEL_READING,
    modelError: null,
    practiceNotes: [],
    isDemo: true,
  };
}
