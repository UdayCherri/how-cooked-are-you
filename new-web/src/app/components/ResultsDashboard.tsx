import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import type { QuizResult } from "../data/quizData";
import { ShareCard } from "./ShareCard";

interface ResultsDashboardProps {
  result: QuizResult;
  onRetry: () => void;
  onHistory: () => void;
}

const STAT_EMOJIS: Record<string, string> = {
  "Brain Rot Level": "🧠",
  "Touch Grass Urgency": "🌿",
  "Main Character Energy": "🎭",
  "Sleep Deprivation Index": "💤",
  "Chronically Online Rating": "📱",
  "Reality Grip Strength": "🌍",
};

const STAT_STATUS = (v: number) => {
  if (v >= 85) return "CRITICAL";
  if (v >= 65) return "ELEVATED";
  if (v >= 40) return "MODERATE";
  return "STABLE";
};

const STATUS_COLOR: Record<string, string> = {
  CRITICAL: "#FF6B6B",
  ELEVATED: "#FFE66D",
  MODERATE: "#4D96FF",
  STABLE: "#6BCB77",
};

function useCountUp(target: number, duration = 1800, delay = 200) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let frame: number;

    const delayTimeout = setTimeout(() => {
      const tick = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrent(Math.round(eased * target));
        if (progress < 1) {
          frame = requestAnimationFrame(tick);
        }
      };
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(delayTimeout);
      cancelAnimationFrame(frame);
    };
  }, [target, duration, delay]);

  return current;
}

