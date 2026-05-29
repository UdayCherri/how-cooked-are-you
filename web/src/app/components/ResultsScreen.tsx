import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { BOSS_STAGES, getBossTier, type GameResult } from "../data/gameData";
import { MachineFace } from "./MachineFace";
import { shareUrlFor } from "../lib/adapt";

interface ResultsScreenProps {
  result: GameResult;
  onRetry: () => void;
  onHistory: () => void;
  onBattle: () => void;
}

const EVIDENCE_STYLES: Record<string, { color: string; label: string }> = {
  exhibit:    { color: "#FFE66D", label: "EXHIBIT" },
  behavioral: { color: "#4D96FF", label: "BEHAVIORAL" },
  testimony:  { color: "#6BCB77", label: "TESTIMONY" },
  critical:   { color: "#FF6B6B", label: "CRITICAL" },
};

function useCountUp(target: number, delay = 400, duration = 1600) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let raf: number;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setCurrent(Math.round(eased * target));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [target, delay, duration]);
  return current;
}

export function ResultsScreen({ result, onRetry, onHistory, onBattle }: ResultsScreenProps) {
  const { score, archetype, evidence, achievements } = result;
  const [revealPhase, setRevealPhase] = useState(0);
  const [copied, setCopied] = useState(false);
  const animatedScore = useCountUp(score, 600, 1800);
  const circumference = 2 * Math.PI * 52;
  const strokeDash = (animatedScore / 100) * circumference;

  const tier = getBossTier(score);
  const boss = BOSS_STAGES.find((b) => b.tier === tier)!;
  const bossChoice = boss.choices[result.bossChoiceIdx];

  useEffect(() => {
    const timings = [0, 1200, 2400, 3600, 4800];
    const timers = timings.map((t, i) =>
      setTimeout(() => setRevealPhase(i + 1), t)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleShare = async () => {
    const url = shareUrlFor(result.id);
    const text = `I just got diagnosed by The Machine.\n\n${archetype.emoji} ${archetype.name} (${score}/100)\n\n"${archetype.verdict.slice(0, 100)}..."\n\nHOW COOKED ARE YOU? → ${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "How Cooked Are You?", text, url });
        return;
      }
    } catch {
      /* user cancelled native share */
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "#080808", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 3px)",
          zIndex: 0,
        }}
      />

      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${archetype.color}10 0%, transparent 60%)`,
          zIndex: 0,
        }}
      />

      {/* Header bar */}
      <div
        className="relative z-20 flex items-center justify-between px-4 py-2.5"
        style={{ background: "#060606", borderBottom: "1px solid #111" }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.55rem",
            color: "#333",
            letterSpacing: "0.12em",
          }}
        >
          CASE_{result.id.slice(-6).toUpperCase()} · {result.date}
        </span>
        <span className="flex items-center gap-2">
          {result.shared && (
            <span
              className="px-2.5 py-1"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.52rem",
                color: "#B983FF",
                background: "rgba(185,131,255,0.08)",
                border: "1px solid rgba(185,131,255,0.25)",
                letterSpacing: "0.1em",
              }}
            >
              👁 SHARED FILE
            </span>
          )}
          <span
            className="flex items-center gap-1.5 px-2.5 py-1"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.52rem",
              color: "#6BCB77",
              background: "rgba(107,203,119,0.08)",
              border: "1px solid rgba(107,203,119,0.2)",
              letterSpacing: "0.1em",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            DIAGNOSTIC CLOSED
          </span>
        </span>
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6 flex flex-col gap-5">

        {/* ── PHASE 1: Machine verdict ── */}
        <AnimatePresence>
          {revealPhase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-start gap-4 p-4"
              style={{
                background: "#0C0C0C",
                border: `2px solid ${archetype.borderColor}`,
                boxShadow: `3px 3px 0 0 ${archetype.color}25`,
              }}
            >
              <MachineFace expression="judging" size="sm" />
              <div className="flex-1 min-w-0">
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.52rem",
                    color: archetype.color,
                    letterSpacing: "0.14em",
                    marginBottom: 6,
                  }}
                >
                  FINAL ASSESSMENT
                </p>
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.75rem",
                    color: "#A0A0A0",
                    lineHeight: 1.75,
                  }}
                >
                  {archetype.verdict}
                </p>
                {!result.shared && bossChoice && (
                  <p
                    className="mt-3"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.65rem",
                      color: "#555",
                      lineHeight: 1.6,
                    }}
                  >
                    CONFRONTATION LOG: &ldquo;{boss.choices[result.bossChoiceIdx].text}&rdquo;<br />
                    <span style={{ color: "#444" }}>THE MACHINE: {bossChoice.reaction.split("\n")[0]}</span>
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PHASE 2: Character sheet ── */}
        <AnimatePresence>
          {revealPhase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: "#0C0C0C",
                border: `2px solid ${archetype.borderColor}`,
                boxShadow: `4px 4px 0 0 ${archetype.color}30`,
              }}
            >
              {/* Sheet header */}
              <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{
                  borderBottom: `1px solid ${archetype.color}20`,
                  background: archetype.bgColor,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.55rem",
                    color: archetype.color,
                    letterSpacing: "0.14em",
                  }}
                >
                  SUBJECT CHARACTER SHEET
                </span>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.52rem",
                    color: "#333",
                    letterSpacing: "0.1em",
                  }}
                >
                  FILE: CLOSED
                </span>
              </div>

              <div className="p-4 flex items-center gap-5">
                {/* Score circle */}
                <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
                  <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r="52"
                      fill="none"
                      stroke={archetype.color}
                      strokeWidth="8"
                      strokeLinecap="square"
                      strokeDasharray={`${strokeDash} ${circumference}`}
                      style={{ filter: `drop-shadow(0 0 8px ${archetype.color}60)` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "2rem",
                        fontWeight: 700,
                        color: archetype.color,
                        lineHeight: 1,
                        textShadow: `0 0 16px ${archetype.color}60`,
                      }}
                    >
                      {animatedScore}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.5rem",
                        color: "#444",
                        letterSpacing: "0.1em",
                      }}
                    >
                      COOKED
                    </span>
                  </div>
                </div>

                {/* Archetype info */}
                <div className="flex-1 min-w-0">
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.52rem",
                      color: "#444",
                      letterSpacing: "0.1em",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    CLASS
                  </span>
                  <p
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.62rem",
                      color: archetype.color,
                      letterSpacing: "0.06em",
                      marginBottom: 8,
                    }}
                  >
                    {archetype.class}
                  </p>
                  <h2
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontSize: "clamp(1.4rem, 5vw, 1.8rem)",
                      fontWeight: 700,
                      color: "#F0F0F0",
                      lineHeight: 1.1,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ marginRight: 8 }}>{archetype.emoji}</span>
                    {archetype.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-1.5 flex-1"
                      style={{ background: "#111" }}
                    >
                      <div
                        className="h-full"
                        style={{
                          width: `${score}%`,
                          background: archetype.color,
                          transition: "width 1.8s cubic-bezier(0.4,0,0.2,1)",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.5rem",
                        color: archetype.color,
                        letterSpacing: "0.06em",
                      }}
                    >
                      LVL {score}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PHASE 3: Evidence board ── */}
        <AnimatePresence>
          {revealPhase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.55rem",
                  color: "#333",
                  letterSpacing: "0.14em",
                  marginBottom: 10,
                }}
              >
                EVIDENCE BOARD — {evidence.length} ITEMS
              </p>
              <div className="flex flex-col gap-2">
                {evidence.map((item, i) => {
                  const s = EVIDENCE_STYLES[item.type];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                      className="flex items-start gap-3 px-3 py-2.5"
                      style={{
                        background: "#0C0C0C",
                        borderLeft: `3px solid ${s.color}60`,
                        border: `1px solid #161616`,
                        borderLeftWidth: 3,
                        borderLeftColor: `${s.color}60`,
                      }}
                    >
                      <span
                        className="flex-shrink-0 px-1.5 py-0.5"
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "0.48rem",
                          color: s.color,
                          background: `${s.color}12`,
                          border: `1px solid ${s.color}30`,
                          letterSpacing: "0.08em",
                          whiteSpace: "nowrap",
                          marginTop: 2,
                        }}
                      >
                        {s.label}
                      </span>
                      <div>
                        <p
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "0.68rem",
                            color: "#C0C0C0",
                            lineHeight: 1.3,
                            marginBottom: 2,
                          }}
                        >
                          {item.title}
                        </p>
                        <p
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "0.58rem",
                            color: "#555",
                            lineHeight: 1.5,
                          }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PHASE 4: Achievements ── */}
        <AnimatePresence>
          {revealPhase >= 4 && achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.55rem",
                  color: "#333",
                  letterSpacing: "0.14em",
                  marginBottom: 10,
                }}
              >
                ACHIEVEMENTS UNLOCKED — {achievements.length}
              </p>
              <div className="flex flex-col gap-2">
                {achievements.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.35, type: "spring", stiffness: 260, damping: 22 }}
                    className="flex items-center gap-3 px-3 py-3"
                    style={{
                      background: "#0C0C0C",
                      border: "1px solid #1A1A1A",
                      borderLeft: "3px solid #6BCB7760",
                    }}
                  >
                    <span
                      className="text-2xl flex-shrink-0"
                      style={{
                        filter: "drop-shadow(0 0 6px rgba(107,203,119,0.4))",
                      }}
                    >
                      {a.icon}
                    </span>
                    <div>
                      <p
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "0.62rem",
                          color: "#6BCB77",
                          letterSpacing: "0.08em",
                          marginBottom: 2,
                        }}
                      >
                        {a.name}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "0.55rem",
                          color: "#555",
                          lineHeight: 1.5,
                        }}
                      >
                        {a.flavor}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PHASE 5: Actions ── */}
        <AnimatePresence>
          {revealPhase >= 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-3"
            >
              {/* Share button */}
              <motion.button
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="w-full py-4 cursor-pointer"
                style={{
                  background: "#FFE66D",
                  border: "2px solid #FFE66D",
                  boxShadow: "4px 4px 0 0 #A89820",
                  fontFamily: "'Fredoka', sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#080808",
                  letterSpacing: "0.01em",
                }}
              >
                {copied ? "✓ copied to clipboard" : "📤 SHARE DIAGNOSIS"}
              </motion.button>

              <motion.button
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBattle}
                className="w-full py-3.5 cursor-pointer"
                style={{
                  background: "#B983FF",
                  border: "2px solid #B983FF",
                  boxShadow: "4px 4px 0 0 #7B3FFF",
                  fontFamily: "'Fredoka', sans-serif",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "#080808",
                }}
              >
                ⚔ BATTLE A FRIEND
              </motion.button>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onRetry}
                  className="flex-1 py-3.5 cursor-pointer"
                  style={{
                    background: "#0C0C0C",
                    border: "2px solid #1E1E1E",
                    boxShadow: "3px 3px 0 0 #1E1E1E",
                    fontFamily: "'Fredoka', sans-serif",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#888",
                  }}
                >
                  🔄 Run Again
                </motion.button>
                <motion.button
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onHistory}
                  className="flex-1 py-3.5 cursor-pointer"
                  style={{
                    background: "#0C0C0C",
                    border: "2px solid #1A1A1A",
                    fontFamily: "'Fredoka', sans-serif",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#666",
                  }}
                >
                  📋 Case Files
                </motion.button>
              </div>

              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.52rem",
                  color: "#222",
                  textAlign: "center",
                  letterSpacing: "0.06em",
                }}
              >
                * not a licensed diagnostic tool · the machine takes no responsibility
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
