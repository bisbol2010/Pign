import { Fragment } from "react";

/** Bold segments of `text` that match `query` (case-insensitive). */
export function HighlightMatch({
  text,
  query,
  className,
}: {
  text: string;
  query: string;
  className?: string;
}) {
  if (!query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const parts: { value: string; match: boolean }[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const idx = lower.indexOf(q, cursor);
    if (idx < 0) {
      parts.push({ value: text.slice(cursor), match: false });
      break;
    }
    if (idx > cursor) {
      parts.push({ value: text.slice(cursor, idx), match: false });
    }
    parts.push({ value: text.slice(idx, idx + q.length), match: true });
    cursor = idx + q.length;
  }

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.match ? (
          <span key={i} className="font-medium text-pign-black">
            {part.value}
          </span>
        ) : (
          <Fragment key={i}>{part.value}</Fragment>
        )
      )}
    </span>
  );
}
