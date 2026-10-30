import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { analyzeLyrics } from "@/lib/analyze.functions";
import { createDemoProject } from "@/lib/demo";
import { validateLyrics } from "@/lib/validation";
import type { Language, ModuleId } from "@/types/analysis";
import type { AttachedAudio, LabProject, PracticeNote } from "@/types/song";

const MAX_AUDIO_BYTES = 30 * 1024 * 1024;
const generations = new Map<string, number>();

interface CreateProjectInput {
  title: string;
  artist: string;
  language: Language;
  lyrics?: string;
  sourceUrl?: string;
  modules?: ModuleId[];
}

interface LabState {
  projects: LabProject[];
  activeProjectId: string | null;
  displayName: string;
  defaultLanguage: Language;
  sidebarCollapsed: boolean;
  selectedBar: number;
  lastSavedAt: string | null;
  analyzingProjectId: string | null;
  audio: AttachedAudio | null;
  setDisplayName: (name: string) => void;
  setDefaultLanguage: (language: Language) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedBar: (index: number) => void;
  setActiveProject: (id: string | null) => void;
  createProject: (input: CreateProjectInput) => string;
  patchProject: (id: string, patch: Partial<LabProject>) => void;
  setLyrics: (id: string, lyrics: string) => void;
  toggleModule: (id: string, moduleId: ModuleId) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => string | null;
  savePracticeNote: (projectId: string, note: PracticeNote) => void;
  restoreDemo: () => void;
  clearAll: () => void;
  markSaved: () => void;
  analyzeProject: (projectId: string) => Promise<void>;
  attachAudio: (projectId: string, file: File) => Promise<{ ok: true } | { ok: false; error: string }>;
  clearAudio: () => void;
}

function touch(project: LabProject, patch: Partial<LabProject>): LabProject {
  return { ...project, ...patch, updatedAt: new Date().toISOString() };
}

