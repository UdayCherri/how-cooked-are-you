import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import type { QuizResult } from "../data/quizData";
import { ShareCard } from "./ShareCard";

interface ResultsDashboardProps {
  result: QuizResult;
  shared?: boolean;
  onRetry: () => void;
  onHistory: () => void;
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

const STAT_STATUS = (label: string, v: number) => {
  // Emotional Wifi is inverted: higher = healthier
  const inverted = label.toLowerCase().includes("wifi");
  const effective = inverted ? 100 - v : v;
  if (effective >= 85) return "CRITICAL";
  if (effective >= 65) return "ELEVATED";
  if (effective >= 40) return "MODERATE";
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

function buildShareUrl(id: string): string {
  if (typeof window === "undefined") return `/r/${id}`;
  return `${window.location.origin}/r/${id}`;
}

export function ResultsDashboard({ result, shared, onRetry, onHistory }: ResultsDashboardProps) {
  const { score, archetype, stats, recoveryPlan, compatibility, observations } = result;
  const [showStats, setShowStats] = useState(false);
  const [copied, setCopied] = useState(false);
  const animatedScore = useCountUp(score, 1800, 600);

  const circumference = 2 * Math.PI * 56;
  const strokeDash = (animatedScore / 100) * circumference;

  useEffect(() => {
    const t1 = setTimeout(() => setShowStats(true), 2200);
    return () => clearTimeout(t1);
  }, []);

  const handleShare = async () => {
    const url = buildShareUrl(result.id);
    const text = `I'm ${score}% cooked — diagnosed as ${archetype.emoji} ${archetype.name} on How Cooked Are You?\n\n${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "How Cooked Are You?", text, url });
        return;
      }
    } catch {
      /* user cancelled share */
    }
    try {
      await navigator.clipboard.writeText(`${text}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard blocked */
    }
  };

  const statEntries = Object.entries(stats);
  const safeId = result.id.replace(/[^A-Za-z0-9_-]/g, "");

  return (
    <div
      className="min-h-screen overflow-y-auto"
      style={{ background: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${archetype.color}12 0%, transparent 60%),
                       radial-gradient(circle at 70% 80%, ${archetype.color}08 0%, transparent 50%)`,
          zIndex: 0,
        }}
      />

      <div
        className="relative z-20 w-full flex items-center justify-between px-4 py-2.5"
        style={{
          background: "rgba(0,0,0,0.6)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
        }}
      >
        <span style={{ color: "#444", fontSize: "0.65rem", fontFamily: "'Space Mono', monospace" }}>
          DIAGNOSTIC_REPORT_{safeId.slice(-6).toUpperCase()}
        </span>
        <div className="flex items-center gap-2">
          {shared && (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
              style={{
                background: "rgba(185,131,255,0.15)",
                border: "1px solid rgba(185,131,255,0.3)",
                color: "#B983FF",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              👀 SHARED RESULT
            </span>
          )}
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
          <div className="relative flex-shrink-0" style={{ width: 140, height: 140 }}>
            <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="70" cy="70" r="56" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle
                cx="70"
                cy="70"
                r="56"
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
                fontSize: "clamp(1.6rem, 5vw, 2.3rem)",
                fontWeight: 700,
                color: "#F5F5F5",
                lineHeight: 1.1,
                marginBottom: 6,
              }}
            >
              <span style={{ marginRight: 8 }}>{archetype.emoji}</span>
              {archetype.name}
            </h2>
            <p
              style={{
                color: archetype.color,
                fontSize: "0.78rem",
                fontStyle: "italic",
                lineHeight: 1.4,
                marginBottom: 10,
              }}
            >
              "{archetype.tagline}"
            </p>
            <p style={{ color: "#999", fontSize: "0.88rem", lineHeight: 1.55, marginBottom: 12 }}>
              {archetype.description}
            </p>
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
                  const status = STAT_STATUS(label, value);
                  const statusColor = STATUS_COLOR[status] as string;

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
                      <div className="text-2xl mb-3">{STAT_EMOJIS[label] ?? "📈"}</div>
                      <div className="flex items-end justify-between mb-2">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="rounded-2xl p-5"
          style={{
            background: "#1A1A1A",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p
            style={{
              color: "#FFE66D",
              fontSize: "0.62rem",
              fontFamily: "'Space Mono', monospace",
              letterSpacing: "0.12em",
              marginBottom: 12,
            }}
          >
            RECOMMENDED RECOVERY PLAN
          </p>
          <ul className="flex flex-col gap-2.5">
            {recoveryPlan.map((step, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + i * 0.08 }}
                className="flex items-start gap-3"
                style={{ color: "#D0D0D0", fontSize: "0.88rem", lineHeight: 1.45 }}
              >
                <span
                  className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md text-xs"
                  style={{
                    background: "rgba(255,230,109,0.12)",
                    border: "1px solid rgba(255,230,109,0.25)",
                    color: "#FFE66D",
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </span>
                {step}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {observations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="rounded-2xl p-5"
            style={{
              background: "#1A1A1A",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p
              style={{
                color: "#B983FF",
                fontSize: "0.62rem",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.12em",
                marginBottom: 12,
              }}
            >
              CHAOTIC OBSERVATIONS
            </p>
            <ul className="flex flex-col gap-2 list-disc list-inside" style={{ color: "#B0B0B0", fontSize: "0.85rem", lineHeight: 1.45 }}>
              {observations.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl p-5"
          style={{
            background: "#1A1A1A",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="sm:col-span-3">
            <p
              style={{
                color: "#4D96FF",
                fontSize: "0.62rem",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.12em",
              }}
            >
              COMPATIBILITY ANALYSIS
            </p>
          </div>
          <div className="rounded-xl p-3" style={{ background: "rgba(107,203,119,0.08)", border: "1px solid rgba(107,203,119,0.25)" }}>
            <p style={{ color: "#6BCB77", fontSize: "0.6rem", fontFamily: "'Space Mono', monospace", marginBottom: 4 }}>
              BEST MATCH
            </p>
            <p style={{ color: "#F5F5F5", fontFamily: "'Fredoka', sans-serif", fontSize: "0.95rem", fontWeight: 700 }}>
              {compatibility.bestMatch}
            </p>
          </div>
          <div className="rounded-xl p-3" style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)" }}>
            <p style={{ color: "#FF6B6B", fontSize: "0.6rem", fontFamily: "'Space Mono', monospace", marginBottom: 4 }}>
              WORST MATCH
            </p>
            <p style={{ color: "#F5F5F5", fontFamily: "'Fredoka', sans-serif", fontSize: "0.95rem", fontWeight: 700 }}>
              {compatibility.worstMatch}
            </p>
          </div>
          <div className="rounded-xl p-3" style={{ background: "rgba(77,150,255,0.08)", border: "1px solid rgba(77,150,255,0.25)" }}>
            <p style={{ color: "#4D96FF", fontSize: "0.6rem", fontFamily: "'Space Mono', monospace", marginBottom: 4 }}>
              CHAOS RATING
            </p>
            <p style={{ color: "#F5F5F5", fontFamily: "'Fredoka', sans-serif", fontSize: "1.6rem", fontWeight: 700, lineHeight: 1 }}>
              {compatibility.rating}
              <span style={{ fontSize: "0.7rem", color: "#666", marginLeft: 4 }}>/100</span>
            </p>
          </div>
        </motion.div>

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
            {copied ? "✓ link copied to clipboard!" : "📤 Share Results"}
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
            {shared ? "🔥 Take it Yourself" : "🔄 Try Again"}
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
