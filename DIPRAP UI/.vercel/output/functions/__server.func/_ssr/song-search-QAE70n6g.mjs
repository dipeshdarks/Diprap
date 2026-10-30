//#region node_modules/.nitro/vite/services/ssr/assets/song-search-QAE70n6g.js
var CONFIG = {
	provider: "genius",
	configured: false,
	reason: "No Genius API token is configured. DIPRAP will not invent search results, artwork, or lyrics."
};
function getSongSearchConfig() {
	return CONFIG;
}
function geniusSearchUrl(query) {
	const trimmed = query.trim();
	if (!trimmed) return "https://genius.com/";
	return `https://genius.com/search?q=${encodeURIComponent(trimmed)}`;
}
//#endregion
export { getSongSearchConfig as n, geniusSearchUrl as t };
