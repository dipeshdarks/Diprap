import { i as __toESM } from "../_runtime.mjs";
import { m as splitBars, r as LANGUAGES } from "./text-analysis-BV1TbPXT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { m as ExternalLink } from "../_libs/lucide-react.mjs";
import { a as validateArtist, c as validateUrl, i as useLabStore, p as initials, s as validateTitle } from "./router-BoH-vfaJ.mjs";
import { n as Button, r as Card, t as Badge } from "./Card-R8rfIlNa.mjs";
import { t as EmptyState } from "./EmptyState-8DjM6I7n.mjs";
import { n as getSongSearchConfig, t as geniusSearchUrl } from "./song-search-QAE70n6g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-CXZTvQQX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SongResultCard({ title, artist, meta, badge, footnote, geniusUrl, onOpen, openLabel = "Open" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "flex flex-col gap-4 p-4 sm:flex-row sm:items-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-14 shrink-0 place-items-center rounded-md bg-raised text-sm font-semibold text-accent",
				"aria-hidden": true,
				children: initials(title)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "truncate text-base font-semibold text-fg",
							children: title
						}), badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "muted",
							children: badge
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm text-muted",
						children: artist
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-faint",
						children: meta
					}),
					footnote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: footnote
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onOpen,
					children: openLabel
				}), geniusUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: geniusUrl,
						target: "_blank",
						rel: "noreferrer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
							className: "size-4",
							"aria-hidden": true
						}), "Genius"]
					})
				}) : null]
			})
		]
	});
}
function SongSearch() {
	const projects = useLabStore((state) => state.projects);
	const createProject = useLabStore((state) => state.createProject);
	const setActiveProject = useLabStore((state) => state.setActiveProject);
	const defaultLanguage = useLabStore((state) => state.defaultLanguage);
	const navigate = useNavigate();
	const config = getSongSearchConfig();
	const [title, setTitle] = (0, import_react.useState)("");
	const [artist, setArtist] = (0, import_react.useState)("");
	const [language, setLanguage] = (0, import_react.useState)(defaultLanguage);
	const [sourceUrl, setSourceUrl] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("");
	const [debounced, setDebounced] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [formError, setFormError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const timer = window.setTimeout(() => setDebounced(filter), 250);
		return () => window.clearTimeout(timer);
	}, [filter]);
	const filtered = (0, import_react.useMemo)(() => {
		const needle = debounced.trim().toLowerCase();
		return projects.filter((project) => {
			if (status === "draft" && project.model) return false;
			if (status === "analyzed" && !project.model) return false;
			if (!needle) return true;
			return `${project.title} ${project.artist} ${project.language}`.toLowerCase().includes(needle);
		});
	}, [
		projects,
		debounced,
		status
	]);
	const query = [title, artist].map((part) => part.trim()).filter(Boolean).join(" ");
	const geniusUrl = geniusSearchUrl(query);
	function create() {
		const titleError = validateTitle(title);
		const artistError = validateArtist(artist);
		const urlError = validateUrl(sourceUrl);
		const message = titleError || artistError || urlError;
		if (message) {
			setFormError(message);
			return;
		}
		setFormError(null);
		createProject({
			title: title.trim(),
			artist: artist.trim(),
			language,
			sourceUrl: sourceUrl.trim() || void 0
		});
		navigate({
			to: "/analyze",
			search: { view: "lyrics" }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-4 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-semibold text-fg",
				children: "Find a song"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-muted",
				children: "Discover tracks. Decode the writing."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-2 border-gold/30 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold text-fg",
						children: "Genius is not connected"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: config.reason
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Search Genius in a new tab, then paste only lyrics you have the right to use. This page will not show fake results."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-4 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold text-fg",
						children: "Start from metadata you enter"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-2 text-sm text-muted",
								children: ["Title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: title,
									onChange: (event) => setTitle(event.target.value),
									className: "h-11 rounded-md border border-border bg-bg px-3 text-fg"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-2 text-sm text-muted",
								children: ["Artist", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: artist,
									onChange: (event) => setArtist(event.target.value),
									className: "h-11 rounded-md border border-border bg-bg px-3 text-fg"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-2 text-sm text-muted",
								children: ["Language", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: language,
									onChange: (event) => setLanguage(event.target.value),
									className: "h-11 rounded-md border border-border bg-bg px-3 text-fg",
									children: LANGUAGES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: item }, item))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-2 text-sm text-muted",
								children: ["Reference link (optional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: sourceUrl,
									onChange: (event) => setSourceUrl(event.target.value),
									placeholder: "https://",
									className: "h-11 rounded-md border border-border bg-bg px-3 text-fg placeholder:text-faint"
								})]
							})
						]
					}),
					formError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "text-sm text-danger",
						children: formError
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: create,
							children: "Create project"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: geniusUrl,
								target: "_blank",
								rel: "noreferrer",
								children: query ? `Search Genius for “${query}”` : "Open Genius"
							})
						})]
					}),
					query ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SongResultCard, {
						title: title.trim(),
						artist: artist.trim() || "Artist not set",
						meta: `${language} · not a live search result`,
						badge: "Entered by you",
						footnote: "No artwork is shown because Genius did not return an authorized image.",
						geniusUrl,
						openLabel: "Use this title",
						onOpen: create
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold text-fg",
						children: "On this device"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "sr-only",
								htmlFor: "saved-filter",
								children: "Filter saved projects"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "saved-filter",
								value: filter,
								onChange: (event) => setFilter(event.target.value),
								placeholder: "Filter by title or artist",
								className: "h-11 rounded-md border border-border bg-surface px-3 text-sm text-fg placeholder:text-faint"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								"aria-label": "Project status",
								value: status,
								onChange: (event) => setStatus(event.target.value),
								className: "h-11 rounded-md border border-border bg-surface px-3 text-sm text-fg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: "All"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "draft",
										children: "Text only"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "analyzed",
										children: "Model reading"
									})
								]
							})
						]
					})]
				}), filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No projects match",
					body: "Nothing saved in this browser fits that filter."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3",
					children: filtered.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SongResultCard, {
						title: project.title,
						artist: project.artist,
						meta: `${project.language} · ${splitBars(project.lyrics).length} bars`,
						badge: project.model ? "Model reading" : project.isDemo ? "Lab demo" : "Text estimate",
						geniusUrl: project.sourceUrl,
						openLabel: "Analyze",
						onOpen: () => {
							setActiveProject(project.id);
							navigate({
								to: "/analyze",
								search: { view: "lyrics" }
							});
						}
					}, project.id))
				})]
			})
		]
	});
}
var SplitComponent = SongSearch;
//#endregion
export { SplitComponent as component };
