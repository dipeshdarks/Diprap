# SKILLS PRACTICE LAB — spec (master prompt §9)

The Practice Lab turns analysis into writing reps. It trains **general
techniques** — never the artist's distinctive style, never copying lyrics.

## Principles

1. **Interpret before reveal** — you commit an answer, then see the model's
   reading; comparison beats passive reading.
2. **Produce, don't just recognize** — rewrite prompts make you use the device.
3. **Honest checking** — the local checker only verifies what it can (spelling
   of end words, structural similarity); it never claims to grade meaning.
4. **Originality** — practice text is the user's own; the demo song is an
   original lab composition, not a commercial track.

## Exercises

### 1. Interpret the bar (prompt: `interpretation`)
- Pick a bar (numbered picker over the active project).
- Text area: "What is this bar doing — literally, deeper, technique?"
- **Reveal** shows the model's `meaning` + `wordplay` for that bar
  (or the honest hint that no model reading exists).
- Saving stores a `PracticeNote { barIndex, prompt: "interpretation", text }`
  in the project; the note badge shows on the bar afterwards.

### 2. Rewrite the bar (prompt: `rewrite`)
- Same picker; prompt: write your own line that uses the same **general
  technique** (e.g., end rhyme + double meaning) with different content.
- Checker (local, spelling-level):
  - does the rewrite's **last word rhyme** (shared last-3 letters) with the
    target rhyme group? → "matches the rhyme group (spelling pass)";
  - length sanity (≤ line cap);
  - the check result is labeled *text estimate*, never a quality score.
- Notes persist identically to interpretation notes.

### 3. Spot the shared ending (quiz)
- Local generator: builds a 4-option multiple-choice from the project's own
  end-rhyme groups — "which two lines share an ending?"
- Options = real lines (1 correct pair + distractor lines from other groups).
- Session score (streak / total) lives in component state only — no accounts,
  no leaderboard ⇒ auth stays off (AGENTS §0.5).

## Data & limits

- `PracticeNote[]` on `LabProject`, persisted in localStorage, deep-copied on
  duplicate, cleared with project delete.
- Exercises work without a model reading (reveal degrades to "no reading —
  run a model analysis"); quiz works fully offline from local rhyme groups.

## What we deliberately do not build

- Grading or scoring the user's writing (would need judgment we can't defend).
- Style imitation of named artists (master prompt §9: technique, not copying).
- Accounts/leaderboards (would flip auth on; not requested).
