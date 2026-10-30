import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  analyzeText,
  detectStructure,
  estimateSyllables,
  letterFor,
  splitBars,
  splitHighlight,
  wordInLine,
} from "./text-analysis.ts";
import { validateLyrics, validateUrl } from "./validation.ts";

describe("text analysis", () => {
  it("drops blank lines and estimates English syllables", () => {
    const lines = splitBars("One two\n\nConcrete streets\n");
    assert.deepEqual(lines, ["One two", "Concrete streets"]);
    assert.equal(estimateSyllables("Concrete streets"), 3);
  });

  it("estimates Devanagari syllables with a cluster heuristic", () => {
    assert.equal(estimateSyllables("नमस्ते"), 3);
    assert.equal(estimateSyllables("???"), null);
  });

  it("groups shared Latin endings without calling them verified rhymes", () => {
    const estimate = analyzeText(
      "Same city, new dreams, different season\nStill the same kid, just a bigger reason",
      "English",
    );
    assert.equal(estimate.endGroups.length, 1);
    assert.match(estimate.endGroups[0]?.explanation ?? "", /spelling match/i);
    assert.equal(estimate.lines[0]?.repeats.includes("same"), true);
    assert.equal(estimate.endGroups[0]?.letter, "A");
  });

  it("assigns letters by first appearance and flags five-letter matches", () => {
    const estimate = analyzeText(
      "I walk through the city, dreams in my pocket\nNo map, just a vision, I'm on it\nThey chase the season, I chase the reason\nEvery line a lesson, every step a treason",
      "English",
    );
    const letters = estimate.endGroups.map((group) => group.letter);
    assert.deepEqual(letters, [...letters].sort());
    assert.equal(letters.length, 1);
    assert.equal(estimate.endGroups[0]?.letter, "A");
    assert.equal(estimate.endGroups[0]?.multisyllabic, true);
  });

  it("detects marker, repetition, and assumed structure", () => {
    const marked = detectStructure(["[Intro]", "line one", "[Hook]", "hook a", "hook b", "[Outro]", "bye"]);
    assert.equal(marked.basis, "marker");
    assert.deepEqual(marked.sections.map((section) => section.type), ["intro", "hook", "outro"]);

    const repeated = detectStructure(
      Array.from({ length: 12 }, (_, i) => (i % 4 === 0 ? "every step a lesson I keep it real" : `filler line number ${i}`)),
    );
    assert.equal(repeated.basis, "repetition");

    const assumed = detectStructure(["one bar here now", "two bar here now", "three bar right now", "four bar right now"]);
    assert.equal(assumed.basis, "assumed");
    assert.equal(assumed.sections.length, 1);
  });

  it("labels stanza rhyme patterns", () => {
    const estimate = analyzeText(
      [
        "They chase the season, I chase the reason",
        "Every line a lesson, every step a treason",
        "From the struggle to the stage, it's a mission",
        "Same city, new dreams, hold the same vision",
      ].join("\n"),
      "English",
    );
    assert.equal(estimate.patterns.length, 1);
    assert.equal(estimate.patterns[0]?.label, "AABB");
    assert.equal(estimate.patterns[0]?.sequence, "A A B B");
    assert.match(disclaimerOf(estimate), /does not hear flow/i);
  });

  it("maps letters up to Z then AA", () => {
    assert.equal(letterFor(0), "A");
    assert.equal(letterFor(25), "Z");
    assert.equal(letterFor(26), "AA");
  });

  it("highlights whole words only", () => {
    const parts = splitHighlight("mind's in the skyline and the sky", ["sky"]);
    assert.equal(parts.filter((part) => part.hit).map((part) => part.text).join(" "), "sky");
    assert.equal(wordInLine("sky", "mind's in the sky"), true);
    assert.equal(wordInLine("sky", "skyline"), false);
  });

  it("validates lyrics and links", () => {
    assert.match(validateLyrics("   ") ?? "", /at least one line/i);
    assert.equal(validateLyrics("A single bar"), null);
    assert.equal(validateUrl(""), null);
    assert.match(validateUrl("notaurl") ?? "", /not a valid URL/i);
    assert.equal(validateUrl("https://genius.com/search?q=demo"), null);
  });
});

function disclaimerOf(estimate: ReturnType<typeof analyzeText>): string {
  return estimate.disclaimer;
}
