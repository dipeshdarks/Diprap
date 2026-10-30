# PRODUCT BLUEPRINT — DIPRAP: Rap Lyrics & Song Analysis Lab

## Vision

A browser lab that explains not just **what** a rapper says, but **how** they write,
flow, rhyme, and create impact — with ruthless honesty about what is measured,
what is estimated, and what is interpretation.

Two analysis layers, always distinguishable in the UI:

1. **Text estimate** — free, instant, deterministic (`src/lib/text-analysis.ts`).
   Spelling-level heuristics: syllable counts, end-rhyme groups, repetition,
   section markers, cadence-map inputs. Never claims phonetic truth.
2. **Model reading** — optional, server-side xAI call (`src/lib/analyze.functions.ts`,
   model `grok-4.5`). The MASTER PROMPT deep analysis: story, bar-by-bar,
   structure, flow map, scorecard. Labeled *model interpretation*, never fact.

No Genius, no BPM, no timestamps without audio. Absent evidence is shown as
"Unavailable", never invented.

## Feature surface (routes)

| Route | Screen | Purpose |
| --- | --- | --- |
| `/` | Dashboard | Stats, recent projects, evidence legend, new analysis |
| `/projects` | My Projects | List/duplicate/delete local projects |
| `/search` | Song Search | Manual metadata entry; external Genius link (unconfigured by design) |
| `/analyze?view=` | Analysis workspace | 8 tabs: Overview, Story, Bars, Rhymes, Flow, Production, Practice, + Lyrics input |
| `/rhyme-lab` | Rhyme Lab | End/internal/multisyllabic groups, spelling pass vs model reading |
| `/flow-lab` | Flow & Cadence Lab | Structure timeline, metric cards, syllable density, cadence map, flow insights |
| `/practice` | Practice Lab | Interpret-before-reveal, rewrite-the-bar, rhyme quiz |
| `/settings` | Settings | Language defaults, service availability, demo restore, JSON export |

## Analysis modules (7 — user-selectable, default all on)

`meaning`, `wordplay`, `rhyme`, `narrative`, `flow`, `story`, `scorecard`

- **meaning** — bar-level literal/deeper meaning.
- **wordplay** — double meanings, metaphors, puns, setup-and-payoff.
- **rhyme** — end/internal/multisyllabic/slant groups + mechanics per bar.
- **narrative** — each bar's function in the story arc.
- **flow** — cadence, density, rhythm notes; feeds the Flow Map (qualitative only).
- **story** — central message, narrative arc, atmosphere, perspective, slang &
  cultural references (Hinglish/Desi context per master prompt §8).
- **scorecard** — 8 dimensions × 0–10 with evidence, plus strongest moments and
  weaknesses (master prompt §9–10).

## Data model (localStorage key `diprap-lab`)

- `LabProject` (`src/types/song.ts`): title, artist, language, lyrics, modules,
  `model: ModelAnalysis | null`, `modelError`, `practiceNotes[]`, `isDemo?`.
- `ModelAnalysis` (`src/types/analysis.ts`): overallMeaning, story, structure[],
  flowMap[], scorecard, bars[] (per-index readings + lettered tag chips),
  rhymes[], strongestMoments[], weaknesses[], flowNotes, cadenceNotes,
  `sourceLines` (staleness check), generatedAt, disclaimer.
- `TextEstimate`: per-line syllables + basis, end-rhyme groups with **letter
  labels (A, B, C…)**, stanza pattern labels (AABB/ABAB/free), structure guess,
  repetition map, flow observations.
- Transient: `AttachedAudio` (decoded peaks, duration) — never persisted as blob.

## Storage & services

- **Auth: OFF. DB: OFF.** Everything is per-browser localStorage (platform rule:
  no accounts named ⇒ no auth). Settings can restore the demo or clear all.
- **xAI: optional.** Server function requires `XAI_API_KEY`; without it the app
  shows `unavailable` with the text estimate intact. Rate limit 8 s, 55 s timeout,
  one retry on 429/5xx, JSON-only response scrubbed by zod.
- **Export:** JSON download of a project (Settings / header Export).

## Honesty contract (non-negotiable)

- Every quantitative claim carries an evidence badge: `measured`, `text estimate`,
  `model interpretation`, `unverified`, `unavailable`.
- The model is forbidden from inventing lyrics, BPM, timestamps, waveforms,
  production credits; phonetics are described as guesses.
- Lyric edits mark the model reading **stale** (sourceLines comparison).
- A written line ≠ a musical bar: UI always says "written lines" locally, and
  bar counts from the model are labeled as the model's reading.

## Quality gates

`npm run typecheck`, `npm run lint`, `npm test` (app tests), `npm run build`,
browser smoke on desktop + mobile with clean console.
Known pre-existing exception: 8 platform `scripts/grok-pwa-plugin.test.mjs`
og:title assertions fail against the skill-sanctioned `site.json` title — those
files are platform-owned and untouchable.
