import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  AudioLines,
  BookOpen,
  ChevronLeft,
  FolderOpen,
  GraduationCap,
  Home,
  PanelLeft,
  Rows3,
  Search,
  Settings,
} from "lucide-react";
import { initials } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useLabStore } from "@/lib/store";
import type { AnalysisView } from "@/types/analysis";

function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="size-9 shrink-0 text-accent" aria-hidden>
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path
        d="M7 17.5v-3M11 20.5v-9M15 22.5v-13M19 20v-8M23 17.5v-3"
        className="stroke-bg"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Sidebar({
  collapsed,
  onNavigate,
  mobile = false,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const view = useRouterState({ select: (state) => (state.location.search as { view?: string }).view });
  const project = useLabStore((state) =>
    state.projects.find((item) => item.id === state.activeProjectId),
  );
  const setCollapsed = useLabStore((state) => state.setSidebarCollapsed);
  const narrow = collapsed && !mobile;

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-border bg-surface",
        mobile ? "w-72" : narrow ? "w-16" : "w-64",
      )}
    >
      <div className={cn("flex items-center gap-3 px-3 py-4", narrow && "justify-center px-2")}>
        <Mark />
        {narrow ? null : (
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-wide text-fg">DIPRAP</p>
            <p className="truncate text-xs text-faint">Rap Lyrics & Song Analysis Lab</p>
          </div>
        )}
      </div>
      <nav aria-label="Primary" className="flex flex-1 flex-col gap-1 overflow-y-auto px-2">
        <NavItem
          to="/"
          label="Dashboard"
          icon={<Home className="size-4" aria-hidden />}
          narrow={narrow}
          current={pathname === "/"}
          onNavigate={onNavigate}
        />
        <NavItem
          to="/search"
          label="Song Search"
          icon={<Search className="size-4" aria-hidden />}
          narrow={narrow}
          current={pathname === "/search"}
          onNavigate={onNavigate}
        />
        <AnalyzeItem
          label="Bar-by-Bar Analysis"
          view="bars"
          icon={<Rows3 className="size-4" aria-hidden />}
          narrow={narrow}
          current={pathname === "/analyze" && view === "bars"}
          onNavigate={onNavigate}
        />
        <AnalyzeItem
          label="Context & Insights"
          view="story"
          icon={<BookOpen className="size-4" aria-hidden />}
          narrow={narrow}
          current={pathname === "/analyze" && view === "story"}
          onNavigate={onNavigate}
        />
        <NavItem
          to="/rhyme-lab"
          label="Rhyme Lab"
          icon={<AudioLines className="size-4" aria-hidden />}
          narrow={narrow}
          current={pathname === "/rhyme-lab"}
          onNavigate={onNavigate}
        />
        <NavItem
          to="/flow-lab"
          label="Flow & Cadence"
          icon={<Activity className="size-4" aria-hidden />}
          narrow={narrow}
          current={pathname === "/flow-lab"}
          onNavigate={onNavigate}
        />
        <NavItem
          to="/practice"
          label="Practice Lab"
          icon={<GraduationCap className="size-4" aria-hidden />}
          narrow={narrow}
          current={pathname === "/practice"}
          onNavigate={onNavigate}
        />
        <NavItem
          to="/projects"
          label="My Projects"
          icon={<FolderOpen className="size-4" aria-hidden />}
          narrow={narrow}
          current={pathname === "/projects"}
          onNavigate={onNavigate}
        />
        <NavItem
          to="/settings"
          label="Settings"
          icon={<Settings className="size-4" aria-hidden />}
          narrow={narrow}
          current={pathname === "/settings"}
          onNavigate={onNavigate}
        />
      </nav>
      <div className="space-y-2 border-t border-border p-2">
        {project && !narrow ? (
          <Link
            to="/analyze"
            search={{ view: "overview" }}
            onClick={onNavigate}
            className="block rounded-md border border-border bg-bg px-3 py-2 hover:border-accent"
          >
            <p className="text-xs text-faint">Current project</p>
            <p className="truncate text-sm font-medium text-fg">{project.title}</p>
            <p className="truncate text-xs text-muted">{project.artist}</p>
            <p className="mt-2 text-xs text-muted">
              {project.model ? "Model reading saved" : "Text estimate only"}
            </p>
            <div className="mt-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-faint">Analysis Progress</p>
                <p className="font-mono text-xs text-muted">
                  {project.modules.length} / 7 modules
                </p>
              </div>
              <div
                className="mt-1 h-1.5 overflow-hidden rounded-full bg-raised"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={7}
                aria-valuenow={project.modules.length}
                aria-label="Analysis modules completed"
              >
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${(project.modules.length / 7) * 100}%` }}
                />
              </div>
            </div>
          </Link>
        ) : null}
        {mobile ? null : (
          <button
            type="button"
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md text-sm text-muted hover:bg-raised hover:text-fg"
            onClick={() => setCollapsed(!collapsed)}
            aria-pressed={collapsed}
          >
            {collapsed ? <PanelLeft className="size-4" aria-hidden /> : <ChevronLeft className="size-4" aria-hidden />}
            {narrow ? <span className="sr-only">Expand sidebar</span> : "Collapse"}
          </button>
        )}
      </div>
    </aside>
  );
}

function NavItem({
  to,
  label,
  icon,
  narrow,
  current,
  onNavigate,
}: {
  to: "/" | "/search" | "/rhyme-lab" | "/flow-lab" | "/practice" | "/projects" | "/settings";
  label: string;
  icon: ReactNode;
  narrow: boolean;
  current: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      aria-current={current ? "page" : undefined}
      title={narrow ? label : undefined}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm",
        narrow && "justify-center px-0",
        current ? "bg-accent text-accent-fg" : "text-muted hover:bg-raised hover:text-fg",
      )}
    >
      {icon}
      {narrow ? <span className="sr-only">{label}</span> : label}
    </Link>
  );
}

function AnalyzeItem({
  label,
  view,
  icon,
  narrow,
  current,
  onNavigate,
}: {
  label: string;
  view: AnalysisView;
  icon: ReactNode;
  narrow: boolean;
  current: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      to="/analyze"
      search={{ view }}
      onClick={onNavigate}
      aria-current={current ? "page" : undefined}
      title={narrow ? label : undefined}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm",
        narrow && "justify-center px-0",
        current ? "bg-accent text-accent-fg" : "text-muted hover:bg-raised hover:text-fg",
      )}
    >
      {icon}
      {narrow ? <span className="sr-only">{label}</span> : label}
    </Link>
  );
}

export function BrandInitials({ name }: { name: string }) {
  return (
    <span className="grid size-9 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-fg">
      {initials(name)}
    </span>
  );
}
