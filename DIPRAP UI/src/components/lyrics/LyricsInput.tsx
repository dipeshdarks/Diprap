import { LANGUAGES, type Language } from "@/types/analysis";
import { MAX_LYRICS } from "@/lib/text-analysis";

export function LyricsInput({
  lyrics,
  language,
  error,
  onLyrics,
  onLanguage,
  onClear,
}: {
  lyrics: string;
  language: Language;
  error: string | null;
  onLyrics: (value: string) => void;
  onLanguage: (language: Language) => void;
  onClear: () => void;
}) {
  const over = lyrics.length > MAX_LYRICS;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label htmlFor="lyrics" className="text-sm font-medium text-fg">
          Lyrics
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted" htmlFor="language">
            Language
            <select
              id="language"
              value={language}
              onChange={(event) => onLanguage(event.target.value as Language)}
              className="h-11 rounded-md border border-border bg-bg px-2 text-fg"
            >
              {LANGUAGES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={onClear} className="min-h-11 px-2 text-sm text-muted hover:text-fg">
            Clear
          </button>
        </div>
      </div>
      <textarea
        id="lyrics"
        value={lyrics}
        onChange={(event) => onLyrics(event.target.value)}
        rows={12}
        placeholder="Paste a lyric excerpt to explore its meaning, rhyme, and writing techniques..."
        aria-invalid={Boolean(error) || over}
        aria-describedby="lyrics-help"
        className="w-full resize-y rounded-md border border-border bg-bg px-3 py-3 font-mono text-sm leading-6 text-fg placeholder:text-faint"
      />
      <div id="lyrics-help" className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <p className={over || error ? "text-danger" : "text-faint"}>
          {error ?? "Blank lines are skipped. Each remaining line is one bar. Nothing is fetched from Genius."}
        </p>
        <p className={`tabular-nums ${over ? "text-danger" : "text-muted"}`}>
          {lyrics.length.toLocaleString()} / {MAX_LYRICS.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
