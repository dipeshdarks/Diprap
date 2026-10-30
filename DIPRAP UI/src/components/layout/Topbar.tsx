import * as Dialog from "@radix-ui/react-dialog";
import { Link, useNavigate } from "@tanstack/react-router";
import { HelpCircle, Menu, Search, Settings, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { BrandInitials } from "@/components/layout/Sidebar";
import { useLabStore } from "@/lib/store";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const projects = useLabStore((state) => state.projects);
  const displayName = useLabStore((state) => state.displayName);
  const setActiveProject = useLabStore((state) => state.setActiveProject);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 200);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const needle = debounced.trim().toLowerCase();
    if (!needle) return [];
    return projects
      .filter((project) =>
        `${project.title} ${project.artist} ${project.lyrics}`.toLowerCase().includes(needle),
      )
      .slice(0, 8);
  }, [debounced, projects]);

  const request = debounced.trim();
  const showList = open && request.length > 0;

  return (
    <header className="flex min-h-16 items-center gap-2 border-b border-border bg-bg/90 px-3 md:gap-4 md:px-5">
      <button
        type="button"
        className="grid size-11 place-items-center rounded-md text-fg hover:bg-raised md:hidden"
        onClick={onMenu}
        aria-label="Open navigation"
      >
        <Menu className="size-5" aria-hidden />
      </button>
      <div className="relative min-w-0 flex-1">
        <label className="sr-only" htmlFor="project-search">
          Search projects
        </label>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" aria-hidden />
        <input
          id="project-search"
          ref={inputRef}
          value={query}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          placeholder="Search projects, artists, or lyrics…"
          suppressHydrationWarning
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          className="h-11 w-full rounded-md border border-border bg-surface pr-16 pl-10 text-sm text-fg placeholder:text-faint"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-border px-1.5 py-0.5 font-mono text-xs text-faint sm:inline">
          Ctrl K
        </kbd>
        {showList ? (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-md border border-border bg-raised p-1 shadow-lg"
          >
            {results.length === 0 ? (
              <li className="px-3 py-3 text-sm text-muted">No saved projects match.</li>
            ) : (
              results.map((project) => (
                <li key={project.id} role="option" aria-selected={false}>
                  <button
                    type="button"
                    className="flex min-h-11 w-full flex-col items-start justify-center rounded px-3 text-left hover:bg-surface"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setActiveProject(project.id);
                      setQuery("");
                      setOpen(false);
                      void navigate({ to: "/analyze", search: { view: "overview" } });
                    }}
                  >
                    <span className="text-sm text-fg">{project.title}</span>
                    <span className="text-xs text-muted">{project.artist}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-md text-muted hover:bg-raised hover:text-fg"
            aria-label="How readings are labeled"
          >
            <HelpCircle className="size-5" aria-hidden />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/80" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[85dvh] w-[min(100%-2rem,36rem)] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-lg border border-border bg-surface p-6">
            <div className="flex items-start justify-between gap-4">
              <Dialog.Title className="text-lg font-semibold text-fg">How readings are labeled</Dialog.Title>
              <Dialog.Close className="grid size-11 place-items-center rounded-md text-muted hover:bg-raised" aria-label="Close">
                <X className="size-4" aria-hidden />
              </Dialog.Close>
            </div>
            <Dialog.Description className="mt-2 text-sm text-muted">
              DIPRAP separates what you typed from what a model suggests and from what was actually measured.
            </Dialog.Description>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>
                <span className="text-fg">User-provided text.</span> The lines you pasted. The lab does not download lyrics.
              </li>
              <li>
                <span className="text-fg">Text estimate.</span> Spelling groups, repeated words, punctuation, and an English syllable guess.
              </li>
              <li>
                <span className="text-fg">Model interpretation.</span> A reading you request. It can be useful and still be wrong.
              </li>
              <li>
                <span className="text-fg">Measured.</span> Only facts taken from an audio file you attach, such as duration.
              </li>
              <li>
                <span className="text-fg">Unavailable.</span> Tempo, breath timing, and verified pronunciation are not invented.
              </li>
            </ul>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Link
        to="/settings"
        aria-label="Settings"
        className="grid size-11 place-items-center rounded-md text-muted hover:bg-raised hover:text-fg"
      >
        <Settings className="size-5" aria-hidden />
      </Link>
      <Link to="/settings" aria-label={`${displayName}, open settings`} className="rounded-full">
        <BrandInitials name={displayName} />
      </Link>
    </header>
  );
}
