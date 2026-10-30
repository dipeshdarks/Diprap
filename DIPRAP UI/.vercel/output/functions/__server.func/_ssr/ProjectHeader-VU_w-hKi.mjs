import { f as isModelStale, m as splitBars } from "./text-analysis-BV1TbPXT.mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as Save, h as Download, s as Plus, y as ChevronDown } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useLabStore } from "./router-BoH-vfaJ.mjs";
import { a as evidenceLabel, n as Button, o as evidenceTone, t as Badge } from "./Card-R8rfIlNa.mjs";
import { n as slugify, t as downloadJson } from "./download-Bm7VhDBp.mjs";
import { a as DropdownMenuTrigger, i as DropdownMenuPortal, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { t as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProjectHeader-VU_w-hKi.js
var import_jsx_runtime = require_jsx_runtime();
function EvidencePanel({ evidenceType, source, uncertainty }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-border bg-bg p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-medium text-fg",
					children: "Evidence"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: evidenceTone(evidenceType),
					children: evidenceLabel(evidenceType)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: source
			}),
			uncertainty ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: "Uncertainty: "
				}), uncertainty]
			}) : null
		]
	});
}
function ProjectHeader({ project }) {
	const markSaved = useLabStore((state) => state.markSaved);
	const lastSavedAt = useLabStore((state) => state.lastSavedAt);
	const createProject = useLabStore((state) => state.createProject);
	const defaultLanguage = useLabStore((state) => state.defaultLanguage);
	const analyzing = useLabStore((state) => state.analyzingProjectId === project.id);
	const navigate = useNavigate();
	const bars = splitBars(project.lyrics).length;
	const stale = project.model ? isModelStale(project.model.sourceLines, project.lyrics) : false;
	const moduleCount = project.modules.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-start justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/projects",
					className: "text-sm text-muted hover:text-fg",
					children: "Back to projects"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-semibold text-fg",
							children: project.title
						}),
						analyzing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "accent",
							children: "Reading…"
						}) : project.model && !stale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "ok",
							children: "Analysis Complete"
						}) : stale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "gold",
							children: "Reading is stale"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "gold",
							children: "Draft"
						}),
						project.isDemo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "gold",
							children: "Lab demo"
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						project.artist,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							children: " · "
						}),
						project.language,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							children: " · "
						}),
						bars,
						" ",
						bars === 1 ? "line" : "lines",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							children: " · "
						}),
						moduleCount,
						" / 7 modules",
						lastSavedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": true,
								children: " · "
							}),
							"Saved ",
							format(new Date(lastSavedAt), "MMM d, h:mm a")
						] }) : null
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					onClick: () => {
						markSaved();
						toast.success("Saved in this browser.");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {
						className: "size-4",
						"aria-hidden": true
					}), "Save"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
								className: "size-4",
								"aria-hidden": true
							}),
							"Export",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
								className: "size-4",
								"aria-hidden": true
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					className: "z-50 min-w-48 rounded-md border border-border bg-raised p-1",
					sideOffset: 8,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
						className: "min-h-11 cursor-pointer rounded px-3 py-2 text-sm text-fg outline-none data-[highlighted]:bg-surface",
						onSelect: () => {
							downloadJson(`${slugify(project.title)}.diprap.json`, {
								exportedFrom: "DIPRAP",
								notice: "Model fields are interpretations. Text estimates are rule-based. Audio files are not included.",
								project
							});
							toast.success("Exported JSON.");
						},
						children: "Download JSON"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
						className: "min-h-11 cursor-pointer rounded px-3 py-2 text-sm text-fg outline-none data-[highlighted]:bg-surface",
						onSelect: () => {
							navigator.clipboard.writeText(project.lyrics).then(() => toast.success("Lyrics copied."), () => toast.error("Could not copy lyrics."));
						},
						children: "Copy lyrics"
					})]
				}) })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						createProject({
							title: "Untitled analysis",
							artist: "",
							language: defaultLanguage
						});
						navigate({
							to: "/analyze",
							search: { view: "lyrics" }
						});
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						className: "size-4",
						"aria-hidden": true
					}), "New analysis"]
				})
			]
		})]
	});
}
//#endregion
export { ProjectHeader as n, EvidencePanel as t };
