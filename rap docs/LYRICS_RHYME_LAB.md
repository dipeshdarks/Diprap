# LYRICS RHYME LAB — detection & display spec

Master prompt §6 (Rhyme Scheme & Wordplay Lab) implemented in two passes:
a **spelling pass** (local, always available) and a **model reading** (optional).

## Spelling pass (local)

### End keys
- End key of a line = last word ≥4 letters → last **3 Latin letters**,
  lowercased (`dreams in my pocket` → `ket`).
- Lines whose final word is <4 letters are excluded from grouping (too noisy).

### End-rhyme groups
- Key shared by **≥2 lines** → one group.
- Each group gets a **letter** assigned by order of first appearance:
  first group `A`, second `B`, … Lines in no group get no letter.
  (This powers the mockup-style chips `A End Rhyme`, `B End Rhyme`.)
- `multisyllabic: true` when ≥2 members share the last **5** letters — a
  spelling-level proxy, surfaced in UI as "approximate multisyllabic match".
- Group labels shown as **approximate** always; the disclaimer string
  ("spelling match, not a verified rhyme") renders under the group list.

### Internal rhymes
- Words ≥4 letters appearing ≥2 times **within the same line** sharing a
  last-3 key → internal-rhyme candidates for that line.
- Cross-line: the same key inside non-adjacent lines is reported as
  "internal echo", never as an end rhyme.

### Stanza pattern labels
- Every stanza (4 consecutive lines, or explicit blank-line boundary) renders
  its end-key letter sequence and a dominant label:
  `AABB` (couplet chain) · `ABAB` (alternate) · `ABCB` · `free`.
- Sequence with >4 distinct letters or partial coverage → `free`.
- Always badged **text estimate**; a model reading may disagree — the Rhyme Lab
  shows both, never silently overriding the other.

### Slant rhymes
- Local pass does **not** claim slant rhymes (needs phonetics it doesn't have).
- Slant groups come only from the model, always badged *model interpretation*.

## Model reading (Rhyme Lab second tab)

Groups arrive as `ModelRhymeGroup[]`: `type ∈ end | internal | multisyllabic |
slant`, a `sound` sketch (guessed, labeled), an explanation, and members whose
words were verified to occur in the claimed line server-side.

- Members that fail the literal-word check are dropped before display.
- Groups with <2 surviving members are dropped.
- UI letter-assigns model groups the same way as local groups (by first
  appearance) so chips read identically across passes.

## Staleness

Editing lyrics recomputes `isModelStale(sourceLines, lyrics)`. Stale model
groups are shown behind a warning banner: the reading refers to the previous
text. Local groups always recompute live.

## UI contract (`/rhyme-lab`)

- Toggle: **Spelling pass** (default) ⇄ **Model reading** (disabled with hint
  until a fresh, non-stale reading exists).
- Left: group list with letter chip, type chip, member lines, explanation.
- Right: evidence panel — source, type (`text estimate` / `model
  interpretation`), confidence, and the honesty disclaimer for that pass.
- Bottom: highlighted lyrics — member words marked per selected group
  (`splitHighlight`, whole-word matching).
