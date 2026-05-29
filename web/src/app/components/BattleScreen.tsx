import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import { ApiError, battleReports, type ApiBattleResult } from "../lib/api";
import { getArchetype, type GameResult } from "../data/gameData";
import { parseSharedId } from "../lib/adapt";
import { MachineFace } from "./MachineFace";

interface BattleScreenProps {
  current: GameResult;
  history: GameResult[];
  onBack: () => void;
}

type Phase = "select" | "loading" | "result";

const LOADING_LINES = [
  "loading both case files into the arena…",
  "measuring relative cookedness…",
  "the machine is picking a side (it shouldn't)…",
  "cross-referencing crimes…",
];

export function BattleScreen({ current, history, onBack }: BattleScreenProps) {
  const [phase, setPhase] = useState<Phase>("select");
  const [pasted, setPasted] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiBattleResult | null>(null);

  const opponents = useMemo(
    () => history.filter((h) => h.id !== current.id),
    [history, current.id]
  );

  const runBattle = async (opponentId: string) => {
    setError(null);
    if (opponentId === current.id) {
      setError("a case file cannot battle itself. that's just a Tuesday.");
      return;
    }
    setPhase("loading");
    try {
      const res = await battleReports(current.id, opponentId);
      setResult(res);
      setPhase("result");
    } catch (err) {
      let msg = "the battle fizzled — try another opponent.";
      if (err instanceof ApiError) {
        if (err.code === "result_not_found") msg = "that case file isn't on the server. it may have aged out.";
        else if (err.code === "same_combatant") msg = "a case file cannot battle itself. that's just a Tuesday.";
        else if (err.status === 429) msg = "too many battles. give the machine a minute.";
        else msg = err.message;
      }
      setError(msg);
      setPhase("select");
    }
  };

  const handlePasted = () => {
    const id = parseSharedId(pasted);
    if (!id) {
      setError("that doesn't look like a case id or share link.");
      return;
    }
    runBattle(id);
  };

  const reset = () => {
    setResult(null);
    setPasted("");
    setError(null);
    setPhase("select");
  };

  const accent = "#B983FF";

  return (
    <div className="min-h-screen" style={{ background: "#080808", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 3px)",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3"
        style={{ background: "rgba(8,8,8,0.95)", borderBottom: "1px solid #111", backdropFilter: "blur(8px)" }}
      >
        <button
          onClick={phase === "result" ? reset : onBack}
          className="px-3 py-1.5 cursor-pointer"
          style={{
            background: "#111",
            border: "1px solid #1E1E1E",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.62rem",
            color: "#666",
            letterSpacing: "0.08em",
          }}
        >
          ← {phase === "result" ? "NEW BATTLE" : "BACK"}
        </button>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#444", letterSpacing: "0.14em" }}>
          ⚔ COMBAT DIAGNOSTIC
        </span>
        <span style={{ width: 64 }} />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6">
        {/* Your fighter */}
        <div
          className="flex items-center gap-4 px-3 py-3 mb-6"
          style={{ background: "#0C0C0C", border: `1px solid #161616`, borderLeft: `3px solid ${current.archetype.color}` }}
        >
          <span style={{ fontSize: "1.8rem" }}>{current.archetype.emoji}</span>
          <div className="flex-1 min-w-0">
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.52rem", color: "#444", letterSpacing: "0.12em" }}>
              YOUR CASE FILE
            </p>
            <p style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#E0E0E0" }}>
              {current.archetype.name}
            </p>
          </div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "1.1rem", fontWeight: 700, color: current.archetype.color }}>
            {current.score}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {phase === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              className="flex flex-col gap-5"
            >
              {error && (
                <div className="px-3 py-2" style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.3)" }}>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#FF6B6B", lineHeight: 1.6 }}>{error}</p>
                </div>
              )}

              {/* Paste a friend's link */}
              <div className="px-4 py-4" style={{ background: "#0C0C0C", border: "1px solid #161616" }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: accent, letterSpacing: "0.12em", marginBottom: 10 }}>
                  CHALLENGE A SHARED LINK
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={pasted}
                    onChange={(e) => setPasted(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePasted()}
                    placeholder="paste a share link or case id…"
                    className="flex-1 px-3 py-2.5 outline-none"
                    style={{
                      background: "#080808",
                      border: "1px solid #1E1E1E",
                      color: "#E0E0E0",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.75rem",
                    }}
                  />
                  <motion.button
                    onClick={handlePasted}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2.5 cursor-pointer"
                    style={{
                      background: accent,
                      border: `2px solid ${accent}`,
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 700,
                      color: "#080808",
                    }}
                  >
                    FIGHT →
                  </motion.button>
                </div>
              </div>

              {/* From history */}
              <div>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: "#333", letterSpacing: "0.12em", marginBottom: 10 }}>
                  …OR PICK FROM THE ARCHIVE
                </p>
                {opponents.length === 0 ? (
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#444", lineHeight: 1.7 }}>
                    No other case files yet. Run another diagnostic, or paste a friend's share link above.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {opponents.map((opp) => (
                      <motion.button
                        key={opp.id}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => runBattle(opp.id)}
                        className="w-full text-left flex items-center gap-3 px-3 py-3 cursor-pointer"
                        style={{ background: "#0C0C0C", border: "1px solid #161616", borderLeft: `3px solid ${opp.archetype.color}50` }}
                      >
                        <span
                          className="flex-shrink-0 flex items-center justify-center"
                          style={{ width: 44, height: 44, background: opp.archetype.bgColor, border: `1px solid ${opp.archetype.borderColor}` }}
                        >
                          <span style={{ fontSize: "1.1rem" }}>{opp.archetype.emoji}</span>
                        </span>
                        <div className="flex-1 min-w-0">
                          <p style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#E0E0E0" }}>
                            {opp.archetype.name}
                          </p>
                          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.52rem", color: "#444", letterSpacing: "0.06em" }}>
                            {opp.date}
                          </p>
                        </div>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.9rem", fontWeight: 700, color: opp.archetype.color }}>
                          {opp.score}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5 py-16"
            >
              <MachineFace expression="glitching" size="lg" />
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", color: accent, textAlign: "center" }}>
                {LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)]}
              </p>
            </motion.div>
          )}

          {phase === "result" && result && (
            <BattleResultView key="result" result={result} onRematch={reset} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BattleResultView({ result, onRematch }: { result: ApiBattleResult; onRematch: () => void }) {
  const { a, b, tie, winnerId } = result;
  const aColor = getArchetype(a.cookedPercentage).color;
  const bColor = getArchetype(b.cookedPercentage).color;

  const Fighter = ({ c, color, won }: { c: ApiBattleResult["a"]; color: string; won: boolean }) => (
    <div
      className="flex-1 px-3 py-4 text-center relative"
      style={{
        background: "#0C0C0C",
        border: `2px solid ${won ? color : "#1A1A1A"}`,
        boxShadow: won ? `3px 3px 0 0 ${color}40` : "none",
      }}
    >
      {won && (
        <span
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5"
          style={{
            background: color,
            color: "#080808",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.5rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
          }}
        >
          WINNER
        </span>
      )}
      <div style={{ fontSize: "2.2rem", marginBottom: 4 }}>{c.emoji}</div>
      <p style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#E0E0E0", lineHeight: 1.15 }}>
        {c.archetype}
      </p>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "1.2rem", fontWeight: 700, color, marginTop: 4 }}>
        {c.cookedPercentage}
      </p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      className="flex flex-col gap-5"
    >
      <div className="flex items-stretch gap-3">
        <Fighter c={a} color={aColor} won={!tie && winnerId === a.id} />
        <div className="flex items-center justify-center">
          <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#444" }}>VS</span>
        </div>
        <Fighter c={b} color={bColor} won={!tie && winnerId === b.id} />
      </div>

      {/* Verdict */}
      <div className="px-5 py-5 text-center" style={{ background: "#0A0606", border: "2px solid #FF6B6B40" }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: "#FF6B6B", letterSpacing: "0.16em", marginBottom: 10 }}>
          {tie ? "◆ IT'S A DRAW ◆" : "◆ THE MACHINE HAS DECIDED ◆"}
        </p>
        <p style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#F0F0F0", lineHeight: 1.35, marginBottom: 10 }}>
          {result.funniestExplanation}
        </p>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", color: "#888", lineHeight: 1.7 }}>
          {result.battleSummary}
        </p>
      </div>

      {/* Who leans harder */}
      <div className="px-4 py-4" style={{ background: "#0C0C0C", border: "1px solid #161616" }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: "#4D96FF", letterSpacing: "0.12em", marginBottom: 12 }}>
          WHO LEANS HARDER
        </p>
        <div className="flex flex-col gap-2.5">
          {result.statComparison.map((s) => {
            const total = s.a + s.b || 1;
            const aPct = (s.a / total) * 100;
            const leader = s.diff === 0 ? "tie" : s.diff > 0 ? "a" : "b";
            return (
              <div key={s.stat}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", fontWeight: 700, color: leader === "a" ? aColor : "#555" }}>
                    {s.a}
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: "#777" }}>{s.label}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", fontWeight: 700, color: leader === "b" ? bColor : "#555" }}>
                    {s.b}
                  </span>
                </div>
                <div className="flex h-1.5 overflow-hidden" style={{ background: "#080808" }}>
                  <div style={{ width: `${aPct}%`, background: aColor, opacity: 0.85 }} />
                  <div style={{ width: `${100 - aPct}%`, background: bColor, opacity: 0.85 }} />
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: "#333", marginTop: 12, textAlign: "center", letterSpacing: "0.06em" }}>
          biggest gap: {result.biggestGap.label} ({result.biggestGap.gap})
        </p>
      </div>

      <motion.button
        onClick={onRematch}
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.98 }}
        className="py-3.5 cursor-pointer"
        style={{
          background: "#B983FF",
          border: "2px solid #B983FF",
          boxShadow: "3px 3px 0 0 #7B3FFF",
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "1rem",
          fontWeight: 700,
          color: "#080808",
        }}
      >
        ⚔ BATTLE SOMEONE ELSE
      </motion.button>
    </motion.div>
  );
}
