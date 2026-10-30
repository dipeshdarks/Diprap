import type { ModelAnalysis } from "@/types/analysis";

export const DEMO_LYRICS = `I walk through the city, dreams in my pocket
Concrete streets, but my mind's in the sky
Every step a lesson, I keep it real
From the struggle to the stage, it's a journey
Same soul, different chapter, still the same me
They see the hustle, but they don't know the pain
Behind the smile, there's a story in the rain
I'm not just chasing money, I'm chasing freedom
A better tomorrow, that's the mission
Same city, new dreams, different season
Still the same kid, just a bigger reason
No map, just a vision, I'm on it`;

/**
 * Saved sample reading for the Street Dreams demo — written by hand as an
 * example of the model's output shape, NOT a live model call. The UI labels
 * it as a bundled sample so nothing here can be mistaken for fresh analysis.
 */
export const DEMO_MODEL_READING: ModelAnalysis = {
  generatedAt: "2026-01-01T00:00:00.000Z",
  model: "bundled sample reading",
  disclaimer:
    "Saved sample reading bundled with the lab demo — not a live model call. It is still an interpretation of the demo text, not a fact, not a phonetic transcription, and not a measurement of a performance.",
  overallMeaning:
    "A short motivational verse about carrying ambition through ordinary city life: keep walking, keep the same self while the chapters change, and trade the chase for money into the chase for freedom.",
  story: {
    centralMessage:
      "Ambition survives inside everyday city life — growth changes the reasons, not the person.",
    narrativeArc:
      "Opens with an image of carrying dreams in a pocket, builds through struggle and the gap between public hustle and private pain, pivots from money to freedom, and closes by circling back to the same kid with a bigger reason — a loop rather than a ladder.",
    atmosphere: "Late-night city confidence: guarded, tired, but hopeful.",
    perspective:
      "First-person narrator who presents themselves as unchanged by success — reflective rather than braggadocious.",
    languageNotes:
      "English with mainstream hip-hop idiom ('keep it real', 'the hustle', 'the mission'). No code-switching present, so no translation questions arise.",
    slangAndReferences: [
      {
        id: "demo-slang-1",
        title: "Keep it real",
        explanation:
          "Standard hip-hop phrase for staying authentic under pressure. Here it anchors the narrator's personal code rather than a crew or scene.",
        evidenceType: "unverified",
      },
      {
        id: "demo-slang-2",
        title: "The hustle",
        explanation:
          "Ambitious work, often borderline or exhausting effort. The line flips it: the hustle is visible, the cost behind it is not.",
        evidenceType: "unverified",
      },
      {
        id: "demo-slang-3",
        title: "New dreams, different season",
        explanation:
          "'Season' treats time like weather — circumstances change around a fixed place ('same city') and a fixed person ('still the same kid').",
        evidenceType: "interpretive",
      },
    ],
  },
  structure: [
    {
      type: "intro",
      label: "Opening image",
      startIndex: 0,
      endIndex: 1,
      note: "No markers in the text — inferred from the scene-setting first two lines (model reading).",
      source: "model",
    },
    {
      type: "verse",
      label: "Verse 1",
      startIndex: 2,
      endIndex: 7,
      note: "Narrative build: code, identity, hidden struggle, values pivot (inferred — no markers present).",
      source: "model",
    },
    {
      type: "outro",
      label: "Closing",
      startIndex: 8,
      endIndex: 11,
      note: "Slogan lines and couplet resolution close the piece (inferred — no markers present).",
      source: "model",
    },
  ],
  flowMap: [
    {
      section: "Opening image",
      flowStyle: "Conversational open — full-line statements with space between them (inferred from line shape; not heard).",
      rhythm: "Even, walking-pace phrasing; no punctuation breaks to interrupt the first two lines.",
      rhymeTechnique: "Ends set up later payoffs loosely ('pocket', 'sky'); no exact partner lands here.",
      effect: "Grounds the listener in place before any theme is stated.",
    },
    {
      section: "Verse 1",
      flowStyle: "Density rises through the middle; the longest lines (money/freedom) suggest a double-time lean — a guess from line length only.",
      rhythm: "Punctuation arrives mid-section (lines 5–6), implying phrase breaks the delivery would have to breathe around.",
      rhymeTechnique: "The first exact couplet lands here (pain / rain), then identity talk stays mostly unrhymed until the close.",
      effect: "Momentum builds toward the values pivot at 'chasing freedom'.",
    },
    {
      section: "Closing",
      flowStyle: "Shorter slogan lines, then a clipped three-beat fragment to end — usually read as a hard stop.",
      rhythm: "Line 8 reads like a stamped statement; line 11's fragments ('No map / just a vision / I'm on it') invite staccato placement (inferred).",
      rhymeTechnique: "Season / reason couplet carries the section; 'mission' has no exact partner.",
      effect: "Converts momentum into a quotable exit line.",
    },
  ],
  scorecard: [
    {
      dimension: "storytelling",
      score: 6,
      evidence:
        "There is a clear arc — image, struggle, pivot, resolve — but it moves through abstractions rather than scenes; no names, places, or incidents appear anywhere in the twelve lines.",
    },
    {
      dimension: "wordplay",
      score: 6,
      evidence:
        "'Dreams in my pocket' makes an abstraction portable, and 'not just chasing money, I'm chasing freedom' is a clean reframe punchline — but there are few true double entendres.",
    },
    {
      dimension: "rhyme_complexity",
      score: 5,
      evidence:
        "Two exact spelling couples (pain/rain, season/reason) and one slant pair (journey/money) across twelve lines; little internal or multisyllabic work is attempted.",
    },
    {
      dimension: "flow_cadence",
      score: 6,
      evidence:
        "Line lengths swing from the long money/freedom line to the clipped closer, which usually implies cadence changes — scored from text shape only, since no audio exists.",
    },
    {
      dimension: "technical_delivery",
      score: 6,
      evidence:
        "Deliberate phrasing shows in the bookended 'same…same' construction and the three-fragment closer; no dense multisyllabic display is attempted.",
    },
    {
      dimension: "emotional_impact",
      score: 6,
      evidence:
        "The smile/rain contrast and the money/freedom pivot land; the lack of concrete detail keeps the verse from hitting harder.",
    },
    {
      dimension: "beat_synergy",
      score: 5,
      evidence:
        "No beat or audio was supplied — this scores only how well internal phrase lengths fit together, not a heard performance.",
    },
    {
      dimension: "overall_songwriting",
      score: 6,
      evidence:
        "Coherent, quotable, honestly crafted — memorable closing lines, but generic imagery keeps it safe.",
    },
  ],
  strongestMoments: [
    {
      barIndex: 7,
      moment: "I'm not just chasing money, I'm chasing freedom",
      why: "The repetition of 'chasing' swaps the object instead of stopping the verb — a one-line redefinition of success.",
    },
    {
      barIndex: 6,
      moment: "Behind the smile, there's a story in the rain",
      why: "Pairs an exact rhyme with the previous line while carrying the hidden-struggle theme in a single image.",
    },
    {
      barIndex: 11,
      moment: "No map, just a vision, I'm on it",
      why: "Fragmented closer mirrors line 1's pocket-sized dream and converts the whole verse into momentum.",
    },
  ],
  weaknesses: [
    {
      observation: "Universal nouns do the work that specific details should.",
      evidence:
        "Lines 0–11 stay on city / streets / stage / season without a single name, place, or incident — the imagery is generic motivational.",
    },
    {
      observation: "The first half leans thin on rhyme.",
      evidence:
        "The text pass finds no exact end-spelling group across lines 0–4; the first exact couplet only arrives at lines 5–6.",
    },
  ],
  themes: [
    {
      id: "demo-theme-1",
      title: "Identity through change",
      explanation:
        "'Same soul… still the same me' and 'still the same kid' bookend the verse — growth is allowed, replacement is not.",
      evidenceType: "interpretive",
    },
    {
      id: "demo-theme-2",
      title: "Ambition as a daily practice",
      explanation:
        "Dreams are carried, steps are lessons, tomorrow is a mission — ambition is framed as routine, not event.",
      evidenceType: "interpretive",
    },
    {
      id: "demo-theme-3",
      title: "Visible hustle vs invisible cost",
      explanation:
        "What 'they see' and what 'they don't know' split the narrator in two; the smile/rain couplet holds both halves.",
      evidenceType: "interpretive",
    },
  ],
  metaphors: [
    {
      id: "demo-meta-1",
      title: "Dreams as something you carry",
      explanation:
        "'Dreams in my pocket' treats an abstraction as a small physical possession — ambition is portable and private.",
      evidenceType: "interpretive",
    },
    {
      id: "demo-meta-2",
      title: "Rain as hardship",
      explanation:
        "'A story in the rain' puts the hidden backstory inside weather — trouble that falls on everyone but reads differently per person.",
      evidenceType: "interpretive",
    },
    {
      id: "demo-meta-3",
      title: "Season as passing circumstance",
      explanation:
        "'Different season' frames change as weather around a fixed place — the city and the kid stay, conditions turn.",
      evidenceType: "interpretive",
    },
  ],
  doubleMeanings: [
    {
      id: "demo-double-1",
      title: "Chasing money / chasing freedom",
      explanation:
        "The same verb keeps its energy while the object changes — 'chasing' can be emptiness or purpose depending on the noun that follows it.",
      evidenceType: "interpretive",
    },
    {
      id: "demo-double-2",
      title: "Still the same me / just a bigger reason",
      explanation:
        "'Same' claims continuity while 'bigger' admits change — the narrator is unchanged in character but not in justification.",
      evidenceType: "interpretive",
    },
  ],
  punchlines: [
    {
      id: "demo-punch-1",
      title: "Not just money — freedom",
      explanation:
        "'Not just X, I'm Y' is a classic reframe shape; the punch lands because 'chasing' is admitted, only the target is upgraded.",
      evidenceType: "interpretive",
    },
    {
      id: "demo-punch-2",
      title: "No map, just a vision",
      explanation:
        "The closer rejects planning vocabulary ('map') in favor of instinct ('vision') in seven words — compact and quotable.",
      evidenceType: "interpretive",
    },
  ],
  culturalReferences: [
    {
      id: "demo-cult-1",
      title: "Hustle-culture vocabulary",
      explanation:
        "'Hustle', 'the mission', 'keep it real' come from mainstream hip-hop idiom used generically — no specific scene, city, or crew is claimed (unverified).",
      evidenceType: "unverified",
    },
  ],
  alternativeInterpretations: [
    {
      id: "demo-alt-1",
      title: "Generic motivational register",
      explanation:
        "Read unsympathetically, the verse could be stock self-help in rap clothing — its lack of specifics cuts both ways: universal or vague.",
      evidenceType: "interpretive",
    },
  ],
  limitations:
    "Only the twelve pasted lines were read. No beat, audio, artist context, or outside references were available; delivery questions stay unanswered.",
  bars: [
    {
      index: 0,
      meaning:
        "Sets the scene: the narrator moves through the city while carrying ambitions ('dreams') as something portable and personal.",
      alternative:
        "Could be read literally — pockets holding plans or money — but the dream reading fits the lines that follow.",
      wordplay: ["'Dreams in my pocket' turns an abstraction into a physical possession."],
      metaphors: ["Dreams as something you carry."],
      rhymeMechanics:
        "Ends on 'pocket'. The text pass finds no exact partner — any sound match would need audio to judge.",
      narrativeFunction: "Opening image; establishes place and want in one line.",
      confidence: "high",
      uncertainty: "'Pocket' has no exact spelling partner in these lines.",
      tags: [
        { label: "Metaphor", kind: "metaphor" },
        { label: "Theme", kind: "theme" },
      ],
    },
    {
      index: 1,
      meaning:
        "Contrasts hard physical reality with mental altitude — dreaming while staying present in the environment.",
      alternative: null,
      wordplay: ["Ground ('concrete streets') against sky ('mind's in the sky') — a spatial opposition."],
      metaphors: ["Sky as limit-free mental space."],
      rhymeMechanics:
        "No end-rhyme partner ('sky' is too short to key on). The line leans on the internal ground/sky opposition instead — that opposition is an interpretation, not a verified internal rhyme.",
      narrativeFunction: "Raises the stakes from scene to mindset.",
      confidence: "high",
      uncertainty: "Calling the ground/sky contrast an internal rhyme is a stylistic judgment.",
      tags: [
        { label: "Wordplay", kind: "wordplay" },
        { label: "Internal Rhyme", kind: "internal_rhyme" },
      ],
    },
    {
      index: 2,
      meaning: "Frames experience as curriculum; 'keep it real' asserts authenticity as the rule of the road.",
      alternative: null,
      wordplay: ["'Step…lesson' links walking to learning — extended by 'journey' two lines later."],
      metaphors: [],
      rhymeMechanics:
        "Ends 'real' with no exact partner here. The strength is the step/lesson linkage inside the line.",
      narrativeFunction: "States the personal code the rest of the verse will test.",
      confidence: "high",
        uncertainty: "The step/lesson link is thematic rather than phonetic — no rhyme is claimed.",
      tags: [{ label: "Theme", kind: "theme" }],
    },
    {
      index: 3,
      meaning: "Compresses an entire career arc into one line: hardship becomes performance.",
      alternative: null,
      wordplay: ["'Struggle to the stage' — hardship and showcase share one path."],
      metaphors: ["Stage as arrival point of the street-level journey."],
      rhymeMechanics:
        "Ends 'journey'; only a slant pairing with 'money' later in the verse holds (approximate, not spelling-verified).",
      narrativeFunction: "Compresses time and introduces the journey motif.",
      confidence: "medium",
      uncertainty: "The journey/money sound match is approximate and would need audio to confirm.",
      tags: [
        { label: "Slant Rhyme", kind: "slant" },
        { label: "Theme", kind: "theme" },
      ],
    },
    {
      index: 4,
      meaning: "Identity persists through change — the chapter turns, the self doesn't.",
      alternative: null,
      wordplay: ["'Same…same' bookends with 'different' pivoting between them."],
      metaphors: [],
      rhymeMechanics:
        "Ends on the short 'me' — no spelling group. The construction is rhetorical repetition, not rhyme.",
      narrativeFunction: "Theme statement: continuity of self.",
      confidence: "high",
        uncertainty: "'me' is too short to rhyme on — the repetition here is rhetorical.",
      tags: [{ label: "Repetition", kind: "repetition" }],
    },
    {
      index: 5,
      meaning: "Public effort is visible; private cost isn't — the narrator is split into show and truth.",
      alternative: null,
      wordplay: ["'See' against 'know' sets up the visible/invisible split that line 6 completes."],
      metaphors: [],
      rhymeMechanics:
        "Ends 'pain', matching 'rain' in the next line — an exact three-letter spelling match the text pass also finds.",
      narrativeFunction: "Turns outward — how the narrator is perceived.",
      confidence: "high",
        uncertainty: "Spelling-exact couplet; pronunciation remains unverified.",
      tags: [
        { label: "End Rhyme", kind: "end_rhyme" },
        { label: "Theme", kind: "theme" },
      ],
    },
    {
      index: 6,
      meaning: "Suggests a hidden backstory under a composed exterior; 'rain' carries the hardship.",
      alternative: null,
      wordplay: [],
      metaphors: ["Rain as adversity falling behind the smile."],
      rhymeMechanics:
        "Ends 'rain', rhyming with 'pain' (line 5) — the couplet anchors the verse's emotional low point.",
      narrativeFunction: "Deepens the hidden-struggle thread started one line earlier.",
      confidence: "high",
        uncertainty: "Exact spelling match — hearing how it lands would require audio.",
      tags: [
        { label: "End Rhyme", kind: "end_rhyme" },
        { label: "Metaphor", kind: "metaphor" },
      ],
    },
    {
      index: 7,
      meaning: "Redefines success: the chase continues, but the target changed from money to freedom.",
      alternative: null,
      wordplay: [
        "Repeated 'chasing' with swapped objects — money out, freedom in.",
        "'Not just X, I'm Y' is a classic reframe punchline shape.",
      ],
      metaphors: ["Freedom as the currency worth chasing."],
      rhymeMechanics:
        "Ends 'freedom' with no exact partner ('mission' is only a slant at best). The line's force is structural, not phonetic.",
      narrativeFunction: "The values pivot — the verse's argument in one line.",
      confidence: "high",
        uncertainty: "Any slant match to 'mission' is weak; the line works structurally.",
      tags: [
        { label: "Wordplay", kind: "wordplay" },
        { label: "Theme", kind: "theme" },
      ],
    },
    {
      index: 8,
      meaning: "Names the goal in mission language — future-oriented resolve stated like an order.",
      alternative: null,
      wordplay: ["'Mission' doubles as personal mission statement."],
      metaphors: [],
      rhymeMechanics:
        "Ends 'mission' — no exact partner ('season' shares only 'on' ending, too short to key).",
      narrativeFunction: "Compresses the goal into a slogan line.",
      confidence: "medium",
      uncertainty: "The line reads as slogan rather than rhyme setup; intent is unverifiable from text.",
      tags: [{ label: "Theme", kind: "theme" }],
    },
    {
      index: 9,
      meaning: "Same place, changed circumstances — growth framed as weather around a fixed home.",
      alternative: null,
      wordplay: ["'Same…new…different' — controlled contrast in three words."],
      metaphors: ["Season as passing time."],
      rhymeMechanics:
        "Ends 'season', rhyming with 'reason' (line 10) — exact three-letter match with a five-letter overlap, which the text pass flags as approximate multisyllabic.",
      narrativeFunction: "Opens the closing couplet pair.",
      confidence: "high",
        uncertainty: "Five-letter overlap is approximate — not a verified multisyllabic rhyme.",
      tags: [
        { label: "End Rhyme", kind: "end_rhyme" },
        { label: "Multisyllabic", kind: "multisyllabic" },
      ],
    },
    {
      index: 10,
      meaning: "Identity again: same person, stronger justification — growth explains, not erases.",
      alternative: null,
      wordplay: ["'Season'/'reason' payoff; 'bigger reason' answers the why the verse circled."],
      metaphors: [],
      rhymeMechanics:
        "Ends 'reason', matching 'season' (line 9) — the verse's cleanest rhyme pair, anchored in the theme itself.",
      narrativeFunction: "Resolves the identity theme with the closing rhyme.",
      confidence: "high",
        uncertainty: "Spelling-exact; phonetic delivery unverified.",
      tags: [
        { label: "End Rhyme", kind: "end_rhyme" },
        { label: "Repetition", kind: "repetition" },
      ],
    },
    {
      index: 11,
      meaning: "No prescribed route, only intention — self-directed momentum as the closing stance.",
      alternative: null,
      wordplay: ["Fragmented closer: three short beats instead of one flowing sentence."],
      metaphors: ["Map as a prescribed plan; vision as instinct."],
      rhymeMechanics:
        "Ends on 'it' — too short for any spelling group. Whatever snap this line has would be a delivery question, unanswerable from text.",
      narrativeFunction: "Closer — returns to line 1's pocket-sized dream and acts on it.",
      confidence: "high",
      uncertainty: "Final-word rhyming is impossible here; cadence claims would need audio.",
      tags: [
        { label: "Cadence", kind: "cadence" },
        { label: "Wordplay", kind: "wordplay" },
      ],
    },
  ],
  rhymes: [
    {
      id: "demo-rhyme-1",
      type: "end",
      letter: "A",
      sound: "/eɪn/ (guess)",
      explanation:
        "Exact spelling couplet on the last word of lines 5 and 6 — the text pass finds the same three-letter match ('ain').",
      members: [
        { barIndex: 5, word: "pain", note: "ends line 5" },
        { barIndex: 6, word: "rain", note: "answers line 5" },
      ],
    },
    {
      id: "demo-rhyme-2",
      type: "multisyllabic",
      letter: "B",
      sound: "/iːzən/ (guess)",
      explanation:
        "Lines 9 and 10 share 'season'/'reason' — five-letter overlap, the approximate multisyllabic pair of the verse.",
      members: [
        { barIndex: 9, word: "season", note: "sets up the rhyme" },
        { barIndex: 10, word: "reason", note: "lands the rhyme" },
      ],
    },
    {
      id: "demo-rhyme-3",
      type: "slant",
      letter: "C",
      sound: "/ɜːrni/ vs /mʌni/ (guesses)",
      explanation:
        "'Journey' and 'money' share a stressed ending sound but not spelling — a slant pairing only, approximate.",
      members: [
        { barIndex: 3, word: "journey", note: "the arc" },
        { barIndex: 7, word: "money", note: "what is chased" },
      ],
    },
  ],
  flowNotes: [
    "Line lengths swing from the long money/freedom line to clipped closers — variance that usually signals cadence changes between lines.",
    "Punctuation mid-verse (lines 5–6) suggests phrase breaks a delivery would breathe around — not measured breaths.",
    "The final line's three fragments invite staccato placement after flowing sentences — an inference from text shape only.",
  ],
  cadenceNotes: [
    "No line carries more than about 15 estimated syllables — this reads as moderate density, not double-time.",
    "The closing fragment ('No map, just a vision, I'm on it') would function as a hard stop after longer lines.",
  ],
  sourceLines: DEMO_LYRICS.split("\n"),
};
