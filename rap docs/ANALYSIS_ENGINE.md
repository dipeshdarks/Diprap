# ANALYSIS ENGINE — master prompt → implementation contract

The MASTER PROMPT (elite lyricist / flow analyst / rhyme specialist) drives the
**model reading**. The local analyzer covers what can be derived from text
alone. This doc is the single source of truth for what each layer produces.

## Layer A — local text estimate (`src/lib/text-analysis.ts`)

Pure, deterministic, no network. Exports:

| Function | Output |
| --- | --- |
| `splitBars(lyrics)` | Non-empty lines, original order (index-stable) |
| `countWords` / `wordInLine` / `splitHighlight` | Word ops for highlighting |
| `estimateSyllables(line)` | Vowel-group heuristic; Devanagari matra heuristic for Hindi; `null` + basis caveat otherwise |
| `detectStructure(lines)` | `SongSection[]` from `[Hook]`/`Verse 2:` markers (basis `marker`), repeated-line detection (basis `repetition`), else 4-line stanzas (basis `assumed`) |
| `endRhymeGroups` (in `analyzeText`) | Shared last-3-letter groups ≥2 lines, each assigned a **letter A, B, C…** in order of first appearance; `multisyllabic: true` when ≥2 members share the last 5 letters |
| `stanzaPattern` (in `analyzeText`) | Per 4-line stanza: `AABB` / `ABAB` / `ABCB` / `free` from letter sequence — labeled text estimate |
| `analyzeText(lyrics, language)` | Full `TextEstimate`: per-line syllables+basis, end/internal groups, repetition, pause notes (punctuation ≠ breath), flow observations (avg syllables, swing ≥4, breaks), disclaimer |
| `syllableSummary` | Totals/averages |
| `isModelStale(savedLines, lyrics)` | Stale check after edits |

Rules:
- Never claim phonetics — group matches are **spelling matches**, stated in UI.
- Latin-script assumptions are surfaced per line (`syllableBasis`).
- A written line is not asserted to be one musical bar; the estimate reports
  lines and stanzas, not BPM or timing.

## Layer B — model reading (`src/lib/analyze.functions.ts`)

Server function `analyzeLyrics` (POST, zod-validated): lyrics ≤8000 chars,
1–40 lines, language ∈ English/Hindi/Hinglish/Other, 1–7 modules.
Calls `https://api.x.ai/v1/chat/completions`, model `grok-4.5`,
`temperature 0.2`, `max_tokens 8192`, `response_format: json_object`,
55 s timeout, single retry on 429/5xx, 8 s client-side rate limit.

### System prompt (honesty core — always on)

JSON only. No added/rewritten lyrics. No invented BPM, timestamps, waveforms,
instrument or production credits. Phonetics = guesses, labeled as guesses.
Separate confirmed references from speculative interpretations. Never claim a
reading is definitive. When language is Hinglish/Hindi: preserve original
attitude/tone when explaining, distinguish literal translation from cultural
meaning.

### Requested JSON shape (master prompt mapping)

```jsonc
{
  "story": {                        // §1 song story & meaning, §8 Hinglish context
    "centralMessage": string,
    "narrativeArc": string,         // beginning → end
    "atmosphere": string,
    "perspective": string,          // narrator stance, intended impact
    "slangAndReferences": [{ "title": string, "explanation": string }],
    "languageNotes": string         // code-switching, regional expressions
  },
  "structure": [{                   // §3 bar count & structure
    "type": "intro"|"verse"|"hook"|"bridge"|"outro",
    "label": string, "startIndex": number, "endIndex": number, "note": string
  }],
  "flowMap": [{                     // §5 section-by-section flow map (qualitative)
    "section": string, "flowStyle": string, "rhythm": string,
    "rhymeTechnique": string, "effect": string
  }],
  "scorecard": [{                   // §10 final scorecard (0–10 + evidence)
    "dimension": "storytelling"|"wordplay"|"rhyme_complexity"|"flow_cadence"|
                 "technical_delivery"|"emotional_impact"|"beat_synergy"|"overall_songwriting",
    "score": number, "evidence": string
  }],
  "strongestMoments": [{ "barIndex": number, "moment": string, "why": string }],
  "weaknesses":   [{ "observation": string, "evidence": string }],
  "overallMeaning": string,
  "themes"/"metaphors"/"doubleMeanings"/"punchlines"/
  "culturalReferences"/"alternativeInterpretations": [{title, explanation}],
  "flowNotes"/"cadenceNotes": string[],   // qualitative only — no BPM/counts
  "bars": [{ "index", "meaning", "alternative", "wordplay"[], "metaphors"[],
             "rhymeMechanics", "narrativeFunction",
             "confidence": "low"|"medium"|"high", "uncertainty",
             "tags": [{ "label", "kind" }] }],   // §2 bar-by-bar
  "rhymes": [{ "type": "end"|"internal"|"multisyllabic"|"slant",
               "sound", "explanation",
               "members": [{ "barIndex", "word", "note" }] }]  // §6
}
```

### Response scrubbing (`toAnalysis`)

Defense in depth before anything reaches the UI:

- Every string clipped (meaning ≤700, explanations ≤500, tags ≤40 chars).
- Insight lists capped at 8; bars ≤5 wordplay/metaphor entries; tags ≤6/bar.
- `bars` must cover every line index — missing ones get empty strings.
- Rhyme members **must literally appear in the claimed line** (`wordInLine`);
  groups need ≥2 valid members + an explanation.
- Structure indices clamped to `[0, lineCount-1]`, `startIndex ≤ endIndex`,
  invalid/unknown types dropped or merged into nearest valid section.
- Scorecard: only the 8 canonical dimensions, scores clamped 0–10 rounded,
  duplicates dropped.
- Confidence/tag enums normalized to known sets (`theme` fallback for tags,
  `low` fallback for confidence).

### Error codes

`unavailable` (no key / 401 / 403) · `rate` (8 s limit) · `invalid` (line count)
· `upstream` (5xx, timeout) · `format` (unparseable or empty reading).
All keep the user's lyrics; none silently mock data.

## Determinism vs interpretation

| Claim type | Source | Badge |
| --- | --- | --- |
| Syllable counts, word counts, marker detection | Local heuristic | Text estimate |
| Rhyme letters, pattern labels | Local spelling match | Text estimate |
| Meaning, story, wordplay, flow map, scores | grok-4.5 | Model interpretation |
| Waveform peaks, duration, sample rate | Web Audio decode | Measured |
| BPM, timestamps, breath points | — | Unavailable (never fabricated) |
