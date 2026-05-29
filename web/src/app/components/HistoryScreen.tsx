import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import type { GameResult } from "../data/gameData";

interface HistoryScreenProps {
  history: GameResult[];
  onBack: () => void;
  onViewResult: (result: GameResult) => void;
  onClearHistory: () => void;
}

export function HistoryScreen({ history, onBack, onViewResult, onClearHistory }: HistoryScreenProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => {
    if (confirmClear) {
      onClearHistory();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
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

      {/* Header */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(8,8,8,0.95)",
          borderBottom: "1px solid #111",
          backdropFilter: "blur(8px)",
        }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 cursor-pointer"
          style={{
            background: "#111",
            border: "1px solid #1E1E1E",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.62rem",
            color: "#666",
            letterSpacing: "0.08em",
          }}
        >
          ← BACK
        </button>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem",
            color: "#444",
            letterSpacing: "0.14em",
          }}
        >
          CASE FILE ARCHIVE
        </span>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="px-3 py-1.5 cursor-pointer"
            style={{
              background: confirmClear ? "rgba(255,107,107,0.1)" : "transparent",
              border: `1px solid ${confirmClear ? "rgba(255,107,107,0.3)" : "#1A1A1A"}`,
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.58rem",
              color: confirmClear ? "#FF6B6B" : "#333",
              letterSpacing: "0.06em",
              transition: "all 0.2s",
            }}
          >
            {confirmClear ? "CONFIRM?" : "CLEAR"}
          </button>
        )}
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6">
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center text-center py-20 gap-4"
          >
            <span style={{ fontSize: "3.5rem" }}>🗂️</span>
            <h2
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "#444",
              }}
            >
              No files yet
            </h2>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.65rem",
                color: "#333",
                lineHeight: 1.7,
              }}
            >
              Complete a diagnostic session<br />to generate a case file.
            </p>
            <button
              onClick={onBack}
              className="mt-4 px-5 py-3 cursor-pointer"
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
              BEGIN DIAGNOSTIC →
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.55rem",
                color: "#333",
                letterSpacing: "0.12em",
                marginBottom: 4,
              }}
            >
              {history.length} CASE FILE{history.length !== 1 ? "S" : ""} ON RECORD
            </p>
            <AnimatePresence>
              {history.map((result, i) => (
                <motion.button
                  key={result.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onViewResult(result)}
                  className="w-full text-left flex items-center gap-4 px-3 py-3 cursor-pointer"
                  style={{
                    background: "#0C0C0C",
                    border: `1px solid #161616`,
                    borderLeft: `3px solid ${result.archetype.color}50`,
                  }}
                >
                  {/* Archetype + score */}
                  <div
                    className="flex-shrink-0 flex flex-col items-center justify-center gap-1"
                    style={{ width: 52, height: 52, background: result.archetype.bgColor, border: `1px solid ${result.archetype.borderColor}` }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>{result.archetype.emoji}</span>
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.55rem",
                        color: result.archetype.color,
                        fontWeight: 700,
                      }}
                    >
                      {result.score}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        fontFamily: "'Fredoka', sans-serif",
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#E0E0E0",
                        marginBottom: 2,
                      }}
                    >
                      {result.archetype.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.55rem",
                        color: "#444",
                        letterSpacing: "0.06em",
                        marginBottom: 4,
                      }}
                    >
                      {result.date}
                    </p>
                    <div className="flex gap-1 flex-wrap">
                      {result.achievements.slice(0, 3).map((a) => (
                        <span
                          key={a.id}
                          style={{ fontSize: "0.75rem" }}
                          title={a.name}
                        >
                          {a.icon}
                        </span>
                      ))}
                      {result.achievements.length > 3 && (
                        <span
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "0.48rem",
                            color: "#444",
                            letterSpacing: "0.06em",
                          }}
                        >
                          +{result.achievements.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <span style={{ color: "#2A2A2A", fontSize: "1.1rem", flexShrink: 0 }}>›</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
