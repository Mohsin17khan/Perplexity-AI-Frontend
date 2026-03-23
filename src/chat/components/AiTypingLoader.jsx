export function AiTypingLoader() {
  return (
    <div className="mb-10 animate-fade-in flex items-center gap-3">
      {/* Orb icon */}
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent-teal), var(--accent-blue))",
          flexShrink: 0,
        }}
      />
      {/* Bouncing dots */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--accent-teal)",
              opacity: 0.85,
              animation: "aiDotBounce 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes aiDotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40%            { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}