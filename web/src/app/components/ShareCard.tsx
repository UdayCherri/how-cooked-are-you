import type { QuizResult } from "../data/quizData";

interface ShareCardProps {
  result: QuizResult;
}

const STAT_EMOJIS: Record<string, string> = {
  "Brain Rot Severity": "🧠",
  "Touch Grass Requirement": "🌿",
  "Main Character Syndrome": "🎭",
  "Sleep Debt": "💤",
  "Goblin Mode Risk": "👹",
  "Emotional Wifi": "📶",
  // legacy fallbacks
  "Brain Rot Level": "🧠",
  "Touch Grass Urgency": "🌿",
  "Main Character Energy": "🎭",
  "Sleep Deprivation Index": "💤",
  "Chronically Online Rating": "📱",
  "Reality Grip Strength": "🌍",
};

export function ShareCard({ result }: ShareCardProps) {
  const { score, archetype, stats } = result;
  const topStats = Object.entries(stats).slice(0, 3);

  const circumference = 2 * Math.PI * 44;
  const strokeDash = (score / 100) * circumference;

  return (
    <div
      id="share-card"
      className="relative overflow-hidden rounded-3xl"
      style={{
        width: 360,
        background: "#111111",
        border: `3px solid ${archetype.color}`,
        boxShadow: `0 0 60px ${archetype.color}30`,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Color splash top */}
      <div
        className="absolute top-0 left-0 right-0 h-28 opacity-20"
        style={{
          background: `linear-gradient(135deg, ${archetype.color}, transparent)`,
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${archetype.color} 0, ${archetype.color} 1px, transparent 0, transparent 50%)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p
              style={{
                color: archetype.color,
                fontSize: "0.6rem",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.12em",
                marginBottom: 4,
              }}
            >
              HOW COOKED ARE YOU? · DIAGNOSTIC REPORT
            </p>
            <p style={{ color: "#444", fontSize: "0.55rem", fontFamily: "'Space Mono', monospace" }}>
              {result.date}
            </p>
          </div>
          <span style={{ fontSize: "1.6rem" }}>{archetype.emoji}</span>
        </div>

        {/* Score + Archetype */}
        <div className="flex items-center gap-5">
          {/* Circle */}
          <div className="relative flex-shrink-0" style={{ width: 100, height: 100 }}>
            <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke={archetype.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${strokeDash} ${circumference}`}
                style={{ filter: `drop-shadow(0 0 6px ${archetype.color})` }}
              />
            </svg>
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ transform: "rotate(0deg)" }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: archetype.color,
                  lineHeight: 1,
                }}
              >
                {score}
              </span>
              <span style={{ fontSize: "0.55rem", color: "#666", fontFamily: "'Space Mono', monospace" }}>
                /100
              </span>
            </div>
          </div>

          {/* Archetype info */}
          <div className="flex-1 min-w-0">
            <p style={{ color: "#888", fontSize: "0.6rem", fontFamily: "'Space Mono', monospace", marginBottom: 4 }}>
              ARCHETYPE
            </p>
            <p
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: archetype.color,
                lineHeight: 1.1,
              }}
            >
              {archetype.name}
            </p>
            <p
              style={{
                color: "#666",
                fontSize: "0.72rem",
                lineHeight: 1.4,
                marginTop: 4,
              }}
            >
              {archetype.description.slice(0, 80)}...
            </p>
          </div>
        </div>

        {/* Stat bars */}
        <div className="flex flex-col gap-2.5">
          {topStats.map(([label, value]) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: "0.68rem", color: "#888", fontFamily: "'Space Mono', monospace" }}>
                  {STAT_EMOJIS[label]} {label}
                </span>
                <span
                  style={{
                    fontSize: "0.68rem",
                    color: archetype.color,
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                  }}
                >
                  {value}
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${value}%`,
                    background: archetype.color,
                    opacity: 0.8,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div
          className="px-3 py-2 rounded-xl"
          style={{
            background: `${archetype.color}15`,
            border: `1px solid ${archetype.color}30`,
          }}
        >
          <p
            style={{
              color: archetype.color,
              fontSize: "0.62rem",
              fontFamily: "'Space Mono', monospace",
              textAlign: "center",
            }}
          >
            {archetype.warning}
          </p>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p style={{ color: "#2A2A2A", fontSize: "0.55rem", fontFamily: "'Space Mono', monospace" }}>
            howcookedareyou.app
          </p>
          <div className="flex gap-1">
            {["#FF6B6B", "#FFE66D", "#6BCB77", "#4D96FF", "#B983FF"].map((c) => (
              <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
