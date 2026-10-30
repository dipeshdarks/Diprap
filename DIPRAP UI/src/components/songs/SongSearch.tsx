import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SongResultCard } from "@/components/songs/SongResultCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { geniusSearchUrl, getSongSearchConfig } from "@/lib/song-search";
import { splitBars } from "@/lib/text-analysis";
import { useLabStore } from "@/lib/store";
import { validateArtist, validateTitle, validateUrl } from "@/lib/validation";
import { LANGUAGES, type Language } from "@/types/analysis";

export function SongSearch() {
  const projects = useLabStore((state) => state.projects);
  const createProject = useLabStore((state) => state.createProject);
  const setActiveProject = useLabStore((state) => state.setActiveProject);
  const defaultLanguage = useLabStore((state) => state.defaultLanguage);
  const navigate = useNavigate();
  const config = getSongSearchConfig();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [sourceUrl, setSourceUrl] = useState("");
  const [filter, setFilter] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "analyzed">("all");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(filter), 250);
    return () => window.clearTimeout(timer);
  }, [filter]);

  const filtered = useMemo(() => {
    const needle = debounced.trim().toLowerCase();
    return projects.filter((project) => {
      if (status === "draft" && project.model) return false;
      if (status === "analyzed" && !project.model) return false;
      if (!needle) return true;
      return `${project.title} ${project.artist} ${project.language}`.toLowerCase().includes(needle);
    });
  }, [projects, debounced, status]);

  const query = [title, artist].map((part) => part.trim()).filter(Boolean).join(" ");
  const geniusUrl = geniusSearchUrl(query);

  function create() {
    const titleError = validateTitle(title);
    const artistError = validateArtist(artist);
    const urlError = validateUrl(sourceUrl);
    const message = titleError || artistError || urlError;
    if (message) {
      setFormError(message);
      return;
    }
    setFormError(null);
    createProject({
      title: title.trim(),
      artist: artist.trim(),
      language,
      sourceUrl: sourceUrl.trim() || undefined,
    });
    void navigate({ to: "/analyze", search: { view: "lyrics" } });
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-semibold text-fg">Find a song</h1>
        <p className="mt-2 max-w-2xl text-muted">Discover tracks. Decode the writing.</p>
      </div>
      <Card className="space-y-2 border-gold/30 p-4">
        <h2 className="text-base font-semibold text-fg">Genius is not connected</h2>
        <p className="text-sm text-muted">{config.reason}</p>
        <p className="text-sm text-muted">
          Search Genius in a new tab, then paste only lyrics you have the right to use. This page will not show fake results.
        </p>
      </Card>
      <Card className="space-y-4 p-4">
        <h2 className="text-base font-semibold text-fg">Start from metadata you enter</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-muted">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-11 rounded-md border border-border bg-bg px-3 text-fg"
            />
          </label>
          <label className="grid gap-2 text-sm text-muted">
            Artist
            <input
              value={artist}
              onChange={(event) => setArtist(event.target.value)}
              className="h-11 rounded-md border border-border bg-bg px-3 text-fg"
            />
          </label>
          <label className="grid gap-2 text-sm text-muted">
            Language
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              className="h-11 rounded-md border border-border bg-bg px-3 text-fg"
            >
              {LANGUAGES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm text-muted">
            Reference link (optional)
            <input
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
              placeholder="https://"
              className="h-11 rounded-md border border-border bg-bg px-3 text-fg placeholder:text-faint"
            />
          </label>
        </div>
        {formError ? (
          <p role="alert" className="text-sm text-danger">
            {formError}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button onClick={create}>Create project</Button>
          <Button variant="secondary" asChild>
            <a href={geniusUrl} target="_blank" rel="noreferrer">
              {query ? `Search Genius for “${query}”` : "Open Genius"}
            </a>
          </Button>
        </div>
        {query ? (
          <SongResultCard
            title={title.trim()}
            artist={artist.trim() || "Artist not set"}
            meta={`${language} · not a live search result`}
            badge="Entered by you"
            footnote="No artwork is shown because Genius did not return an authorized image."
            geniusUrl={geniusUrl}
            openLabel="Use this title"
            onOpen={create}
          />
        ) : null}
      </Card>
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-semibold text-fg">On this device</h2>
          <div className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="saved-filter">
              Filter saved projects
            </label>
            <input
              id="saved-filter"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Filter by title or artist"
              className="h-11 rounded-md border border-border bg-surface px-3 text-sm text-fg placeholder:text-faint"
            />
            <select
              aria-label="Project status"
              value={status}
              onChange={(event) => setStatus(event.target.value as "all" | "draft" | "analyzed")}
              className="h-11 rounded-md border border-border bg-surface px-3 text-sm text-fg"
            >
              <option value="all">All</option>
              <option value="draft">Text only</option>
              <option value="analyzed">Model reading</option>
            </select>
          </div>
        </div>
        {filtered.length === 0 ? (
          <EmptyState
            title="No projects match"
            body="Nothing saved in this browser fits that filter."
          />
        ) : (
          <div className="grid gap-3">
            {filtered.map((project) => (
              <SongResultCard
                key={project.id}
                title={project.title}
                artist={project.artist}
                meta={`${project.language} · ${splitBars(project.lyrics).length} bars`}
                badge={project.model ? "Model reading" : project.isDemo ? "Lab demo" : "Text estimate"}
                geniusUrl={project.sourceUrl}
                openLabel="Analyze"
                onOpen={() => {
                  setActiveProject(project.id);
                  void navigate({ to: "/analyze", search: { view: "lyrics" } });
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
