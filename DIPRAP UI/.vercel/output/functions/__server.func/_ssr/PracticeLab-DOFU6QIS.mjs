import { i as __toESM } from "../_runtime.mjs";
import { f as isModelStale, u as analyzeText } from "./text-analysis-BV1TbPXT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as useLabStore, r as useActiveProject } from "./router-BoH-vfaJ.mjs";
import { n as Button, r as Card, t as Badge } from "./Card-R8rfIlNa.mjs";
import { t as EvidencePanel } from "./ProjectHeader-VU_w-hKi.mjs";
import { t as EmptyState } from "./EmptyState-8DjM6I7n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PracticeLab-DOFU6QIS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PracticeLab() {
	const project = useActiveProject();
	const selectedBar = useLabStore((state) => state.selectedBar);
	const setSelectedBar = useLabStore((state) => state.setSelectedBar);
	const savePracticeNote = useLabStore((state) => state.savePracticeNote);
	const estimate = (0, import_react.useMemo)(() => project ? analyzeText(project.lyrics, project.language) : null, [project]);
	const [interpretation, setInterpretation] = (0, import_react.useState)("");
	const [rewrite, setRewrite] = (0, import_react.useState)("");
	const [revealed, setRevealed] = (0, import_react.useState)(false);
	const [quizPick, setQuizPick] = (0, import_react.useState)(null);
	const [score, setScore] = (0, import_react.useState)({
		correct: 0,
		attempts: 0
	});
	if (!project || !estimate || estimate.lines.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Practice needs a few lines",
		body: "Open a project with lyrics. You will write your own note before any model reading is revealed.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/analyze",
				search: { view: "lyrics" },
				children: "Add lyrics"
			})
		})
	});
	const index = Math.min(selectedBar, estimate.lines.length - 1);
	const line = estimate.lines[index];
	const stale = project.model ? isModelStale(project.model.sourceLines, project.lyrics) : false;
	const modelBar = project.model && !stale ? project.model.bars.find((bar) => bar.index === line.index) : void 0;
	const savedInterpretation = project.practiceNotes.find((note) => note.barIndex === line.index && note.prompt === "interpretation");
	const savedRewrite = project.practiceNotes.find((note) => note.barIndex === line.index && note.prompt === "rewrite");
	const promptIndex = estimate.endGroups[0]?.members[0]?.barIndex ?? 0;
	const answerKey = estimate.lines[promptIndex]?.endKey ?? null;
	const options = answerKey ? endOptions(estimate, answerKey) : [];
	function changeBar(next) {
		setSelectedBar(next);
		setInterpretation("");
		setRewrite("");
		setRevealed(false);
	}
	const rewriteEnd = endWordOfLine(rewrite);
	const originalEnd = line.endWord?.toLowerCase().replace(/[^a-z]/g, "") ?? "";
	const rewriteCompare = rewrite.trim().length === 0 ? null : rewriteEnd && originalEnd && rewriteEnd === originalEnd ? "The end word matches the original spelling. That is the only check this lab can make." : "The end spelling changed. That may be a real choice — this lab cannot tell whether it still rhymes out loud.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 xl:grid-cols-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "xl:col-span-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold text-fg",
					children: "Bars"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"Session score ",
						score.correct,
						"/",
						score.attempts
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "max-h-[32rem] divide-y divide-border overflow-auto",
				children: estimate.lines.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => changeBar(item.index),
					className: `w-full px-4 py-3 text-left text-sm ${item.index === line.index ? "bg-accent/10 text-fg" : "text-muted hover:bg-raised"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs",
						children: [item.index + 1, ". "]
					}), item.text]
				}) }, item.index))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 xl:col-span-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "space-y-3 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold text-fg",
								children: "Read it yourself"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								tone: "muted",
								children: ["Bar ", line.index + 1]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-fg",
							children: line.text
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm text-muted",
							htmlFor: "practice-read",
							children: ["What is this line doing?", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "practice-read",
								value: interpretation,
								onChange: (event) => setInterpretation(event.target.value),
								rows: 4,
								className: "mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-fg",
								placeholder: "Write your reading before you reveal anything."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: !interpretation.trim(),
								onClick: () => savePracticeNote(project.id, {
									barIndex: line.index,
									prompt: "interpretation",
									text: interpretation.trim(),
									updatedAt: (/* @__PURE__ */ new Date()).toISOString()
								}),
								children: "Save note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => setRevealed(true),
								children: "Reveal notes"
							})]
						}),
						savedInterpretation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: ["Saved note: ", savedInterpretation.text]
						}) : null,
						revealed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 rounded-md border border-border bg-bg p-3 text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: line.syllables == null ? "Syllables unavailable." : `${line.syllables} estimated syllables. ${line.syllableBasis}` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: modelBar?.meaning ?? "No model meaning is available for the current lyrics." }),
								modelBar?.uncertainty ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Uncertainty: ", modelBar.uncertainty] }) : null
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-faint",
							children: "The model reading stays hidden until you reveal it."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "space-y-3 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold text-fg",
							children: "Rewrite the bar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm text-muted",
							htmlFor: "practice-rewrite",
							children: ["Keep or change the end word. You will only get a spelling check.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "practice-rewrite",
								value: rewrite,
								onChange: (event) => setRewrite(event.target.value),
								rows: 3,
								className: "mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-fg"
							})]
						}),
						rewriteCompare ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: rewriteCompare
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							disabled: !rewrite.trim(),
							onClick: () => savePracticeNote(project.id, {
								barIndex: line.index,
								prompt: "rewrite",
								text: rewrite.trim(),
								updatedAt: (/* @__PURE__ */ new Date()).toISOString()
							}),
							children: "Save rewrite"
						}),
						savedRewrite ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: ["Saved rewrite: ", savedRewrite.text]
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "space-y-3 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold text-fg",
							children: "Spot the shared ending"
						}),
						estimate.endGroups.length === 0 || !answerKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "This excerpt has no repeated Latin ending of three letters. Add another line that shares an ending spelling to practice this check."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									"Which other bar shares the last three letters of bar ",
									promptIndex + 1,
									"’s end word? This checks spelling only."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col gap-2",
								children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "min-h-11 rounded-md border border-border px-3 text-left text-sm text-fg hover:bg-raised",
									onClick: () => {
										if (quizPick != null) return;
										setQuizPick(option.index);
										const correct = option.correct;
										setScore((current) => ({
											correct: current.correct + (correct ? 1 : 0),
											attempts: current.attempts + 1
										}));
									},
									children: [
										"Bar ",
										option.index + 1,
										": ",
										option.text,
										quizPick != null && option.correct ? " — match" : "",
										quizPick === option.index && !option.correct ? " — not the spelling match" : ""
									]
								}, option.index))
							}),
							quizPick != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: options.find((option) => option.index === quizPick)?.correct ? "That line shares the ending spelling." : "Not the shared ending. The match is marked on the list."
							}) : null
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidencePanel, {
							evidenceType: "user_provided",
							source: "Practice checks compare your text with spelling on the lines you pasted.",
							uncertainty: "A spelling match is not a verdict on rhyme quality."
						})
					]
				})
			]
		})]
	});
}
function endWordOfLine(line) {
	const words = line.match(/[\p{L}\p{M}'’]+/gu);
	const last = words?.[words.length - 1];
	if (!last) return null;
	return last.toLowerCase().replace(/[^a-z]/g, "") || null;
}
function endOptions(estimate, answerKey) {
	const prompt = estimate.endGroups[0]?.members[0]?.barIndex ?? 0;
	const pool = estimate.lines.filter((line) => line.index !== prompt);
	const correct = pool.filter((line) => line.endKey === answerKey);
	const wrong = pool.filter((line) => line.endKey !== answerKey);
	return [...correct.slice(0, 2), ...wrong].slice(0, 4).map((line) => ({
		index: line.index,
		text: line.text,
		correct: line.endKey === answerKey
	}));
}
//#endregion
export { PracticeLab as t };
