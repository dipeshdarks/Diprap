import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as Card } from "./Card-R8rfIlNa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmptyState-8DjM6I7n.js
var import_jsx_runtime = require_jsx_runtime();
function EmptyState({ icon, title, body, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "flex flex-col items-start gap-3 p-6",
		children: [
			icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-accent",
				children: icon
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold text-fg",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-xl text-sm text-muted",
				children: body
			}),
			action
		]
	});
}
//#endregion
export { EmptyState as t };
