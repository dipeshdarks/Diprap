import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as useActiveProject } from "./router-BoH-vfaJ.mjs";
import { n as Button } from "./Card-R8rfIlNa.mjs";
import { n as ProjectHeader } from "./ProjectHeader-VU_w-hKi.mjs";
import { t as EmptyState } from "./EmptyState-8DjM6I7n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProjectFrame-BYGceIlF.js
var import_jsx_runtime = require_jsx_runtime();
function ProjectFrame({ children }) {
	const project = useActiveProject();
	if (!project) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 md:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No project open",
			body: "Choose a project before using this lab.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/projects",
					children: "My projects"
				})
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 p-4 md:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectHeader, { project }), children]
	});
}
//#endregion
export { ProjectFrame as t };
