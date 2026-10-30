# UI / UX DESIGN SYSTEM — DIPRAP

Dark neon "analysis dashboard" identity, matched to the four reference mocks
in `ui image/` (Neon Bars, Flow & Cadence, RapLab Overview, Practice variants).

## Tokens (`src/styles.css` @theme)

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#0d0d0f` | page |
| `--color-surface` | `#151519` | cards, rails |
| `--color-raised` | `#1d1d23` | hover/selected rows, chips base |
| `--color-fg` | `#f5f5f4` | primary text |
| `--color-muted` | `#b5b5be` | secondary |
| `--color-faint` | `#8a8a96` | hints, axis labels |
| `--color-border` | `#303038` | 1px separators |
| `--color-accent` | `#8b5cf6` | primary actions, active tab, selection ring |
| `--color-cyan` | `#22d3ee` | info accents |
| `--color-gold` | `#f2c94c` | warnings, Draft badge |
| `--color-danger` / `--color-ok` | `#e63946` / `#3dd68c` | errors / success |

Fonts: **Outfit** (UI) + **IBM Plex Mono** (data, indices, metrics).
Radii: `sm .5rem · md .75rem · lg 1rem · xl 1.25rem`.

## Tag-chip palette (lettered technique chips)

Each `TagKind` owns a hue; chips render `<letter> <Label>` (e.g. `A End Rhyme`)
with the letter derived from rhyme-group order.

| Kind | Hue | Sample |
| --- | --- | --- |
| end_rhyme | amber | `A End Rhyme` |
| internal_rhyme | blue | `B Internal Rhyme` |
| multisyllabic | teal | `C Multisyllabic` |
| wordplay | pink | `D Wordplay` |
| cadence | violet | `E Cadence` |
| slant | rose | `F Slant Rhyme` |
| theme | orange | `G Theme` |
| metaphor | green | `M Metaphor` |
| repetition | indigo | `H Repetition` |

Chips are translucent-hue on raised surface, 11–12px, pill radius, mono label.

## Confidence & evidence badges

- **Confidence:** High = green outline, Medium = amber, Low = gray.
- **Evidence:** `Measured` = green · `Estimated` / `Text estimate` = cyan ·
  `Interpretation` / `Model-estimated` = purple · `Unavailable` = gray.
  Always visible next to any quantitative claim.

## Layout

- **Shell:** fixed left sidebar (nav + Current Project card + Analysis Progress
  `x / 7 modules`), top bar (search ⌘K, help, theme affordance, avatar).
- **Analysis workspace:** project header → tab row (Overview, Story, Bars,
  Rhymes, Flow, Production, Practice) → split: main column + right insight rail
  (~340px), bottom sticky audio player.
- **Right rail patterns:** `Bar N of M` pager; collapsible sections — Meaning,
  Writing Technique, Rhyme Mechanics, Narrative Function, Alternative Reading,
  Evidence (Bars view); Context & Insights (Overview).
- **Lists:** numbered rows (mono index circle), selected row = accent ring +
  raised bg; hover = subtle raise; 3-dot menu reserved for row actions.

## Chart & timeline language

- Density chart: accent-purple area, faint grid, tooltip in mono.
- Timeline sections: per-type hues (intro gray-blue, verse blue, hook amber,
  bridge teal, outro violet) at ~18% opacity fills + 1px borders + label pills.
- Cadence lanes: phrase = purple bar, stress = amber dot, pause = gray slot.
- Waveform: muted slate bars; current section/bar overlay in accent.

## Motion & feel

- Transitions ≤ 150ms on hover/selection; no decorative animation;
  `prefers-reduced-motion` kills all easing (global rule).
- Focus-visible: 2px accent outline, offset 2px (accessibility floor).

## Voice (copy rules)

- Short, technical, honest: "Text estimate — spelling match, not a verified
  rhyme." never "Definitive analysis."
- Every module state has an empty state (`EmptyState`), loading
  (`LoadingState`), and error (`ErrorState`) component — no bare spinners.
- Buttons say what they do ("New Analysis", "Run model reading"), never "Go".

## Mobile (390×844)

Sidebar collapses to icon rail/drawer; right rail stacks under main column;
metric cards go 2-up; tab row scrolls horizontally; no horizontal overflow.
