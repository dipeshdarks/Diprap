import { MODULES, type ModuleId } from "@/types/analysis";
import { cn } from "@/lib/cn";

export function AnalysisOptions({
  selected,
  onToggle,
}: {
  selected: ModuleId[];
  onToggle: (moduleId: ModuleId) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-fg">Analysis modules</legend>
      <p className="text-sm text-muted">
        The model is asked to emphasize what you check. Sections you leave off still come back shorter, not as fake results.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {MODULES.map((module) => {
          const checked = selected.includes(module.id);
          return (
            <label
              key={module.id}
              className={cn(
                "flex min-h-11 cursor-pointer items-start gap-3 rounded-md border px-3 py-2",
                checked ? "border-accent bg-accent/10" : "border-border bg-bg",
              )}
            >
              <input
                type="checkbox"
                className="mt-1 size-4 accent-accent"
                checked={checked}
                onChange={() => onToggle(module.id)}
              />
              <span>
                <span className="block text-sm text-fg">{module.label}</span>
                <span className="block text-xs text-muted">{module.detail}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
