# LYRICS SEARCH & AI STATUS — contract

## Search (Genius)

**State: intentionally unconfigured.** `src/lib/song-search.ts` exports a
config with `configured: false` and no token.

Rules the Search screen upholds:

- Never fabricate search results. With no token, the UI shows a banner
  ("Genius is not connected — no token configured") and offers:
  - an **external** `https://genius.com/search?q=…` link (user leaves the app),
  - a **manual metadata form** (title, artist, language, optional source URL)
    that creates a local project — validated by `src/lib/validation.ts`.
- The `SongMetadata` type exists for a future provider; adding one requires a
  server-side token (never a `VITE_` public secret) and the same honesty banner
  until it verifies live.
- Existing local projects are filterable in place (title/artist search over
  localStorage).

## AI availability

- **Probe:** `getAiAvailability` (GET server fn) → `{ available: boolean }`,
  reads `process.env.XAI_API_KEY` server-side only. Surfaced in Settings →
  Services and drives the Analyze tab's status copy.
- **Key handling:** server-only, never shipped to the browser, never logged,
  never mocked. No key ⇒ the Analyze button explains the model reading is
  unavailable and keeps the text estimate fully functional.
- **Cost controls:** one reading per user action; 8 s minimum between calls;
  55 s hard timeout; one automatic retry on 429/5xx; `max_tokens 8192`,
  `temperature 0.2`; lyrics capped at 8000 chars / 40 lines per call.
- **Rate state:** surfaced in the UI as the `rate` error code with friendly
  copy ("wait a few seconds"), not as a raw error.

## Error taxonomy (model call)

| Code | Cause | User-facing guarantee |
| --- | --- | --- |
| `unavailable` | no key, 401, 403 | text estimate intact, lyrics kept |
| `rate` | 8 s limiter | nothing sent, lyrics kept |
| `invalid` | 0 or >40 lines | validation message before any call |
| `upstream` | 5xx / timeout | retry hint, lyrics kept |
| `format` | unparseable/empty JSON | "try again", lyrics kept |

## What search/AI must never do

- Invent lyrics, artists, bar counts, BPM, timestamps or production credits.
- Present model output without the `model interpretation` badge + disclaimer.
- Persist lyrics anywhere except the user's own localStorage (no accounts,
  no server-side lyric storage).
