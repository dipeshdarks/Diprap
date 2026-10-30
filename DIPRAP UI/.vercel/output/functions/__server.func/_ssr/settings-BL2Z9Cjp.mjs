import { i as __toESM } from "../_runtime.mjs";
import { r as LANGUAGES } from "./text-analysis-BV1TbPXT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useLabStore, l as getAiAvailability } from "./router-BoH-vfaJ.mjs";
import { n as Button, r as Card, t as Badge } from "./Card-R8rfIlNa.mjs";
import { t as downloadJson } from "./download-Bm7VhDBp.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-3QnMoWDZ.mjs";
import { n as getSongSearchConfig } from "./song-search-QAE70n6g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BL2Z9Cjp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const displayName = useLabStore((state) => state.displayName);
	const setDisplayName = useLabStore((state) => state.setDisplayName);
	const defaultLanguage = useLabStore((state) => state.defaultLanguage);
	const setDefaultLanguage = useLabStore((state) => state.setDefaultLanguage);
	const projects = useLabStore((state) => state.projects);
	const clearAll = useLabStore((state) => state.clearAll);
	const restoreDemo = useLabStore((state) => state.restoreDemo);
	const [name, setName] = (0, import_react.useState)(displayName);
	const [ai, setAi] = (0, import_react.useState)("unknown");
	const [confirmClear, setConfirmClear] = (0, import_react.useState)(false);
	const genius = getSongSearchConfig();
	(0, import_react.useEffect)(() => {
		setName(displayName);
	}, [displayName]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		getAiAvailability().then((result) => {
			if (!cancelled) setAi(result.available ? "ready" : "unavailable");
		}).catch(() => {
			if (!cancelled) setAi("unavailable");
		});
		return () => {
			cancelled = true;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 p-4 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-semibold text-fg",
				children: "Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Preferences stay on this device with your projects."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-4 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold text-fg",
						children: "Profile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid max-w-sm gap-2 text-sm text-muted",
						children: ["Display name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							maxLength: 40,
							onChange: (event) => setName(event.target.value),
							className: "h-11 rounded-md border border-border bg-bg px-3 text-fg"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => {
							setDisplayName(name.trim() || "Dipesh");
							toast.success("Name updated.");
						},
						children: "Save name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid max-w-sm gap-2 text-sm text-muted",
						children: ["Default language for new projects", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: defaultLanguage,
							onChange: (event) => setDefaultLanguage(event.target.value),
							className: "h-11 rounded-md border border-border bg-bg px-3 text-fg",
							children: LANGUAGES.map((language) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: language }, language))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold text-fg",
						children: "Services"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: ["Genius API: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "muted",
							children: "Not configured"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: genius.reason
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"Model readings:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: ai === "ready" ? "ok" : "muted",
								children: ai === "unknown" ? "Checking…" : ai === "ready" ? "Available when you analyze" : "Unavailable"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Analyze sends only the excerpt you submit. It does not run on page load."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold text-fg",
						children: "Data"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Do not paste lyrics you do not have the right to use. This lab does not download them."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => {
									downloadJson("diprap-projects.json", {
										exportedFrom: "DIPRAP",
										notice: "Local projects. Model text is interpretation. Audio is not included.",
										projects
									});
									toast.success("Exported every project.");
								},
								children: "Export all"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: restoreDemo,
								children: "Restore demo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								onClick: () => setConfirmClear(true),
								children: "Clear local projects"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: confirmClear,
				title: "Clear projects on this device?",
				body: "Saved lyrics, notes, and model readings in this browser will be replaced by the lab demo.",
				confirmLabel: "Clear",
				onOpenChange: setConfirmClear,
				onConfirm: () => {
					clearAll();
					setConfirmClear(false);
					toast.success("Local projects cleared.");
				}
			})
		]
	});
}
var SplitComponent = SettingsPage;
//#endregion
export { SplitComponent as component };
