import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EvidencePanel } from "@/components/analysis/EvidencePanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { analyzeText, isModelStale } from "@/lib/text-analysis";
import { useActiveProject, useLabStore } from "@/lib/store";

export function PracticeLab() {
  const project = useActiveProject();
  const selectedBar = useLabStore((state) => state.selectedBar);
  const setSelectedBar = useLabStore((state) => state.setSelectedBar);
  const savePracticeNote = useLabStore((state) => state.savePracticeNote);
  const estimate = useMemo(
    () => (project ? analyzeText(project.lyrics, project.language) : null),
    [project],
  );
  const [interpretation, setInterpretation] = useState("");
  const [rewrite, setRewrite] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [quizPick, setQuizPick] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, attempts: 0 });

  if (!project || !estimate || estimate.lines.length === 0) {
    return (
      <EmptyState
        title="Practice needs a few lines"
        body="Open a project with lyrics. You will write your own note before any model reading is revealed."
        action={
          <Button asChild>
            <Link to="/analyze" search={{ view: "lyrics" }}>
              Add lyrics
            </Link>
          </Button>
        }
      />
    );
  }

  const index = Math.min(selectedBar, estimate.lines.length - 1);
  const line = estimate.lines[index]!;
  const stale = project.model ? isModelStale(project.model.sourceLines, project.lyrics) : false;
  const modelBar = project.model && !stale ? project.model.bars.find((bar) => bar.index === line.index) : undefined;
  const savedInterpretation = project.practiceNotes.find(
    (note) => note.barIndex === line.index && note.prompt === "interpretation",
  );
  const savedRewrite = project.practiceNotes.find(
    (note) => note.barIndex === line.index && note.prompt === "rewrite",
  );
  const promptIndex = estimate.endGroups[0]?.members[0]?.barIndex ?? 0;
  const answerKey = estimate.lines[promptIndex]?.endKey ?? null;
  const options = answerKey ? endOptions(estimate, answerKey) : [];

  function changeBar(next: number) {
    setSelectedBar(next);
    setInterpretation("");
    setRewrite("");
    setRevealed(false);
  }

  const rewriteEnd = endWordOfLine(rewrite);
  const originalEnd = line.endWord?.toLowerCase().replace(/[^a-z]/g, "") ?? "";
  const rewriteCompare =
    rewrite.trim().length === 0
      ? null
      : rewriteEnd && originalEnd && rewriteEnd === originalEnd
        ? "The end word matches the original spelling. That is the only check this lab can make."
        : "The end spelling changed. That may be a real choice — this lab cannot tell whether it still rhymes out loud.";

  return (
    <div className="grid gap-4 xl:grid-cols-5">
      <Card className="xl:col-span-2">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-fg">Bars</h2>
          <p className="text-sm text-muted">
            Session score {score.correct}/{score.attempts}
          </p>
        </div>
        <ul className="max-h-[32rem] divide-y divide-border overflow-auto">
          {estimate.lines.map((item) => (
            <li key={item.index}>
              <button
                type="button"
                onClick={() => changeBar(item.index)}
                className={`w-full px-4 py-3 text-left text-sm ${
                  item.index === line.index ? "bg-accent/10 text-fg" : "text-muted hover:bg-raised"
                }`}
              >
                <span className="font-mono text-xs">{item.index + 1}. </span>
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </Card>
      <div className="space-y-4 xl:col-span-3">
        <Card className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-fg">Read it yourself</h2>
            <Badge tone="muted">Bar {line.index + 1}</Badge>
          </div>
          <p className="text-sm text-fg">{line.text}</p>
          <label className="block text-sm text-muted" htmlFor="practice-read">
            What is this line doing?
            <textarea
              id="practice-read"
              value={interpretation}
              onChange={(event) => setInterpretation(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-fg"
              placeholder="Write your reading before you reveal anything."
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={!interpretation.trim()}
              onClick={() =>
                savePracticeNote(project.id, {
                  barIndex: line.index,
                  prompt: "interpretation",
                  text: interpretation.trim(),
                  updatedAt: new Date().toISOString(),
                })
              }
            >
              Save note
            </Button>
            <Button variant="secondary" onClick={() => setRevealed(true)}>
              Reveal notes
            </Button>
          </div>
          {savedInterpretation ? (
            <p className="text-sm text-muted">Saved note: {savedInterpretation.text}</p>
          ) : null}
          {revealed ? (
            <div className="space-y-2 rounded-md border border-border bg-bg p-3 text-sm text-muted">
              <p>{line.syllables == null ? "Syllables unavailable." : `${line.syllables} estimated syllables. ${line.syllableBasis}`}</p>
              <p>{modelBar?.meaning ?? "No model meaning is available for the current lyrics."}</p>
              {modelBar?.uncertainty ? <p>Uncertainty: {modelBar.uncertainty}</p> : null}
            </div>
          ) : (
            <p className="text-sm text-faint">The model reading stays hidden until you reveal it.</p>
          )}
        </Card>
        <Card className="space-y-3 p-4">
          <h2 className="text-base font-semibold text-fg">Rewrite the bar</h2>
          <label className="block text-sm text-muted" htmlFor="practice-rewrite">
            Keep or change the end word. You will only get a spelling check.
            <textarea
              id="practice-rewrite"
              value={rewrite}
              onChange={(event) => setRewrite(event.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-fg"
            />
          </label>
          {rewriteCompare ? <p className="text-sm text-muted">{rewriteCompare}</p> : null}
          <Button
            variant="secondary"
            disabled={!rewrite.trim()}
            onClick={() =>
              savePracticeNote(project.id, {
                barIndex: line.index,
                prompt: "rewrite",
                text: rewrite.trim(),
                updatedAt: new Date().toISOString(),
              })
            }
          >
            Save rewrite
          </Button>
          {savedRewrite ? <p className="text-sm text-muted">Saved rewrite: {savedRewrite.text}</p> : null}
        </Card>
        <Card className="space-y-3 p-4">
          <h2 className="text-base font-semibold text-fg">Spot the shared ending</h2>
          {estimate.endGroups.length === 0 || !answerKey ? (
            <p className="text-sm text-muted">
              This excerpt has no repeated Latin ending of three letters. Add another line that shares an ending spelling to practice this check.
            </p>
          ) : (
            <>
              <p className="text-sm text-muted">
                Which other bar shares the last three letters of bar {promptIndex + 1}’s end word? This checks spelling only.
              </p>
              <div className="flex flex-col gap-2">
                {options.map((option) => (
                  <button
                    key={option.index}
                    type="button"
                    className="min-h-11 rounded-md border border-border px-3 text-left text-sm text-fg hover:bg-raised"
                    onClick={() => {
                      if (quizPick != null) return;
                      setQuizPick(option.index);
                      const correct = option.correct;
                      setScore((current) => ({
                        correct: current.correct + (correct ? 1 : 0),
                        attempts: current.attempts + 1,
                      }));
                    }}
                  >
                    Bar {option.index + 1}: {option.text}
                    {quizPick != null && option.correct ? " — match" : ""}
                    {quizPick === option.index && !option.correct ? " — not the spelling match" : ""}
                  </button>
                ))}
              </div>
              {quizPick != null ? (
                <p className="text-sm text-muted">
                  {options.find((option) => option.index === quizPick)?.correct
                    ? "That line shares the ending spelling."
                    : "Not the shared ending. The match is marked on the list."}
                </p>
              ) : null}
            </>
          )}
          <EvidencePanel
            evidenceType="user_provided"
            source="Practice checks compare your text with spelling on the lines you pasted."
            uncertainty="A spelling match is not a verdict on rhyme quality."
          />
        </Card>
      </div>
    </div>
  );
}

function endWordOfLine(line: string): string | null {
  const words = line.match(/[\p{L}\p{M}'’]+/gu);
  const last = words?.[words.length - 1];
  if (!last) return null;
  const latin = last.toLowerCase().replace(/[^a-z]/g, "");
  return latin || null;
}

function endOptions(
  estimate: ReturnType<typeof analyzeText>,
  answerKey: string,
): { index: number; text: string; correct: boolean }[] {
  const prompt = estimate.endGroups[0]?.members[0]?.barIndex ?? 0;
  const pool = estimate.lines.filter((line) => line.index !== prompt);
  const correct = pool.filter((line) => line.endKey === answerKey);
  const wrong = pool.filter((line) => line.endKey !== answerKey);
  return [...correct.slice(0, 2), ...wrong].slice(0, 4).map((line) => ({
    index: line.index,
    text: line.text,
    correct: line.endKey === answerKey,
  }));
}
