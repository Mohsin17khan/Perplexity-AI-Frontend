export function SuccessModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "40px 32px",
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 0 80px rgba(0,0,0,0.6)",
          backdropFilter: "blur(20px)",
          animation: "fadeUp 0.3s ease both",
        }}
      >
        {/* Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(59,130,246,0.2))",
          border: "2px solid #14b8a6",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px", fontSize: 32,
        }}>
          ✅
        </div>

        <h2 style={{
          fontFamily: "Syne, sans-serif", fontSize: 22,
          fontWeight: 800, color: "#f4f4f5", marginBottom: 12,
        }}>
          Registration Successful!
        </h2>

        <p style={{
          fontSize: 14, color: "rgba(255,255,255,0.45)",
          lineHeight: 1.7, marginBottom: 28,
        }}>
          Please verify your email using the link sent to your inbox to
          activate your account and access all features.
        </p>

        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "14px",
            borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #14b8a6, #22d3ee)",
            color: "#000", fontWeight: 700, fontSize: 15,
            cursor: "pointer", letterSpacing: "0.03em",
          }}
        >
          Got it
        </button>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}