export function UserMessage({ content }) {
  return (
    <div className="flex items-start justify-end mb-7 animate-slide-up">
      <div
        className="px-4 py-2.5 rounded-xl rounded-br-none text-sm text-[var(--text-primary)] max-w-[75%] leading-relaxed"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        {content}
      </div>
    </div>
  );
}