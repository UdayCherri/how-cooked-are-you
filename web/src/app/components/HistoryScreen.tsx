import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import type { QuizResult } from "../data/quizData";

interface HistoryScreenProps {
  history: QuizResult[];
  onBack: () => void;
  onViewResult: (result: QuizResult) => void;
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
      style={{ background: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(13,13,13,0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#888",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          ← back
        </button>
        <h1
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#F5F5F5",
          }}
        >
          📋 Past Results
        </h1>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-lg text-xs cursor-pointer"
            style={{
              background: confirmClear ? "rgba(255,107,107,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${confirmClear ? "rgba(255,107,107,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: confirmClear ? "#FF6B6B" : "#555",
              fontFamily: "'Space Mono', monospace",
              transition: "all 0.2s",
            }}
          >
            {confirmClear ? "confirm clear" : "clear all"}
          </button>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-20 gap-4"
          >
            <span style={{ fontSize: "4rem" }}>🕳️</span>
            <h2
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "#F5F5F5",
              }}
            >
              Nothing here yet
            </h2>
            <p style={{ color: "#555", fontSize: "0.9rem" }}>
              Take the quiz to see your results here.
            </p>
            <button
              onClick={onBack}
              className="mt-4 px-6 py-3 rounded-2xl cursor-pointer"
              style={{
                background: "#FF6B6B",
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "1rem",
                fontWeight: 700,
                color: "#0D0D0D",
              }}
            >
              Take the quiz →
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            <p
              style={{
                color: "#444",
                fontSize: "0.65rem",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              {history.length} DIAGNOSTIC RECORD{history.length !== 1 ? "S" : ""} FOUND
            </p>
            <AnimatePresence>
              {history.map((result, i) => (
                <motion.button
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ scale: 1.02, rotate: 0.3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onViewResult(result)}
                  className="w-full text-left rounded-2xl p-4 cursor-pointer flex items-center gap-4"
                  style={{
                    background: "#1A1A1A",
                    border: `2px solid ${result.archetype.color}35`,
                  }}
                >
                  {/* Emoji + Score */}
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-0.5"
                    style={{ background: `${result.archetype.color}18`, border: `1.5px solid ${result.archetype.color}30` }}
                  >
                    <span style={{ fontSize: "1.3rem" }}>{result.archetype.emoji}</span>
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        color: result.archetype.color,
                      }}
                    >
                      {result.score}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        fontFamily: "'Fredoka', sans-serif",
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: "#F5F5F5",
                        marginBottom: 2,
                      }}
                    >
                      {result.archetype.name}
                    </p>
                    <p style={{ color: "#555", fontSize: "0.72rem", fontFamily: "'Space Mono', monospace" }}>
                      {result.date}
                    </p>
                    <p
                      className="truncate mt-1"
                      style={{ color: "#666", fontSize: "0.78rem" }}
                    >
                      {result.archetype.warning}
                    </p>
                  </div>

                  {/* Arrow */}
                  <span style={{ color: "#333", fontSize: "1.2rem", flexShrink: 0 }}>›</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
