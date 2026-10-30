export interface SongSearchConfig {
  provider: "genius";
  configured: false;
  reason: string;
}

const CONFIG: SongSearchConfig = {
  provider: "genius",
  configured: false,
  reason:
    "No Genius API token is configured. DIPRAP will not invent search results, artwork, or lyrics.",
};

export function getSongSearchConfig(): SongSearchConfig {
  return CONFIG;
}

export function geniusSearchUrl(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return "https://genius.com/";
  return `https://genius.com/search?q=${encodeURIComponent(trimmed)}`;
}

export function geniusHomeUrl(): string {
  return "https://genius.com/";
}
