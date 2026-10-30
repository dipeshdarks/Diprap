# FLOW & CADENCE AUDIO LAB — spec (master prompt §4, §5, §7)

The Flow Lab answers: how fast, how dense, how rhythmic — and it must never
pretend to know what it cannot hear.

## Evidence labeling (drives every badge on this screen)

| Badge | Meaning |
| --- | --- |
| **Measured** | Derived from decoded audio: duration, sample rate, waveform peaks |
| **Estimated** | Deterministic text/geometry heuristic: syllables, phrase breaks, section boxes |
| **Interpretation** | Model reading: delivery style, rhythm notes, stress guesses |
| **Unavailable** | BPM, real timestamps, breath points — without audio, shown as `—` with copy, never fabricated |

## Inputs

1. **Text** (always): `analyzeText()` → per-line syllables, punctuation breaks,
   flow observations; `detectStructure()` → sections.
2. **Audio** (optional): user attaches ≤30 MB file → `decodeAudioData` →
   180-bucket normalized peak array + duration + sample rate (all *Measured*).

## Structure timeline

- Sections rendered as labeled boxes over the waveform (or a text-driven
  placeholder strip when no audio): `Intro / Verse 1 / Hook / Verse 2 / Outro`.
- Source priority: **model `structure[]`** (badged model interpretation) →
  **local `detectStructure()`** (markers > repetition > assumed 4-line stanzas,
  badged text estimate).
- Without audio, x-position is *line-index proportionality* — the strip says so.

## Metric cards (row of five)

| Card | Source | Fallback |
| --- | --- | --- |
| Tempo (estimated) | — | `—` + "attach audio to estimate" (never a guess) |
| Syllables per second | measured duration × local syllable total | `Estimated`, or `—` without audio |
| Syllables per beat | needs BPM | always `—` (BPM unavailable) |
| Phrases detected | local: punctuation/syntax breaks | `Estimated` |
| Pause ratio | local: punctuation gaps vs line lengths | `Estimated` (labeled, not breath) |

Each card carries its evidence badge; "Measured" only for audio-derived values.

## Syllable density chart (Recharts area)

- x = line index (text mode) or time (audio mode), y = syllables per unit.
- Local estimate only, labeled "Text estimate — denser delivery ≠ faster flow"
  (master prompt: perceived speed ≠ actual density).

## Cadence map (three lanes: Phrase / Stress / Pause)

- **Phrase lane**: segment lengths from punctuation breaks → purple bars.
- **Stress lane**: heuristic stress = syllable-count peak per line + model
  `stressPattern` notes when present → amber dots (interpretation if model).
- **Pause lane**: punctuation gaps → gray slots; copy: "punctuation break, not
  a measured breath".
- All three are x-aligned to the same index/time axis as the density chart.

## Flow insights panel

Source order: model `flowMap[]` (per section: flow style, rhythm, rhyme
technique, effect) → model `flowNotes`/`cadenceNotes` → local flow observations
(avg syllables/line, ≥4 swing, breaks). Every card keeps its source badge.

## Selected-segment rail

Bar/segment picker with prev/next (`Bar N of M`): shows the segment's lines,
delivery-speed guess (model), syllable density (local), rhythm notes (model),
pause notes (local), and an overall **confidence** with basis copy.

## Audio panel (shared with Overview/Bars)

- Waveform from peaks; bar-marker dots positioned by line proportionality;
  play/pause, seek, speed menu (playbackRate), volume, fullscreen.
- Layer toggles: Rhyme Highlights · Annotations · Flow Notes · Bar Boundaries —
  each toggles an overlay on the Bars view; persisted per session only.
- Without audio: deterministic text-shape waveform (seeded by syllable counts)
  clearly labeled "illustrative — no audio attached".
