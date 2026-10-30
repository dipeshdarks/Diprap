import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { downloadJson } from "@/lib/download";
import { getAiAvailability } from "@/lib/analyze.functions";
import { getSongSearchConfig } from "@/lib/song-search";
import { useLabStore } from "@/lib/store";
import { LANGUAGES, type Language } from "@/types/analysis";

export function SettingsPage() {
  const displayName = useLabStore((state) => state.displayName);
  const setDisplayName = useLabStore((state) => state.setDisplayName);
  const defaultLanguage = useLabStore((state) => state.defaultLanguage);
  const setDefaultLanguage = useLabStore((state) => state.setDefaultLanguage);
  const projects = useLabStore((state) => state.projects);
  const clearAll = useLabStore((state) => state.clearAll);
  const restoreDemo = useLabStore((state) => state.restoreDemo);
  const [name, setName] = useState(displayName);
  const [ai, setAi] = useState<"unknown" | "ready" | "unavailable">("unknown");
  const [confirmClear, setConfirmClear] = useState(false);
  const genius = getSongSearchConfig();

  useEffect(() => {
    setName(displayName);
  }, [displayName]);

  useEffect(() => {
    let cancelled = false;
    void getAiAvailability()
      .then((result) => {
        if (!cancelled) setAi(result.available ? "ready" : "unavailable");
      })
      .catch(() => {
        if (!cancelled) setAi("unavailable");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-semibold text-fg">Settings</h1>
        <p className="mt-2 text-sm text-muted">Preferences stay on this device with your projects.</p>
      </div>
      <Card className="space-y-4 p-5">
        <h2 className="text-lg font-semibold text-fg">Profile</h2>
        <label className="grid max-w-sm gap-2 text-sm text-muted">
          Display name
          <input
            value={name}
            maxLength={40}
            onChange={(event) => setName(event.target.value)}
            className="h-11 rounded-md border border-border bg-bg px-3 text-fg"
          />
        </label>
        <Button
          variant="secondary"
          onClick={() => {
            setDisplayName(name.trim() || "Dipesh");
            toast.success("Name updated.");
          }}
        >
          Save name
        </Button>
        <label className="grid max-w-sm gap-2 text-sm text-muted">
          Default language for new projects
          <select
            value={defaultLanguage}
            onChange={(event) => setDefaultLanguage(event.target.value as Language)}
            className="h-11 rounded-md border border-border bg-bg px-3 text-fg"
          >
            {LANGUAGES.map((language) => (
              <option key={language}>{language}</option>
            ))}
          </select>
        </label>
      </Card>
      <Card className="space-y-3 p-5">
        <h2 className="text-lg font-semibold text-fg">Services</h2>
        <p className="text-sm text-muted">
          Genius API: <Badge tone="muted">Not configured</Badge>
        </p>
        <p className="text-sm text-muted">{genius.reason}</p>
        <p className="text-sm text-muted">
          Model readings:{" "}
          <Badge tone={ai === "ready" ? "ok" : "muted"}>
            {ai === "unknown" ? "Checking…" : ai === "ready" ? "Available when you analyze" : "Unavailable"}
          </Badge>
        </p>
        <p className="text-sm text-muted">
          Analyze sends only the excerpt you submit. It does not run on page load.
        </p>
      </Card>
      <Card className="space-y-3 p-5">
        <h2 className="text-lg font-semibold text-fg">Data</h2>
        <p className="text-sm text-muted">
          Do not paste lyrics you do not have the right to use. This lab does not download them.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              downloadJson("diprap-projects.json", {
                exportedFrom: "DIPRAP",
                notice: "Local projects. Model text is interpretation. Audio is not included.",
                projects,
              });
              toast.success("Exported every project.");
            }}
          >
            Export all
          </Button>
          <Button variant="secondary" onClick={restoreDemo}>
            Restore demo
          </Button>
          <Button variant="danger" onClick={() => setConfirmClear(true)}>
            Clear local projects
          </Button>
        </div>
      </Card>
      <ConfirmDialog
        open={confirmClear}
        title="Clear projects on this device?"
        body="Saved lyrics, notes, and model readings in this browser will be replaced by the lab demo."
        confirmLabel="Clear"
        onOpenChange={setConfirmClear}
        onConfirm={() => {
          clearAll();
          setConfirmClear(false);
          toast.success("Local projects cleared.");
        }}
      />
    </div>
  );
}