export const useLabStore = create<LabState>()(
  persist(
    (set, get) => ({
      projects: [createDemoProject()],
      activeProjectId: createDemoProject().id,
      displayName: "Dipesh",
      defaultLanguage: "English",
      sidebarCollapsed: false,
      selectedBar: 0,
      lastSavedAt: null,
      analyzingProjectId: null,
      audio: null,
      setDisplayName: (name) => set({ displayName: name.slice(0, 40) }),
      setDefaultLanguage: (language) => set({ defaultLanguage: language }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setSelectedBar: (selectedBar) => set({ selectedBar }),
      setActiveProject: (activeProjectId) => set({ activeProjectId, selectedBar: 0 }),
      createProject: (input) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const project: LabProject = {
          id,
          title: input.title.trim(),
          artist: input.artist.trim() || "Unknown artist",
          language: input.language,
          lyrics: input.lyrics ?? "",
          modules:
            input.modules ?? ["meaning", "wordplay", "rhyme", "narrative", "flow", "story", "scorecard"],
          createdAt: now,
          updatedAt: now,
          sourceUrl: input.sourceUrl,
          model: null,
          modelError: null,
          practiceNotes: [],
        };
        set((state) => ({
          projects: [project, ...state.projects],
          activeProjectId: id,
          selectedBar: 0,
        }));
        return id;
      },
      patchProject: (id, patch) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? touch(project, patch) : project,
          ),
        })),
      setLyrics: (id, lyrics) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? touch(project, { lyrics, modelError: null }) : project,
          ),
        })),
      toggleModule: (id, moduleId) =>
        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id !== id) return project;
            const has = project.modules.includes(moduleId);
            const modules = has
              ? project.modules.filter((item) => item !== moduleId)
              : [...project.modules, moduleId];
            return touch(project, { modules });
          }),
        })),
      deleteProject: (id) =>
        set((state) => {
          const projects = state.projects.filter((project) => project.id !== id);
          const activeProjectId =
            state.activeProjectId === id ? (projects[0]?.id ?? null) : state.activeProjectId;
          const audio = state.audio?.projectId === id ? null : state.audio;
          if (state.audio?.projectId === id) URL.revokeObjectURL(state.audio.url);
          return { projects, activeProjectId, audio, selectedBar: 0 };
        }),
      duplicateProject: (id) => {
        const source = get().projects.find((project) => project.id === id);
        if (!source) return null;
        const copyId = crypto.randomUUID();
        const now = new Date().toISOString();
        const copy: LabProject = {
          ...source,
          id: copyId,
          title: `${source.title} copy`.slice(0, 120),
          createdAt: now,
          updatedAt: now,
          isDemo: false,
          practiceNotes: source.practiceNotes.map((note) => ({ ...note })),
          model: source.model ? { ...source.model, bars: [...source.model.bars] } : null,
        };
        set((state) => ({
          projects: [copy, ...state.projects],
          activeProjectId: copyId,
          selectedBar: 0,
        }));
        return copyId;
      },
      savePracticeNote: (projectId, note) =>
        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id !== projectId) return project;
            const practiceNotes = [
              ...project.practiceNotes.filter(
                (item) => !(item.barIndex === note.barIndex && item.prompt === note.prompt),
              ),
              note,
            ];
            return touch(project, { practiceNotes });
          }),
        })),
      restoreDemo: () => {
        const demo = createDemoProject();
        set((state) => {
          if (state.projects.some((project) => project.id === demo.id)) {
            return { activeProjectId: demo.id, selectedBar: 0 };
          }
          return {
            projects: [demo, ...state.projects],
            activeProjectId: demo.id,
            selectedBar: 0,
          };
        });
      },
      clearAll: () => {
        const audio = get().audio;
        if (audio) URL.revokeObjectURL(audio.url);
        const demo = createDemoProject();
        set({
          projects: [demo],
          activeProjectId: demo.id,
          selectedBar: 0,
          audio: null,
          analyzingProjectId: null,
        });
      },
      markSaved: () => set({ lastSavedAt: new Date().toISOString() }),
      analyzeProject: async (projectId) => {
        if (get().analyzingProjectId) return;
        const project = get().projects.find((item) => item.id === projectId);
        if (!project) return;
        const lyricsError = validateLyrics(project.lyrics);
        if (lyricsError) {
          get().patchProject(projectId, { modelError: lyricsError });
          return;
        }
        if (project.modules.length === 0) {
          get().patchProject(projectId, { modelError: "Select at least one analysis module." });
          return;
        }
        const generation = (generations.get(projectId) ?? 0) + 1;
        generations.set(projectId, generation);
        set({ analyzingProjectId: projectId });
        get().patchProject(projectId, { modelError: null });
        try {
          const result = await analyzeLyrics({
            data: {
              lyrics: project.lyrics,
              language: project.language,
              title: project.title,
              artist: project.artist,
              modules: project.modules,
            },
          });
          if (generations.get(projectId) !== generation) return;
          if (!result.ok) {
            get().patchProject(projectId, { modelError: result.error });
            return;
          }
          get().patchProject(projectId, { model: result.analysis, modelError: null });
        } catch (error) {
          if (generations.get(projectId) !== generation) return;
          get().patchProject(projectId, {
            modelError:
              error instanceof Error
                ? error.message
                : "The reading failed. Your lyrics were kept.",
          });
        } finally {
          if (generations.get(projectId) === generation) {
            set({ analyzingProjectId: null });
          }
        }
      },
      attachAudio: async (projectId, file) => {
        if (file.size > MAX_AUDIO_BYTES) {
          return { ok: false, error: "Keep audio files under 30 MB." };
        }
        try {
          const arrayBuffer = await file.arrayBuffer();
          const context = new AudioContext();
          const decoded = await context.decodeAudioData(arrayBuffer.slice(0));
          const channel = decoded.getChannelData(0);
          const buckets = 180;
          const block = Math.max(1, Math.floor(channel.length / buckets));
          const peaks: number[] = [];
          for (let index = 0; index < buckets; index += 1) {
            let max = 0;
            const start = index * block;
            const end = Math.min(channel.length, start + block);
            for (let sample = start; sample < end; sample += 16) {
              max = Math.max(max, Math.abs(channel[sample] ?? 0));
            }
            peaks.push(max);
          }
          const peakMax = Math.max(...peaks, 0.001);
          await context.close();
          const previous = get().audio;
          if (previous) URL.revokeObjectURL(previous.url);
          set({
            audio: {
              projectId,
              fileName: file.name,
              url: URL.createObjectURL(file),
              duration: decoded.duration,
              sampleRate: decoded.sampleRate,
              peaks: peaks.map((peak) => peak / peakMax),
            },
          });
          return { ok: true };
        } catch {
          return { ok: false, error: "That file could not be decoded as audio." };
        }
      },
      clearAudio: () => {
        const audio = get().audio;
        if (audio) URL.revokeObjectURL(audio.url);
        set({ audio: null });
      },
    }),
    {
      name: "diprap-lab",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        projects: state.projects,
        activeProjectId: state.activeProjectId,
        displayName: state.displayName,
        defaultLanguage: state.defaultLanguage,
        sidebarCollapsed: state.sidebarCollapsed,
        lastSavedAt: state.lastSavedAt,
      }),
    },
  ),
);

export function useActiveProject(): LabProject | null {
  return useLabStore((state) => state.projects.find((project) => project.id === state.activeProjectId) ?? null);
}
