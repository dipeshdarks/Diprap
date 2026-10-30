import { splitHighlight } from "@/lib/text-analysis";

export function LyricText({ text, words }: { text: string; words: string[] }) {
  const parts = splitHighlight(text, words);
  return (
    <p className="text-sm leading-6 text-fg">
      {parts.map((part, index) =>
        part.hit ? (
          <mark key={`${part.text}-${index}`} className="rounded-sm bg-gold/20 px-0.5 text-gold">
            {part.text}
          </mark>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        ),
      )}
    </p>
  );
}
