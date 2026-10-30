//#region node_modules/.nitro/vite/services/ssr/assets/text-analysis-BV1TbPXT.js
var LANGUAGES = [
	"English",
	"Hindi",
	"Hinglish",
	"Other"
];
var MODULES = [
	{
		id: "meaning",
		label: "Meaning",
		detail: "Plain-language reading of each line"
	},
	{
		id: "wordplay",
		label: "Wordplay",
		detail: "Images, doubles, and punchlines"
	},
	{
		id: "rhyme",
		label: "Rhyme",
		detail: "End, internal, multi, and slant patterns"
	},
	{
		id: "narrative",
		label: "Narrative",
		detail: "What the line does in the piece"
	},
	{
		id: "flow",
		label: "Flow notes",
		detail: "Cadence comments from the text, not audio"
	},
	{
		id: "story",
		label: "Story & context",
		detail: "Narrative arc, slang, and cultural references"
	},
	{
		id: "scorecard",
		label: "Scorecard",
		detail: "Eight-dimension score with evidence"
	}
];
var ANALYSIS_VIEWS = [
	"overview",
	"lyrics",
	"story",
	"bars",
	"rhymes",
	"flow",
	"production",
	"practice"
];
var EVIDENCE_LABEL = {
	user_provided: "User-provided text",
	measured: "Measured",
	model_estimated: "Model-estimated",
	interpretive: "Model interpretation",
	unverified: "Unverified context",
	unavailable: "Unavailable"
};
var TAG_KINDS = [
	"end_rhyme",
	"internal_rhyme",
	"multisyllabic",
	"slant",
	"wordplay",
	"theme",
	"cadence",
	"metaphor",
	"repetition"
];
var SECTION_TYPES = [
	"intro",
	"verse",
	"hook",
	"bridge",
	"outro"
];
var SCORE_DIMENSIONS = [
	"storytelling",
	"wordplay",
	"rhyme_complexity",
	"flow_cadence",
	"technical_delivery",
	"emotional_impact",
	"beat_synergy",
	"overall_songwriting"
];
var SCORE_LABEL = {
	storytelling: "Storytelling",
	wordplay: "Wordplay",
	rhyme_complexity: "Rhyme complexity",
	flow_cadence: "Flow & cadence",
	technical_delivery: "Technical delivery",
	emotional_impact: "Emotional impact",
	beat_synergy: "Beat & vocal synergy",
	overall_songwriting: "Overall songwriting"
};
var MAX_LYRICS = 8e3;
var STOP = /* @__PURE__ */ new Set([
	"i",
	"a",
	"an",
	"the",
	"and",
	"but",
	"or",
	"my",
	"me",
	"in",
	"on",
	"to",
	"of",
	"for",
	"it",
	"its",
	"it's",
	"im",
	"i'm",
	"we",
	"you",
	"they",
	"them",
	"this",
	"that",
	"that's",
	"with",
	"from",
	"at",
	"as",
	"is",
	"be",
	"was",
	"are",
	"just",
	"not",
	"no",
	"so",
	"if",
	"do",
	"dont",
	"don't",
	"your",
	"our",
	"their",
	"his",
	"her",
	"am",
	"its"
]);
function splitBars(lyrics) {
	return lyrics.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0);
}
function countWords(lyrics) {
	return splitBars(lyrics).reduce((total, line) => total + tokens(line).length, 0);
}
function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function wordInLine(word, line) {
	const cleaned = word.trim();
	if (cleaned.length < 2) return false;
	try {
		return new RegExp(`(?<![\\p{L}\\p{M}])${escapeRegExp(cleaned)}(?![\\p{L}\\p{M}])`, "iu").test(line);
	} catch {
		return line.toLowerCase().includes(cleaned.toLowerCase());
	}
}
function splitHighlight(text, words) {
	const unique = [...new Set(words.map((word) => word.trim()).filter((word) => word.length >= 2))];
	if (unique.length === 0) return [{
		text,
		hit: false
	}];
	unique.sort((a, b) => b.length - a.length);
	try {
		const pattern = unique.map(escapeRegExp).join("|");
		const re = new RegExp(`(?<![\\p{L}\\p{M}])(?:${pattern})(?![\\p{L}\\p{M}])`, "giu");
		const parts = [];
		let last = 0;
		for (const match of text.matchAll(re)) {
			const start = match.index ?? 0;
			if (start > last) parts.push({
				text: text.slice(last, start),
				hit: false
			});
			if (match[0]) parts.push({
				text: match[0],
				hit: true
			});
			last = start + match[0].length;
		}
		if (last < text.length) parts.push({
			text: text.slice(last),
			hit: false
		});
		return parts.length > 0 ? parts : [{
			text,
			hit: false
		}];
	} catch {
		return [{
			text,
			hit: false
		}];
	}
}
function tokens(line) {
	return (line.toLowerCase().match(/[a-z']+/g) ?? []).map((word) => word.replace(/^'+|'+$/g, "")).filter(Boolean);
}
function syllablesInWord(word) {
	const cleaned = word.replace(/[^a-z]/g, "");
	if (!cleaned) return 1;
	const groups = cleaned.match(/[aeiouy]+/g);
	let count = groups ? groups.length : 1;
	if (cleaned.endsWith("e") && count > 1 && !cleaned.endsWith("le")) count -= 1;
	return Math.max(1, count);
}
var DEVANAGARI = /[\u0900-\u097F]/;
/**
* Devanagari syllable heuristic: consonant clusters (consonants minus viramas,
* each with its matra) plus independent vowels. A guess — never a transcription.
*/
function devanagariSyllables(text) {
	const consonants = (text.match(/[\u0915-\u0939\u0958-\u095F\u0978-\u097F]/gu) ?? []).length;
	const viramas = (text.match(/\u094D/gu) ?? []).length;
	const independentVowels = (text.match(/[\u0904-\u0909\u090B-\u0914\u0960-\u0961]/gu) ?? []).length;
	const clusters = Math.max(0, consonants - viramas);
	return Math.max(1, clusters + independentVowels);
}
function estimateSyllables(line) {
	const latinWords = line.toLowerCase().match(/[a-z']+/g);
	const latinCount = latinWords?.length ? latinWords.reduce((total, word) => total + syllablesInWord(word), 0) : 0;
	const devanagariCount = DEVANAGARI.test(line) ? devanagariSyllables(line) : 0;
	if (latinCount === 0 && devanagariCount === 0) return null;
	return latinCount + devanagariCount;
}
function endWordOf(line) {
	const words = line.match(/[\p{L}\p{M}'’]+/gu);
	if (!words || words.length === 0) return null;
	return words[words.length - 1] ?? null;
}
function endKeyOf(word) {
	if (!word) return null;
	const latin = word.toLowerCase().replace(/[^a-z]/g, "");
	if (latin.length < 4) return null;
	return latin.slice(-3);
}
function internalWords(line) {
	const words = tokens(line).filter((word) => word.length >= 4);
	const buckets = /* @__PURE__ */ new Map();
	for (const word of words) {
		const key = word.slice(-3);
		const list = buckets.get(key) ?? [];
		if (!list.includes(word)) list.push(word);
		buckets.set(key, list);
	}
	const hits = [];
	for (const list of buckets.values()) if (new Set(list).size >= 2) hits.push(...list);
	return hits;
}
function duplicatedInLine(line) {
	const counts = /* @__PURE__ */ new Map();
	for (const word of tokens(line)) {
		if (word.length < 3 || STOP.has(word)) continue;
		counts.set(word, (counts.get(word) ?? 0) + 1);
	}
	return [...counts.entries()].filter(([, count]) => count >= 2).map(([word]) => word);
}
function pauseNote(line) {
	if (/[—–]|\.\.\.|…|[,;:]/.test(line)) return "Punctuation suggests a phrase break. This is not a measured pause or breath.";
	return null;
}
function syllableBasis(line, language, count) {
	if (count == null) return "No letters to estimate. Syllable count is unavailable for this line.";
	if (DEVANAGARI.test(line)) return "Devanagari cluster/matra heuristic mixed with English vowel groups where Latin letters appear. Not verified against pronunciation.";
	if (language === "English") return "English vowel-group estimate. Not a transcription of how the line is rapped.";
	return "English vowel-group estimate. Pronunciation in this language was not verified.";
}
function linesMatch(left, right) {
	if (left.length !== right.length) return false;
	return left.every((line, index) => line === right[index]);
}
/** A, B, … Z, AA, AB … for rhyme-group letters. */
function letterFor(index) {
	let n = index;
	let out = "";
	do {
		out = String.fromCharCode(65 + n % 26) + out;
		n = Math.floor(n / 26) - 1;
	} while (n >= 0);
	return out;
}
var SECTION_MARKER = /^[([]?\s*(intro|outro|bridge|chorus|pre[- ]?hook|hook|break|verse\b[^)\]]*|end\b[^)\]]*)[\])]?\s*[:.\-–—]?\s*$/i;
function sectionTypeOf(marker) {
	const lower = marker.toLowerCase();
	if (lower.startsWith("intro")) return {
		type: "intro",
		label: "Intro"
	};
	if (lower.startsWith("outro") || lower.startsWith("end")) return {
		type: "outro",
		label: "Outro"
	};
	if (lower.startsWith("bridge") || lower.startsWith("break")) return {
		type: "bridge",
		label: "Bridge"
	};
	if (lower.startsWith("chorus") || lower.includes("hook")) return {
		type: "hook",
		label: /pre/.test(lower) ? "Pre-hook" : "Hook"
	};
	const num = lower.match(/\d+/)?.[0];
	return {
		type: "verse",
		label: num ? `Verse ${num}` : "Verse"
	};
}
/**
* Section detection, in evidence order:
* 1. `basis "marker"`  — [Hook] / "Verse 2:" style lines (text estimate).
* 2. `basis "repetition"` — a block of 1–4 lines repeated verbatim (assumed hook).
* 3. `basis "assumed"` — 4-line stanzas labeled Verse 1, 2, … .
* Marker lines themselves are excluded from section content ranges.
*/
function detectStructure(lines) {
	const markerAt = [];
	lines.forEach((line, index) => {
		const match = line.match(SECTION_MARKER);
		if (match?.[1]) markerAt.push({
			index,
			...sectionTypeOf(match[1])
		});
	});
	if (markerAt.length > 0) {
		const sections = [];
		if (markerAt[0].index > 0) sections.push({
			type: "intro",
			label: "Intro",
			startIndex: 0,
			endIndex: markerAt[0].index - 1,
			note: "Lines before the first section marker (assumed intro, text estimate).",
			source: "text"
		});
		markerAt.forEach((marker, i) => {
			const next = i + 1 < markerAt.length ? markerAt[i + 1].index : lines.length;
			const start = marker.index + 1;
			const end = next - 1;
			if (start > end) return;
			sections.push({
				type: marker.type,
				label: marker.label,
				startIndex: start,
				endIndex: end,
				note: `Section marked “${lines[marker.index]}” (text estimate from section markers).`,
				source: "text"
			});
		});
		return {
			sections,
			basis: "marker"
		};
	}
	const repeated = findRepeatedBlock(lines);
	if (repeated) {
		const { start, length, occurrences } = repeated;
		const sections = [];
		let cursor = 0;
		let verse = 1;
		for (let hit = start; hit < lines.length; hit += length) {
			if (hit > cursor) sections.push({
				type: "verse",
				label: `Verse ${verse++}`,
				startIndex: cursor,
				endIndex: hit - 1,
				note: "Lines between repeated blocks (assumed).",
				source: "text"
			});
			sections.push({
				type: "hook",
				label: "Hook",
				startIndex: hit,
				endIndex: hit + length - 1,
				note: `Block repeated ${occurrences}× verbatim — assumed hook (text estimate).`,
				source: "text"
			});
			cursor = hit + length;
		}
		if (cursor < lines.length) sections.push({
			type: "verse",
			label: `Verse ${verse}`,
			startIndex: cursor,
			endIndex: lines.length - 1,
			note: "Lines after the last repeated block (assumed).",
			source: "text"
		});
		return {
			sections,
			basis: "repetition"
		};
	}
	const sections = [];
	for (let start = 0; start < lines.length; start += 4) {
		const end = Math.min(start + 3, lines.length - 1);
		sections.push({
			type: "verse",
			label: `Verse ${sections.length + 1}`,
			startIndex: start,
			endIndex: end,
			note: "No markers or repeats found — lines grouped into 4-line stanzas (assumed).",
			source: "text"
		});
	}
	return {
		sections,
		basis: "assumed"
	};
}
function findRepeatedBlock(lines) {
	for (let length = 4; length >= 1; length--) for (let start = 0; start + length <= lines.length; start++) {
		const block = lines.slice(start, start + length);
		if (block.some((line) => tokens(line).length < 3)) continue;
		let occurrences = 0;
		for (let at = start; at + length <= lines.length; at++) if (lines.slice(at, at + length).every((line, i) => line === block[i])) occurrences++;
		if (occurrences >= 3) return {
			start,
			length,
			occurrences
		};
	}
	return null;
}
/** Dominant end-rhyme pattern over one section's letter sequence (text estimate). */
function patternLabel(sequence) {
	const letters = sequence.filter((entry) => entry !== "·");
	if (letters.length < 2) return "free";
	const unique = new Set(letters);
	if (sequence.length === 4 && unique.size === 2) {
		const [a, b, c, d] = sequence;
		if (a === b && c === d && a !== c) return "AABB";
		if (a === c && b === d && a !== b) return "ABAB";
		if (b === d && a !== b && c !== b) return "ABCB";
		return "free";
	}
	let coupletPairs = 0;
	let alternateHits = 0;
	for (let i = 0; i + 1 < sequence.length; i += 2) if (sequence[i] !== "·" && sequence[i] === sequence[i + 1]) coupletPairs++;
	const pairs = Math.floor(sequence.length / 2);
	for (let i = 0; i + 3 < sequence.length; i++) if (sequence[i] !== "·" && sequence[i] === sequence[i + 2] && sequence[i + 1] === sequence[i + 3]) alternateHits++;
	if (pairs >= 2 && coupletPairs === pairs) return "AABB";
	if (alternateHits >= 2) return "ABAB";
	return "free";
}
function analyzeText(lyrics, language) {
	const rawLines = splitBars(lyrics);
	const presence = /* @__PURE__ */ new Map();
	rawLines.forEach((line, index) => {
		const seen = new Set(tokens(line).filter((word) => word.length > 2 && !STOP.has(word)));
		for (const word of seen) {
			const bars = presence.get(word) ?? [];
			bars.push(index);
			presence.set(word, bars);
		}
	});
	const repetition = [...presence.entries()].filter(([, bars]) => bars.length >= 2).map(([word, barIndexes]) => ({
		word,
		barIndexes
	}));
	const lines = rawLines.map((text, index) => {
		const syllables = estimateSyllables(text);
		const endWord = endWordOf(text);
		const intra = duplicatedInLine(text);
		const cross = repetition.filter((hit) => hit.barIndexes.includes(index)).map((hit) => hit.word);
		return {
			index,
			text,
			syllables,
			syllableBasis: syllableBasis(text, language, syllables),
			endWord,
			endKey: endKeyOf(endWord),
			internalWords: internalWords(text),
			pauseNote: pauseNote(text),
			repeats: [.../* @__PURE__ */ new Set([...intra, ...cross])]
		};
	});
	const endBuckets = /* @__PURE__ */ new Map();
	for (const line of lines) {
		if (!line.endKey || !line.endWord) continue;
		const members = endBuckets.get(line.endKey) ?? [];
		members.push({
			barIndex: line.index,
			word: line.endWord
		});
		endBuckets.set(line.endKey, members);
	}
	const endGroups = [...endBuckets.entries()].filter(([, members]) => members.length >= 2).map(([key, members]) => ({
		id: `end-${key}`,
		type: "end",
		letter: "",
		key,
		multisyllabic: sharesFiveLetterEnding(members),
		members,
		explanation: `These line endings share the last three Latin letters “${key}”. That is a spelling match, not a verified rhyme or pronunciation.${sharesFiveLetterEnding(members) ? " Two or more also share five letters — an approximate multisyllabic match, still spelling-level." : ""}`
	})).sort((a, b) => (a.members[0]?.barIndex ?? 0) - (b.members[0]?.barIndex ?? 0));
	endGroups.forEach((group, index) => {
		group.letter = letterFor(index);
	});
	const internalGroups = lines.filter((line) => line.internalWords.length >= 2).map((line) => ({
		id: `internal-${line.index}`,
		type: "internal",
		letter: "",
		key: line.internalWords.join(" / "),
		multisyllabic: false,
		members: line.internalWords.map((word) => ({
			barIndex: line.index,
			word
		})),
		explanation: `Inside bar ${line.index + 1}, these words share an ending spelling. Pronunciation was not checked.`
	}));
	internalGroups.forEach((group, index) => {
		group.letter = letterFor(endGroups.length + index);
	});
	const structure = detectStructure(rawLines);
	const lineLetter = /* @__PURE__ */ new Map();
	for (const group of endGroups) for (const member of group.members) lineLetter.set(member.barIndex, group.letter);
	const patterns = structure.sections.filter((section) => section.endIndex > section.startIndex).map((section) => {
		const sequence = [];
		for (let index = section.startIndex; index <= section.endIndex; index++) {
			if (!lines[index]?.endKey) continue;
			sequence.push(lineLetter.get(index) ?? "·");
		}
		return {
			label: patternLabel(sequence),
			start: section.startIndex,
			end: section.endIndex,
			sequence: sequence.join(" ")
		};
	});
	const observations = flowObservations(lines);
	observations.push(structure.basis === "marker" ? "Sections detected from written markers like [Hook] or Verse 2 — a text estimate, not audio." : structure.basis === "repetition" ? "A repeated block was detected and labeled Hook (assumed) — the text alone cannot confirm it sings as a hook." : "No markers or repeats found — lines were grouped into 4-line stanzas (assumed).");
	return {
		lines,
		endGroups,
		internalGroups,
		structure: structure.sections,
		patterns,
		repetition,
		observations,
		disclaimer: "This pass only counts what is written: line breaks, spelling, punctuation, and rough syllable estimates. It does not hear flow, confirm rhyme, or decide meaning."
	};
}
function sharesFiveLetterEnding(members) {
	const counts = /* @__PURE__ */ new Map();
	for (const member of members) {
		const latin = member.word.toLowerCase().replace(/[^a-z]/g, "");
		if (latin.length < 5) continue;
		const key = latin.slice(-5);
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}
	return [...counts.values()].some((count) => count >= 2);
}
function flowObservations(lines) {
	const notes = [];
	const counted = lines.map((line) => line.syllables).filter((value) => value != null);
	if (counted.length === 0) {
		notes.push("Syllable density is unavailable because these lines have no Latin-script words to estimate.");
		return notes;
	}
	const total = counted.reduce((sum, value) => sum + value, 0);
	const average = total / counted.length;
	const min = Math.min(...counted);
	const max = Math.max(...counted);
	notes.push(`About ${average.toFixed(1)} estimated syllables per counted line (${total} across ${counted.length} line${counted.length === 1 ? "" : "s"}).`);
	if (max - min >= 4) notes.push("Line length swings by four or more estimated syllables. That can leave room for a cadence change, but only audio can show whether the delivery actually changes.");
	else notes.push("Estimated line lengths stay relatively even. Even length is not the same thing as a steady flow.");
	const pauses = lines.filter((line) => line.pauseNote).length;
	if (pauses > 0) notes.push(`${pauses} line${pauses === 1 ? "" : "s"} use punctuation that often marks a phrase break. No breath was timed.`);
	return notes;
}
function syllableSummary(estimate) {
	const values = estimate.lines.map((line) => line.syllables).filter((value) => value != null);
	if (values.length === 0) return null;
	const total = values.reduce((sum, value) => sum + value, 0);
	return {
		total,
		counted: values.length,
		average: total / values.length
	};
}
function isModelStale(sourceLines, lyrics) {
	if (!sourceLines) return false;
	return !linesMatch(sourceLines, splitBars(lyrics));
}
//#endregion
export { wordInLine as _, MODULES as a, SECTION_TYPES as c, countWords as d, isModelStale as f, syllableSummary as g, splitHighlight as h, MAX_LYRICS as i, TAG_KINDS as l, splitBars as m, EVIDENCE_LABEL as n, SCORE_DIMENSIONS as o, letterFor as p, LANGUAGES as r, SCORE_LABEL as s, ANALYSIS_VIEWS as t, analyzeText as u };
