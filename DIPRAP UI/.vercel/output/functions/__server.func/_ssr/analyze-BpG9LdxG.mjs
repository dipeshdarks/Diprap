import { i as __toESM } from "../_runtime.mjs";
import { a as MODULES, d as countWords, f as isModelStale, g as syllableSummary, i as MAX_LYRICS, r as LANGUAGES, s as SCORE_LABEL, t as ANALYSIS_VIEWS, u as analyzeText } from "./text-analysis-BV1TbPXT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as ChevronRight, f as Funnel, v as ChevronLeft, y as ChevronDown } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useLabStore, n as Route$6, o as validateLyrics, r as useActiveProject, u as cn } from "./router-BoH-vfaJ.mjs";
import { i as confidenceTone, n as Button, r as Card, s as toneForKind, t as Badge } from "./Card-R8rfIlNa.mjs";
import { n as ProjectHeader, t as EvidencePanel } from "./ProjectHeader-VU_w-hKi.mjs";
import { t as EmptyState } from "./EmptyState-8DjM6I7n.mjs";
import { n as ErrorState, r as FlowCadenceLab, t as AudioPanel } from "./FlowCadenceLab-CjwdMXeh.mjs";
import { n as RhymeLab, t as LyricText } from "./RhymeLab-r3fdYyd9.mjs";
import { t as PracticeLab } from "./PracticeLab-DOFU6QIS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analyze-BpG9LdxG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AnalysisOptions({ selected, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
				className: "text-sm font-medium text-fg",
				children: "Analysis modules"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "The model is asked to emphasize what you check. Sections you leave off still come back shorter, not as fake results."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: MODULES.map((module) => {
					const checked = selected.includes(module.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: cn("flex min-h-11 cursor-pointer items-start gap-3 rounded-md border px-3 py-2", checked ? "border-accent bg-accent/10" : "border-border bg-bg"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "mt-1 size-4 accent-accent",
							checked,
							onChange: () => onToggle(module.id)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm text-fg",
							children: module.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-muted",
							children: module.detail
						})] })]
					}, module.id);
				})
			})
		]
	});
}
function BarByBarExplorer() {
	const project = useActiveProject();
	const selectedBar = useLabStore((state) => state.selectedBar);
	const setSelectedBar = useLabStore((state) => state.setSelectedBar);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [collapsed, setCollapsed] = (0, import_react.useState)(() => /* @__PURE__ */ new Set(["Alternative reading", "Narrative function"]));
	const estimate = (0, import_react.useMemo)(() => project ? analyzeText(project.lyrics, project.language) : null, [project]);
	const lines = estimate?.lines ?? [];
	const stale = project?.model ? isModelStale(project.model.sourceLines, project.lyrics) : false;
	const model = project?.model && !stale ? project.model : null;
	const modelBars = model?.bars ?? null;
	const sharedKeys = new Set(estimate?.endGroups.map((group) => group.key) ?? []);
	const visible = lines.filter((line) => {
		if (filter === "end") return Boolean(line.endKey && sharedKeys.has(line.endKey));
		return matchesFilter(line, filter);
	});
	const selected = lines[Math.min(selectedBar, Math.max(lines.length - 1, 0))] ?? null;
	const selectedModel = selected && modelBars ? modelBars.find((bar) => bar.index === selected.index) : void 0;
	(0, import_react.useEffect)(() => {
		if (!selected) return;
		document.getElementById(`bar-${selected.index}`)?.scrollIntoView({ block: "nearest" });
	}, [selected]);
	(0, import_react.useEffect)(() => {
		function onKey(event) {
			const target = event.target;
			if (!target) return;
			if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
			if (lines.length === 0) return;
			if (event.key === "ArrowDown" || event.key === "ArrowRight") {
				event.preventDefault();
				setSelectedBar(Math.min(lines.length - 1, selectedBar + 1));
			}
			if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
				event.preventDefault();
				setSelectedBar(Math.max(0, selectedBar - 1));
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		lines.length,
		selectedBar,
		setSelectedBar
	]);
	if (!project) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No project open",
		body: "Open a project or paste lyrics before stepping through bars.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/analyze",
				search: { view: "lyrics" },
				children: "Add lyrics"
			})
		})
	});
	if (!estimate || lines.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No bars yet",
		body: "Paste a lyric excerpt. Each non-empty line becomes a bar you can select.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/analyze",
				search: { view: "lyrics" },
				children: "Paste lyrics"
			})
		})
	});
	if (!selected) return null;
	const highlight = [...highlightWords(selected), ...model ? model.rhymes.flatMap((group) => group.members.filter((member) => member.barIndex === selected.index).map((member) => member.word)) : []];
	const selectedTags = barTagChips(selected, selectedModel, estimate, model);
	const techniqueCount = (selectedModel?.wordplay.length ?? 0) + (selectedModel?.metaphors.length ?? 0);
	function toggleSection(title) {
		setCollapsed((prev) => {
			const next = new Set(prev);
			if (next.has(title)) next.delete(title);
			else next.add(title);
			return next;
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 xl:grid-cols-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "xl:col-span-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold text-fg",
					children: "Bar-by-bar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Select a line. Arrow keys move when you are not typing."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, {
							className: "size-4",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Filter bars"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: filter,
							onChange: (event) => setFilter(event.target.value),
							className: "h-11 rounded-md border border-border bg-bg px-2 text-fg",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All bars"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "end",
									children: "Shared ending spelling"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "internal",
									children: "In-line spelling match"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "repeat",
									children: "Repeated word"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "pause",
									children: "Punctuation break"
								})
							]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border",
				children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-4 py-6 text-sm text-muted",
					children: "No bars match this filter."
				}) : visible.map((line) => {
					const active = line.index === selected?.index;
					const barModel = modelBars?.find((bar) => bar.index === line.index);
					const chips = barTagChips(line, barModel, estimate, model);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						id: `bar-${line.index}`,
						type: "button",
						"aria-current": active ? "true" : void 0,
						onClick: () => setSelectedBar(line.index),
						className: `flex w-full flex-col gap-3 px-4 py-3 text-left sm:flex-row sm:items-start ${active ? "bg-accent/10 ring-1 ring-accent ring-inset" : "hover:bg-raised"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-7 shrink-0 place-items-center rounded-full bg-raised font-mono text-xs text-muted",
								children: line.index + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 flex-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LyricText, {
									text: line.text,
									words: highlightWords(line)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex flex-wrap gap-1",
								children: chips.map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									tone: toneForKind(chip.kind),
									children: [chip.letter ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-semibold",
										children: chip.letter
									}) : null, chip.label]
								}, `${chip.label}-${chip.kind}`))
							})
						]
					}) }, line.index);
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "space-y-4 p-4 xl:col-span-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs text-muted",
						children: [
							"Bar ",
							selected.index + 1,
							" of ",
							lines.length
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							"aria-label": "Previous bar",
							onClick: () => setSelectedBar(Math.max(0, selected.index - 1)),
							disabled: selected.index === 0,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
								className: "size-4",
								"aria-hidden": true
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							"aria-label": "Next bar",
							onClick: () => setSelectedBar(Math.min(lines.length - 1, selected.index + 1)),
							disabled: selected.index === lines.length - 1,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
								className: "size-4",
								"aria-hidden": true
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [selectedTags.map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: toneForKind(chip.kind),
						children: [chip.letter ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-semibold",
							children: chip.letter
						}) : null, chip.label]
					}, `${chip.label}-${chip.kind}`)), selectedModel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: confidenceTone(selectedModel.confidence),
						children: [selectedModel.confidence === "high" ? "High" : selectedModel.confidence === "medium" ? "Medium" : "Low", " confidence"]
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold text-fg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LyricText, {
						text: selected.text,
						words: highlight
					})
				}),
				stale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-sm text-gold",
					children: "The saved model reading was written for an older draft. It is hidden until you analyze again."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Meaning",
					children: selectedModel?.meaning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: selectedModel.meaning
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No model reading for this line yet. The lab will not invent one. Run Analyze when you want an interpretation."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Writing technique",
					collapsible: true,
					count: techniqueCount || void 0,
					collapsed: collapsed.has("Writing technique"),
					onToggle: () => toggleSection("Writing technique"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulletList, {
						items: [...selectedModel?.wordplay ?? [], ...selectedModel?.metaphors ?? []],
						empty: "Nothing noted. A text estimate does not assign metaphors."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Rhyme mechanics",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: selectedModel?.rhymeMechanics || spellingNote(selected, estimate.endGroups.some((group) => group.members.some((member) => member.barIndex === selected.index)))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Narrative function",
					collapsible: true,
					collapsed: collapsed.has("Narrative function"),
					onToggle: () => toggleSection("Narrative function"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: selectedModel?.narrativeFunction || "Unavailable until a model reading is requested."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Alternative reading",
					collapsible: true,
					collapsed: collapsed.has("Alternative reading"),
					onToggle: () => toggleSection("Alternative reading"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: selectedModel?.alternative || "No alternative reading was returned."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Text estimate",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-1 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: selected.syllables == null ? "Syllables unavailable." : `${selected.syllables} estimated syllables.` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: selected.syllableBasis }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: selected.endWord ? `End word: ${selected.endWord}.` : "No end word detected." }),
							selected.pauseNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: selected.pauseNote }) : null
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidencePanel, {
					evidenceType: selectedModel ? "interpretive" : "user_provided",
					source: selectedModel ? "Meaning and devices come from the model reading of your text. Spelling counts underneath are separate." : "Only the line you typed, plus spelling and syllable estimates. Meaning was not inferred.",
					uncertainty: selectedModel?.uncertainty ?? "Pronunciation, intent, and delivery were not verified."
				})
			]
		})]
	});
}
function Section({ title, children, collapsible = false, collapsed = false, onToggle, count }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [collapsible ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onToggle,
		"aria-expanded": !collapsed,
		className: "flex w-full items-center justify-between gap-2 rounded-md text-left hover:bg-raised",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "flex items-center gap-2 text-sm font-medium text-fg",
			children: [title, count ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: "pink",
				className: "font-mono",
				children: count
			}) : null]
		}), collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
			className: "size-4 text-muted",
			"aria-hidden": true
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
			className: "size-4 text-muted",
			"aria-hidden": true
		})]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: "text-sm font-medium text-fg",
		children: title
	}), collapsible && collapsed ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-1",
		children
	})] });
}
function BulletList({ items, empty }) {
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: empty
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "list-disc space-y-1 pl-4 text-sm text-muted",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
	});
}
function matchesFilter(line, filter) {
	if (filter === "all") return true;
	if (filter === "end") return Boolean(line.endKey);
	if (filter === "internal") return line.internalWords.length >= 2;
	if (filter === "repeat") return line.repeats.length > 0;
	return Boolean(line.pauseNote);
}
function spellingNote(line, sharesEnding) {
	const bits = [];
	if (sharesEnding && line.endKey) bits.push(`The ending spelling “${line.endKey}” also shows up on another line. That is not a confirmed rhyme.`);
	else if (line.endWord) bits.push(`The line ends on “${line.endWord}”. No other line shares its last three Latin letters.`);
	if (line.internalWords.length >= 2) bits.push(`Inside the line, ${line.internalWords.join(" and ")} share an ending spelling.`);
	if (bits.length === 0) return "No shared Latin ending was found in this excerpt.";
	return bits.join(" ");
}
function barTagChips(line, barModel, estimate, model) {
	if (barModel && barModel.tags.length > 0) return barModel.tags.map((tag) => ({
		...tag,
		letter: model ? letterForModelTag(tag, barModel.index, model) : void 0
	}));
	const chips = [];
	if (line.endKey) {
		const group = estimate.endGroups.find((item) => item.members.some((member) => member.barIndex === line.index));
		chips.push({
			label: "End Rhyme",
			kind: "end_rhyme",
			letter: group?.letter
		});
	}
	if (line.internalWords.length >= 2) {
		const group = estimate.internalGroups.find((item) => item.members.some((member) => member.barIndex === line.index));
		chips.push({
			label: "Internal",
			kind: "internal_rhyme",
			letter: group?.letter
		});
	}
	if (line.repeats.length > 0) chips.push({
		label: "Repetition",
		kind: "repetition"
	});
	if (line.syllables != null) chips.push({
		label: `${line.syllables} syl`,
		kind: "cadence"
	});
	return chips;
}
function letterForModelTag(tag, barIndex, model) {
	const type = tag.kind === "end_rhyme" ? "end" : tag.kind === "internal_rhyme" ? "internal" : tag.kind === "multisyllabic" ? "multisyllabic" : tag.kind === "slant" ? "slant" : null;
	if (!type) return void 0;
	return model.rhymes.find((item) => item.type === type && item.members.some((member) => member.barIndex === barIndex))?.letter;
}
function highlightWords(line) {
	if (!line) return [];
	return [
		...line.internalWords,
		...line.repeats,
		line.endWord ?? ""
	].filter(Boolean);
}
var SECTIONS = [
	{
		key: "themes",
		title: "Themes and narrative",
		empty: "No themes were returned."
	},
	{
		key: "metaphors",
		title: "Metaphors",
		empty: "No metaphors were returned."
	},
	{
		key: "doubleMeanings",
		title: "Double meanings",
		empty: "No double meanings were returned."
	},
	{
		key: "punchlines",
		title: "Punchlines",
		empty: "No punchlines were returned."
	},
	{
		key: "culturalReferences",
		title: "Cultural references",
		empty: "No cultural references were returned."
	},
	{
		key: "alternativeInterpretations",
		title: "Alternative interpretations",
		empty: "No alternatives were returned."
	}
];
function ContextInsights() {
	const project = useActiveProject();
	if (!project) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No project open",
		body: "Insights stay attached to a project. Open one, or start from the lyrics you have the right to use.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/projects",
				children: "My projects"
			})
		})
	});
	const model = project.model;
	const stale = model ? isModelStale(model.sourceLines, project.lyrics) : false;
	if (!model || stale) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: stale ? "This reading does not match the current lyrics" : "No model reading yet",
		body: stale ? "Context cards from the previous reading are hidden so they are not treated as a reading of the new text." : "Overall meaning, themes, and references appear here only after you run Analyze. A text estimate does not invent them.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/analyze",
				search: { view: "lyrics" },
				children: "Review lyrics and analyze"
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold text-fg",
							children: "Overall meaning"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "accent",
							children: "Model interpretation"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: model.overallMeaning || "The model did not return an overall reading."
					}),
					model.story ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-2 space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-medium text-fg",
								children: "Central message"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-muted",
								children: model.story.centralMessage
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-medium text-fg",
								children: "Narrative arc"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-muted",
								children: model.story.narrativeArc
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-medium text-fg",
								children: "Atmosphere"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-muted",
								children: model.story.atmosphere
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-medium text-fg",
								children: "Perspective"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-muted",
								children: model.story.perspective
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-medium text-fg",
								children: "Language notes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-muted",
								children: model.story.languageNotes
							})] })
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-faint",
						children: model.disclaimer
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: SECTIONS.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsightCard, {
					title: section.title,
					empty: section.empty,
					items: model[section.key]
				}, section.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidencePanel, {
				evidenceType: "interpretive",
				source: `Reading produced ${new Date(model.generatedAt).toLocaleString()} by ${model.model} from the lines saved with this project. Cultural references are marked unverified inside their cards.`,
				uncertainty: model.limitations
			})
		]
	});
}
function InsightCard({ title, items, empty }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "space-y-3 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-base font-semibold text-fg",
			children: title
		}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: empty
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-fg",
						children: item.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: item.evidenceType === "unverified" ? "gold" : "accent",
						children: item.evidenceType === "unverified" ? "Unverified context" : "Model interpretation"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: item.explanation
				})]
			}, item.id))
		})]
	});
}
function LyricsInput({ lyrics, language, error, onLyrics, onLanguage, onClear }) {
	const over = lyrics.length > MAX_LYRICS;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "lyrics",
					className: "text-sm font-medium text-fg",
					children: "Lyrics"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm text-muted",
						htmlFor: "language",
						children: ["Language", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "language",
							value: language,
							onChange: (event) => onLanguage(event.target.value),
							className: "h-11 rounded-md border border-border bg-bg px-2 text-fg",
							children: LANGUAGES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: item,
								children: item
							}, item))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClear,
						className: "min-h-11 px-2 text-sm text-muted hover:text-fg",
						children: "Clear"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: "lyrics",
				value: lyrics,
				onChange: (event) => onLyrics(event.target.value),
				rows: 12,
				placeholder: "Paste a lyric excerpt to explore its meaning, rhyme, and writing techniques...",
				"aria-invalid": Boolean(error) || over,
				"aria-describedby": "lyrics-help",
				className: "w-full resize-y rounded-md border border-border bg-bg px-3 py-3 font-mono text-sm leading-6 text-fg placeholder:text-faint"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "lyrics-help",
				className: "flex flex-wrap items-center justify-between gap-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: over || error ? "text-danger" : "text-faint",
					children: error ?? "Blank lines are skipped. Each remaining line is one bar. Nothing is fetched from Genius."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: `tabular-nums ${over ? "text-danger" : "text-muted"}`,
					children: [
						lyrics.length.toLocaleString(),
						" / ",
						MAX_LYRICS.toLocaleString()
					]
				})]
			})
		]
	});
}
var VIEW_LABEL = {
	overview: "Overview",
	lyrics: "Lyrics",
	story: "Story",
	bars: "Bars",
	rhymes: "Rhymes",
	flow: "Flow",
	production: "Production",
	practice: "Practice"
};
function AnalysisWorkspace({ view }) {
	const project = useActiveProject();
	if (!project) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 md:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No project open",
			body: "Create a project from Song Search, or restore the lab demo in Settings.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/search",
					children: "Find a song"
				})
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 p-4 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectHeader, { project }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Analysis views",
				className: "flex gap-1 overflow-x-auto border-b border-border",
				children: ANALYSIS_VIEWS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/analyze",
					search: { view: item },
					"aria-current": item === view ? "page" : void 0,
					className: `shrink-0 border-b-2 px-3 py-3 text-sm ${item === view ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg"}`,
					children: VIEW_LABEL[item]
				}, item))
			}),
			view === "overview" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, {}) : null,
			view === "lyrics" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LyricsPane, {}) : null,
			view === "story" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContextInsights, {}) : null,
			view === "bars" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarByBarExplorer, {}) : null,
			view === "rhymes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RhymeLab, {}) : null,
			view === "flow" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowCadenceLab, {}) : null,
			view === "production" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductionPane, {}) : null,
			view === "practice" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PracticeLab, {}) : null
		]
	});
}
function Overview() {
	const project = useActiveProject();
	const analyzing = useLabStore((state) => state.analyzingProjectId);
	const analyzeProject = useLabStore((state) => state.analyzeProject);
	const estimate = (0, import_react.useMemo)(() => project ? analyzeText(project.lyrics, project.language) : null, [project]);
	if (!project || !estimate) return null;
	const summary = syllableSummary(estimate);
	const stale = project.model ? isModelStale(project.model.sourceLines, project.lyrics) : false;
	const lyricsError = validateLyrics(project.lyrics);
	const busy = analyzing === project.id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			project.isDemo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted",
				children: "Street Dreams is an original demo written for this lab. It is not a commercial song. Nothing below is a model reading until you press Analyze."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-faint",
							children: "Lines"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-2xl tabular-nums text-fg",
							children: estimate.lines.length
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-faint",
							children: "Words"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-2xl tabular-nums text-fg",
							children: countWords(project.lyrics)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-faint",
							children: "Est. syllables"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-2xl tabular-nums text-fg",
							children: summary ? summary.total : "—"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-faint",
							children: "Spelling groups"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-2xl tabular-nums text-fg",
							children: estimate.endGroups.length
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold text-fg",
							children: "Where the reading stands"
						}), project.model && !stale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "ok",
							children: "Model reading saved"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "muted",
							children: "Text estimate only"
						})]
					}),
					project.model && !stale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: project.model.overallMeaning || project.model.disclaimer
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: estimate.disclaimer
					}),
					stale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-gold",
						children: "Lyrics changed after the last reading. Analyze again before trusting it."
					}) : null,
					project.modelError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
						message: project.modelError,
						onRetry: () => void analyzeProject(project.id)
					}) : null,
					lyricsError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: lyricsError
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: Boolean(lyricsError) || busy || project.modules.length === 0,
						onClick: () => {
							analyzeProject(project.id).then(() => {
								const latest = useLabStore.getState().projects.find((item) => item.id === project.id);
								if (latest?.model && !latest.modelError) toast.success("Reading ready. Treat it as an interpretation, not a fact.");
							});
						},
						children: busy ? "Analyzing…" : "Analyze"
					})
				]
			}),
			project.model && !stale && project.model.scorecard.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-4 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold text-fg",
							children: "Scorecard"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "accent",
							children: "Model interpretation"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: project.model.scorecard.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-fg",
									children: SCORE_LABEL[entry.dimension]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-sm tabular-nums text-fg",
									children: [entry.score.toFixed(1), " / 10"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 h-1.5 overflow-hidden rounded-full bg-raised",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-accent",
									style: { width: `${Math.min(100, Math.max(0, entry.score * 10))}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: entry.evidence
							})
						] }, entry.dimension))
					}),
					project.model.strongestMoments.length > 0 || project.model.weaknesses.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [project.model.strongestMoments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-medium text-fg",
							children: "Strongest moments"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2 text-sm text-muted",
							children: project.model.strongestMoments.map((moment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs text-accent",
									children: ["Line ", moment.barIndex + 1]
								}),
								" — ",
								moment.moment,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-faint",
									children: [
										"(",
										moment.why,
										")"
									]
								})
							] }, `${moment.barIndex}-${moment.moment}`))
						})] }) : null, project.model.weaknesses.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-medium text-fg",
							children: "Weaknesses"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2 text-sm text-muted",
							children: project.model.weaknesses.map((weakness) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								weakness.observation,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-faint",
									children: [
										"(",
										weakness.evidence,
										")"
									]
								})
							] }, weakness.observation))
						})] }) : null]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-faint",
						children: "Scores are critical opinion of the model reading, not measurements of quality."
					})
				]
			}) : null
		]
	});
}
function LyricsPane() {
	const project = useActiveProject();
	const setLyrics = useLabStore((state) => state.setLyrics);
	const patchProject = useLabStore((state) => state.patchProject);
	const toggleModule = useLabStore((state) => state.toggleModule);
	const analyzeProject = useLabStore((state) => state.analyzeProject);
	const analyzing = useLabStore((state) => state.analyzingProjectId);
	if (!project) return null;
	const lyricsError = validateLyrics(project.lyrics);
	const busy = analyzing === project.id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "space-y-5 p-4 md:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold text-fg",
				children: project.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					project.artist,
					" · ",
					project.language,
					project.sourceUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						" ",
						"·",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "text-accent underline",
							href: project.sourceUrl,
							target: "_blank",
							rel: "noreferrer",
							children: "Reference link"
						})
					] }) : null
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LyricsInput, {
				lyrics: project.lyrics,
				language: project.language,
				error: project.lyrics.trim() ? lyricsError : null,
				onLyrics: (value) => setLyrics(project.id, value),
				onLanguage: (language) => patchProject(project.id, { language }),
				onClear: () => setLyrics(project.id, "")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalysisOptions, {
				selected: project.modules,
				onToggle: (moduleId) => toggleModule(project.id, moduleId)
			}),
			project.modelError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				message: project.modelError,
				onRetry: () => void analyzeProject(project.id)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: Boolean(lyricsError) || busy || project.modules.length === 0,
					onClick: () => void analyzeProject(project.id),
					children: busy ? "Analyzing…" : "Analyze"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/analyze",
						search: { view: "bars" },
						children: "Open bars"
					})
				})]
			})
		]
	});
}
function ProductionPane() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "space-y-2 p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold text-fg",
				children: "Production"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-2xl text-sm text-muted",
				children: "Mix, sample, and arrangement notes are unavailable. DIPRAP does not invent a producer report. If you attach audio, the only measured facts are duration, sample rate, and a waveform."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioPanel, {})]
	});
}
function AnalyzePage() {
	const { view } = Route$6.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalysisWorkspace, { view });
}
//#endregion
export { AnalyzePage as component };
