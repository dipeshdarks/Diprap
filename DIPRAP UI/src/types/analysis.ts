export const LANGUAGES = ["English", "Hindi", "Hinglish", "Other"] as const;
export type Language = (typeof LANGUAGES)[number];

export const MODULES = [
  {
    id: "meaning",
    label: "Meaning",
    detail: "Plain-language reading of each line",
  },
  {
    id: "wordplay",
    label: "Wordplay",
    detail: "Images, doubles, and punchlines",
  },
  {
    id: "rhyme",
    label: "Rhyme",
    detail: "End, internal, multi, and slant patterns",
  },
  {
    id: "narrative",
    label: "Narrative",
    detail: "What the line does in the piece",
  },
  {
    id: "flow",
    label: "Flow notes",
    detail: "Cadence comments from the text, not audio",
  },
  {
    id: "story",
    label: "Story & context",
    detail: "Narrative arc, slang, and cultural references",
  },
  {
    id: "scorecard",
    label: "Scorecard",
    detail: "Eight-dimension score with evidence",
  },
] as const;

export type ModuleId = (typeof MODULES)[number]["id"];

export const ANALYSIS_VIEWS = [
  "overview",
  "lyrics",
  "story",
  "bars",
  "rhymes",
  "flow",
  "production",
  "practice",
] as const;

export type AnalysisView = (typeof ANALYSIS_VIEWS)[number];

export type EvidenceType =
  | "user_provided"
  | "measured"
  | "model_estimated"
  | "interpretive"
  | "unverified"
  | "unavailable";

export type Confidence = "low" | "medium" | "high";

export const EVIDENCE_LABEL: Record<EvidenceType, string> = {
  user_provided: "User-provided text",
  measured: "Measured",
  model_estimated: "Model-estimated",
  interpretive: "Model interpretation",
  unverified: "Unverified context",
  unavailable: "Unavailable",
};

export interface AnalysisInsight {
  id: string;
  title: string;
  explanation: string;
  evidenceType: EvidenceType;
}

export const TAG_KINDS = [
  "end_rhyme",
  "internal_rhyme",
  "multisyllabic",
  "slant",
  "wordplay",
  "theme",
  "cadence",
  "metaphor",
  "repetition",
] as const;

export type TagKind = (typeof TAG_KINDS)[number];

export interface BarTag {
  label: string;
  kind: TagKind;
}

export const SECTION_TYPES = ["intro", "verse", "hook", "bridge", "outro"] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

/** A song section over bar indices (inclusive). `source` keeps the evidence trail. */
export interface SongSection {
  type: SectionType;
  label: string;
  startIndex: number;
  endIndex: number;
  note: string;
  source: "model" | "text";
}

export interface FlowMapEntry {
  section: string;
  flowStyle: string;
  rhythm: string;
  rhymeTechnique: string;
  effect: string;
}

export const SCORE_DIMENSIONS = [
  "storytelling",
  "wordplay",
  "rhyme_complexity",
  "flow_cadence",
  "technical_delivery",
  "emotional_impact",
  "beat_synergy",
  "overall_songwriting",
] as const;
export type ScoreDimension = (typeof SCORE_DIMENSIONS)[number];

export const SCORE_LABEL: Record<ScoreDimension, string> = {
  storytelling: "Storytelling",
  wordplay: "Wordplay",
  rhyme_complexity: "Rhyme complexity",
  flow_cadence: "Flow & cadence",
  technical_delivery: "Technical delivery",
  emotional_impact: "Emotional impact",
  beat_synergy: "Beat & vocal synergy",
  overall_songwriting: "Overall songwriting",
};

export interface ScoreEntry {
  dimension: ScoreDimension;
  /** 0–10, rounded. Critical opinion, not a measurement. */
  score: number;
  evidence: string;
}

export interface StrongestMoment {
  barIndex: number;
  moment: string;
  why: string;
}

export interface Weakness {
  observation: string;
  evidence: string;
}

export interface ModelStory {
  centralMessage: string;
  narrativeArc: string;
  atmosphere: string;
  perspective: string;
  slangAndReferences: AnalysisInsight[];
  languageNotes: string;
}

export interface ModelBar {
  index: number;
  meaning: string;
  alternative: string | null;
  wordplay: string[];
  metaphors: string[];
  rhymeMechanics: string;
  narrativeFunction: string;
  confidence: Confidence;
  uncertainty: string;
  tags: BarTag[];
}

export interface ModelRhymeMember {
  barIndex: number;
  word: string;
  note: string;
}

export interface ModelRhymeGroup {
  id: string;
  type: "end" | "internal" | "multisyllabic" | "slant";
  /** Letter label (A, B, C…) assigned by order of first appearance across groups. */
  letter: string;
  sound: string;
  explanation: string;
  members: ModelRhymeMember[];
}

export interface ModelAnalysis {
  generatedAt: string;
  model: string;
  disclaimer: string;
  overallMeaning: string;
  story: ModelStory | null;
  structure: SongSection[];
  flowMap: FlowMapEntry[];
  scorecard: ScoreEntry[];
  strongestMoments: StrongestMoment[];
  weaknesses: Weakness[];
  themes: AnalysisInsight[];
  metaphors: AnalysisInsight[];
  doubleMeanings: AnalysisInsight[];
  punchlines: AnalysisInsight[];
  culturalReferences: AnalysisInsight[];
  alternativeInterpretations: AnalysisInsight[];
  limitations: string;
  bars: ModelBar[];
  rhymes: ModelRhymeGroup[];
  flowNotes: string[];
  cadenceNotes: string[];
  sourceLines: string[];
}

export interface TextBar {
  index: number;
  text: string;
  syllables: number | null;
  syllableBasis: string;
  endWord: string | null;
  endKey: string | null;
  internalWords: string[];
  pauseNote: string | null;
  repeats: string[];
}

export interface TextRhymeGroup {
  id: string;
  type: "end" | "internal";
  /** Letter label (A, B, C…) assigned by order of first appearance across end groups. */
  letter: string;
  key: string;
  /** True when ≥2 members share the last 5 letters (approximate multisyllabic match). */
  multisyllabic: boolean;
  members: { barIndex: number; word: string }[];
  explanation: string;
}

/** Dominant end-rhyme pattern over a stanza of written lines (text estimate). */
export interface StanzaPattern {
  label: "AABB" | "ABAB" | "ABCB" | "free";
  start: number;
  end: number;
  sequence: string;
}

export interface RepetitionHit {
  word: string;
  barIndexes: number[];
}

export interface TextEstimate {
  lines: TextBar[];
  endGroups: TextRhymeGroup[];
  internalGroups: TextRhymeGroup[];
  structure: SongSection[];
  patterns: StanzaPattern[];
  repetition: RepetitionHit[];
  observations: string[];
  disclaimer: string;
}

export type AnalyzeCode = "unavailable" | "invalid" | "rate" | "upstream" | "format";

export type AnalyzeResponse =
  | { ok: true; analysis: ModelAnalysis }
  | { ok: false; error: string; code: AnalyzeCode };