export function ResultsDashboard({ result, onRetry, onHistory }: ResultsDashboardProps) {
  const { score, archetype, stats } = result;
  const [showStats, setShowStats] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const animatedScore = useCountUp(score, 1800, 600);

  const circumference = 2 * Math.PI * 56;
  const strokeDash = (animatedScore / 100) * circumference;

  useEffect(() => {
    const t1 = setTimeout(() => setShowStats(true), 2200);
    return () => clearTimeout(t1);
  }, []);

  const handleShare = async () => {
    const text = `I just took "How Cooked Are You?" and got:\n\n${archetype.emoji} ${archetype.name} (${score}/100)\n\n${archetype.warning}\n\nTake the quiz: howcookedareyou.app`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        /* ignore */
      }
    }
  };

  const statEntries = Object.entries(stats);

  return (
    <div
      className="min-h-screen overflow-y-auto"
      style={{ background: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Colored ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${archetype.color}12 0%, transparent 60%),
                       radial-gradient(circle at 70% 80%, ${archetype.color}08 0%, transparent 50%)`,
          zIndex: 0,
        }}
      />

      {/* Fake system header */}
      <div
        className="relative z-20 w-full flex items-center justify-between px-4 py-2.5"
        style={{
          background: "rgba(0,0,0,0.6)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
        }}
      >
        <span style={{ color: "#444", fontSize: "0.65rem", fontFamily: "'Space Mono', monospace" }}>
          DIAGNOSTIC_REPORT_{result.id.slice(-6).toUpperCase()}
        </span>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
            style={{
              background: "rgba(107,203,119,0.15)",
              border: "1px solid rgba(107,203,119,0.3)",
              color: "#6BCB77",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            COMPLETE
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Score section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex flex-col sm:flex-row items-center gap-6 rounded-3xl p-6"
          style={{
            background: "#1A1A1A",
            border: `3px solid ${archetype.color}`,
            boxShadow: `0 0 60px ${archetype.color}18, 6px 6px 0px ${archetype.color}35`,
          }}
        >
          {/* Score circle */}
          <div className="relative flex-shrink-0" style={{ width: 140, height: 140 }}>
            <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
              <circle
                cx="70" cy="70" r="56"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="10"
              />
              <circle
                cx="70" cy="70" r="56"
                fill="none"
                stroke={archetype.color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${strokeDash} ${circumference}`}
                style={{ filter: `drop-shadow(0 0 10px ${archetype.color})` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "2.2rem",
                  fontWeight: 700,
                  color: archetype.color,
                  lineHeight: 1,
                  textShadow: `0 0 20px ${archetype.color}60`,
                }}
              >
                {animatedScore}
              </motion.span>
              <span style={{ fontSize: "0.65rem", color: "#555", fontFamily: "'Space Mono', monospace" }}>
                COOKED
              </span>
            </div>
          </div>

          {/* Archetype info */}
          <div className="flex-1 text-center sm:text-left">
            <p
              style={{
                color: archetype.color,
                fontSize: "0.65rem",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.12em",
                marginBottom: 6,
              }}
            >
              YOUR ARCHETYPE
            </p>
            <h2
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
                fontWeight: 700,
                color: "#F5F5F5",
                lineHeight: 1.1,
                marginBottom: 8,
              }}
            >
              <span style={{ marginRight: 8 }}>{archetype.emoji}</span>
              {archetype.name}
            </h2>
            <p style={{ color: "#999", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 12 }}>
              {archetype.description}
            </p>
            {/* Diagnosis pills */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {archetype.diagnosis.map((d) => (
                <span
                  key={d}
                  className="px-2.5 py-1 rounded-full text-xs"
                  style={{
                    background: `${archetype.color}15`,
                    border: `1px solid ${archetype.color}30`,
                    color: archetype.color,
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Fake warning banner */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: `${archetype.color}10`,
            border: `1.5px solid ${archetype.color}35`,
          }}
        >
          <span className="text-xl flex-shrink-0">⚠️</span>
          <p
            style={{
              color: archetype.color,
              fontSize: "0.82rem",
              fontFamily: "'Space Mono', monospace",
              lineHeight: 1.4,
            }}
          >
            {archetype.warning}
          </p>
        </motion.div>

        {/* Stats grid */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p
                style={{
                  color: "#444",
                  fontSize: "0.65rem",
                  fontFamily: "'Space Mono', monospace",
                  letterSpacing: "0.1em",
                  marginBottom: 12,
                }}
              >
                DETAILED METRICS — CLASSIFIED
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {statEntries.map(([label, value], i) => {
                  const status = STAT_STATUS(value);
                  const statusColor = STATUS_COLOR[status];

                  return (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 20, rotate: i % 2 === 0 ? -1 : 1 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.4, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.04, rotate: i % 2 === 0 ? -0.5 : 0.5 }}
                      className="relative rounded-2xl p-4 overflow-hidden cursor-default"
                      style={{
                        background: "#1A1A1A",
                        border: `2px solid rgba(255,255,255,0.06)`,
                      }}
                    >
                      <div className="text-2xl mb-3">{STAT_EMOJIS[label]}</div>
                      <div
                        className="flex items-end justify-between mb-2"
                      >
                        <span
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "1.6rem",
                            fontWeight: 700,
                            color: statusColor,
                            lineHeight: 1,
                          }}
                        >
                          {value}
                        </span>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            background: `${statusColor}18`,
                            color: statusColor,
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "0.55rem",
                          }}
                        >
                          {status}
                        </span>
                      </div>
                      <div
                        className="w-full h-1 rounded-full mb-2"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease: "easeOut" }}
                          style={{ background: statusColor }}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: "0.65rem",
                          color: "#666",
                          fontFamily: "'Space Mono', monospace",
                          lineHeight: 1.3,
                        }}
                      >
                        {label}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share card preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col items-center gap-4"
        >
          <p
            style={{
              color: "#444",
              fontSize: "0.65rem",
              fontFamily: "'Space Mono', monospace",
              letterSpacing: "0.1em",
            }}
          >
            SCREENSHOT THIS AND SHARE WITH YOUR ENEMIES
          </p>
          <div className="overflow-hidden" style={{ maxWidth: 360, width: "100%" }}>
            <ShareCard result={result} />
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.04, rotate: -0.5 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-4 rounded-2xl cursor-pointer"
            style={{
              background: "#FFE66D",
              border: "3px solid #FFE66D",
              fontFamily: "'Fredoka', sans-serif",
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "#0D0D0D",
              boxShadow: "4px 4px 0px rgba(255,230,109,0.4)",
            }}
          >
            {copied ? "✓ Copied to clipboard!" : "📤 Share Results"}
          </motion.button>

          <motion.button
            onClick={onRetry}
            whileHover={{ scale: 1.04, rotate: 0.5 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-4 rounded-2xl cursor-pointer"
            style={{
              background: "#1A1A1A",
              border: "2px solid rgba(255,255,255,0.12)",
              fontFamily: "'Fredoka', sans-serif",
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "#F5F5F5",
            }}
          >
            🔄 Try Again
          </motion.button>

          <motion.button
            onClick={onHistory}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-4 rounded-2xl cursor-pointer sm:flex-none sm:px-5"
            style={{
              background: "#1A1A1A",
              border: "2px solid rgba(255,255,255,0.08)",
              fontFamily: "'Fredoka', sans-serif",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#888",
            }}
          >
            📋 History
          </motion.button>
        </motion.div>

        {/* Fun footnote */}
        <p
          className="text-center pb-4"
          style={{ color: "#222", fontSize: "0.65rem", fontFamily: "'Space Mono', monospace" }}
        >
          * this is not real. please do not seek reimbursement from your insurance provider.
        </p>
      </div>
    </div>
  );
}
