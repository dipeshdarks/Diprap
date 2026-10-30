import { i as __toESM } from "../_runtime.mjs";
import { m as splitBars } from "./text-analysis-BV1TbPXT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as useLabStore } from "./router-BoH-vfaJ.mjs";
import { n as Button, r as Card, t as Badge } from "./Card-R8rfIlNa.mjs";
import { t as EmptyState } from "./EmptyState-8DjM6I7n.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-3QnMoWDZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects-DbjUyFOZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProjectsPage() {
	const projects = useLabStore((state) => state.projects);
	const setActiveProject = useLabStore((state) => state.setActiveProject);
	const deleteProject = useLabStore((state) => state.deleteProject);
	const duplicateProject = useLabStore((state) => state.duplicateProject);
	const navigate = useNavigate();
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const target = projects.find((project) => project.id === pendingDelete);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 p-4 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-semibold text-fg",
				children: "My projects"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Stored in this browser only. Clearing site data removes them."
			})] }),
			projects.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No projects",
				body: "Create one from Song Search or restore the demo in Settings."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex flex-col gap-3 p-4 md:flex-row md:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "truncate text-base font-semibold text-fg",
									children: project.title
								}),
								project.isDemo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "gold",
									children: "Lab demo"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: project.model ? "ok" : "muted",
									children: project.model ? "Model reading" : "Text estimate"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								project.artist,
								" · ",
								project.language,
								" · ",
								splitBars(project.lyrics).length,
								" bars"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									setActiveProject(project.id);
									navigate({
										to: "/analyze",
										search: { view: "overview" }
									});
								},
								children: "Open"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => duplicateProject(project.id),
								children: "Duplicate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								onClick: () => setPendingDelete(project.id),
								children: "Delete"
							})
						]
					})]
				}, project.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: Boolean(target),
				title: "Delete this project?",
				body: target ? `${target.title} will be removed from this browser.` : "",
				confirmLabel: "Delete",
				onOpenChange: (open) => {
					if (!open) setPendingDelete(null);
				},
				onConfirm: () => {
					if (pendingDelete) deleteProject(pendingDelete);
					setPendingDelete(null);
				}
			})
		]
	});
}
var SplitComponent = ProjectsPage;
//#endregion
export { SplitComponent as component };
