function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

// Minimal, dependency-free renderer for the lightly-marked-up body text used
// in seeded guides/articles: blank-line-separated paragraphs, a line wrapped
// in ** ** on its own treated as a sub-heading, and inline **bold**.
export function Prose({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <div className="prose-ascend text-forest/80">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        const isHeading = /^\*\*[^*]+\*\*$/.test(trimmed);
        if (isHeading) {
          return (
            <h3 key={i} className="mt-8 mb-2 font-display text-xl font-semibold text-forest first:mt-0">
              {trimmed.slice(2, -2)}
            </h3>
          );
        }
        return <p key={i}>{inline(trimmed)}</p>;
      })}
    </div>
  );
}
