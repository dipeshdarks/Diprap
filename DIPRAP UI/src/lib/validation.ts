import { MAX_BARS, MAX_LYRICS, splitBars } from "./text-analysis.ts";

export function validateLyrics(lyrics: string): string | null {
  const trimmed = lyrics.trim();
  if (!trimmed) return "Paste at least one line before analyzing.";
  if (trimmed.length > MAX_LYRICS) {
    return `Keep the excerpt under ${MAX_LYRICS.toLocaleString()} characters.`;
  }
  const bars = splitBars(trimmed);
  if (bars.length > MAX_BARS) {
    return `Analyze up to ${MAX_BARS} non-empty lines at a time.`;
  }
  return null;
}

export function validateTitle(title: string): string | null {
  const trimmed = title.trim();
  if (!trimmed) return "Add a title.";
  if (trimmed.length > 120) return "Keep the title under 120 characters.";
  return null;
}

export function validateArtist(artist: string): string | null {
  if (artist.trim().length > 120) return "Keep the artist name under 120 characters.";
  return null;
}

export function validateUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "Use an http or https link.";
    }
    return null;
  } catch {
    return "That link is not a valid URL.";
  }
}
