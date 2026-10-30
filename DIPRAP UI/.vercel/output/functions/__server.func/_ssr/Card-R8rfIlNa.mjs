import { n as EVIDENCE_LABEL } from "./text-analysis-BV1TbPXT.mjs";
import { A as Slot, L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { u as cn } from "./router-BoH-vfaJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Card-R8rfIlNa.js
var import_jsx_runtime = require_jsx_runtime();
var tones = {
	accent: "bg-accent/15 text-accent",
	gold: "bg-gold/15 text-gold",
	cyan: "bg-cyan/15 text-cyan",
	ok: "bg-ok/15 text-ok",
	danger: "bg-danger/15 text-danger",
	muted: "bg-raised text-muted",
	blue: "bg-blue/15 text-blue",
	teal: "bg-teal/15 text-teal",
	pink: "bg-pink/15 text-pink",
	rose: "bg-rose/15 text-rose",
	orange: "bg-orange/15 text-orange",
	indigo: "bg-indigo/15 text-indigo"
};
function Badge({ tone = "muted", className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", tones[tone], className),
		children
	});
}
function toneForKind(kind) {
	switch (kind) {
		case "end_rhyme": return "gold";
		case "internal_rhyme": return "blue";
		case "multisyllabic": return "teal";
		case "wordplay": return "pink";
		case "cadence": return "accent";
		case "slant": return "rose";
		case "theme": return "orange";
		case "metaphor": return "ok";
		case "repetition": return "indigo";
		default: return "muted";
	}
}
function confidenceTone(confidence) {
	if (confidence === "high") return "ok";
	if (confidence === "medium") return "gold";
	return "muted";
}
function evidenceTone(evidence) {
	if (evidence === "measured" || evidence === "user_provided") return "ok";
	if (evidence === "unavailable") return "muted";
	if (evidence === "unverified") return "gold";
	return "accent";
}
function evidenceLabel(evidence) {
	return EVIDENCE_LABEL[evidence];
}
var buttonStyles = cva("inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:bg-accent/90",
			secondary: "border border-border bg-raised text-fg hover:bg-surface",
			ghost: "text-muted hover:bg-raised hover:text-fg",
			danger: "bg-danger text-fg hover:bg-danger/90"
		},
		size: {
			md: "min-h-11 px-4",
			sm: "min-h-11 px-3"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild = false, type = "button", ...props }) {
	if (asChild) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slot, {
		className: cn(buttonStyles({
			variant,
			size
		}), className),
		...props
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn(buttonStyles({
			variant,
			size
		}), className),
		type,
		...props
	});
}
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-lg border border-border bg-surface", className),
		...props
	});
}
//#endregion
export { evidenceLabel as a, confidenceTone as i, Button as n, evidenceTone as o, Card as r, toneForKind as s, Badge as t };
