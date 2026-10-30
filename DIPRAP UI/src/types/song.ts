import type { Language, ModelAnalysis, ModuleId } from "./analysis";

export interface PracticeNote {
  barIndex: number;
  prompt: "interpretation" | "rewrite";
  text: string;
  updatedAt: string;
}

export interface LabProject {
  id: string;
  title: string;
  artist: string;
  language: Language;
  lyrics: string;
  modules: ModuleId[];
  createdAt: string;
  updatedAt: string;
  sourceUrl?: string;
  model: ModelAnalysis | null;
  modelError: string | null;
  practiceNotes: PracticeNote[];
  isDemo?: boolean;
}

export interface SongMetadata {
  id: string;
  title: string;
  artist: string;
  sourceUrl?: string;
  artworkUrl?: string;
}

export interface AttachedAudio {
  projectId: string;
  fileName: string;
  url: string;
  duration: number;
  sampleRate: number;
  peaks: number[];
}
