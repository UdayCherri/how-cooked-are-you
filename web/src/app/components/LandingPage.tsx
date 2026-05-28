import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { FloatingStickers } from "./FloatingStickers";

interface LandingPageProps {
  onStart: () => void;
  onHistory: () => void;
  historyCount: number;
  questionCount: number;
  noticeMsg?: string | null;
  onDismissNotice?: () => void;
}

const TICKER_ITEMS = [
  "3,247,891 brains analyzed",
  "0 therapists consulted",
  "5 unique personality types",
  "100% scientifically dubious",
  "Results may cause existential clarity",
  "No refunds on self-awareness",
];

const WARNING_MESSAGES = [
  "⚠️ SYSTEM ALERT: This quiz may cause sudden self-awareness. Proceed with caution.",
  "⚠️ WARNING: Side effects include existential dread and/or unsettling clarity.",
  "⚠️ NOTICE: The algorithm knows. It has always known.",
];

export function LandingPage({
  onStart,
  onHistory,
  historyCount,
  questionCount,
  noticeMsg,
  onDismissNotice,
}: LandingPageProps) {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [warningIndex, setWarningIndex] = useState(0);
  const [btnHover, setBtnHover] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((i) => (i + 1) % TICKER_ITEMS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWarningIndex((i) => (i + 1) % WARNING_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{ background: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}
    >
      <FloatingStickers count={20} />

      {noticeMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="relative z-30 w-full px-4 py-2 flex items-center justify-center gap-2"
          style={{
            background: "rgba(255,107,107,0.12)",
            borderBottom: "1px solid rgba(255,107,107,0.25)",
          }}
        >
          <span
            style={{
              color: "#FF6B6B",
              fontSize: "0.72rem",
              fontFamily: "'Space Mono', monospace",
              textAlign: "center",
            }}
          >
            ⚠ {noticeMsg}
          </span>
          {onDismissNotice && (
            <button
              onClick={onDismissNotice}
              aria-label="dismiss"
              className="px-2 cursor-pointer"
              style={{
                color: "#FF6B6B",
                background: "transparent",
                border: "none",
                fontSize: "0.85rem",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              ×
            </button>
          )}
        </motion.div>
      )}

      {/* Fake warning banner */}
      <div
        className="relative z-20 w-full px-4 py-2.5 flex items-center justify-center gap-2 overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #FF6B6B 0%, #B983FF 50%, #FF6B6B 100%)",
          backgroundSize: "200% 100%",
        }}
      >
        <motion.div
          className="text-xs font-mono text-black text-center"
          style={{ fontFamily: "'Space Mono', monospace" }}
          key={warningIndex}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
        >
          {WARNING_MESSAGES[warningIndex]}
        </motion.div>
      </div>

      {/* Noise grid overlay for texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(185,131,255,0.06) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(255,107,107,0.06) 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, rgba(77,150,255,0.04) 0%, transparent 70%)`,
          zIndex: 1,
        }}
      />

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mb-8"
          style={{
            background: "rgba(255,230,109,0.12)",
            border: "1px solid rgba(255,230,109,0.35)",
            color: "#FFE66D",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: "#FFE66D" }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ background: "#FFE66D" }}
            />
          </span>
          DIAGNOSTIC TOOL v4.2.0 — FULLY OPERATIONAL
        </motion.div>

        {/* Hero title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-4"
        >
          <h1
            className="block leading-none"
            style={{
              fontFamily: "'Fredoka', sans-serif",
              fontSize: "clamp(3.5rem, 14vw, 9rem)",
              fontWeight: 700,
              background: "linear-gradient(135deg, #FF6B6B 0%, #B983FF 40%, #4D96FF 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 0.95,
            }}
          >
            HOW
          </h1>
          <h1
            className="block"
            style={{
              fontFamily: "'Fredoka', sans-serif",
              fontSize: "clamp(3.5rem, 14vw, 9rem)",
              fontWeight: 700,
              color: "#FFE66D",
              lineHeight: 0.95,
            }}
          >
            COOKED
          </h1>
          <div className="flex items-center justify-center gap-3 mt-2">
            <span
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "clamp(2.5rem, 10vw, 7rem)",
                fontWeight: 700,
                color: "#F5F5F5",
                lineHeight: 1,
              }}
            >
              ARE
            </span>
            <span
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "clamp(2.5rem, 10vw, 7rem)",
                fontWeight: 700,
                background: "linear-gradient(135deg, #6BCB77, #4D96FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1,
              }}
            >
              YOU?
            </span>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="max-w-lg mb-10"
          style={{
            color: "#888888",
            fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
            lineHeight: 1.6,
          }}
        >
          A deeply scientific personality assessment based on absolutely nothing.
          <br />
          <span style={{ color: "#B983FF" }}>{questionCount || 30} questions.</span>{" "}
          <span style={{ color: "#FF6B6B" }}>Devastating accuracy.</span>{" "}
          <span style={{ color: "#6BCB77" }}>Zero chill.</span>
        </motion.p>

        {/* CTA button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05, rotate: -1 }}
          whileTap={{ scale: 0.96, rotate: 1 }}
          onClick={onStart}
          onHoverStart={() => setBtnHover(true)}
          onHoverEnd={() => setBtnHover(false)}
          className="relative px-10 py-5 rounded-2xl cursor-pointer mb-4 overflow-hidden"
          style={{
            background: "#FF6B6B",
            border: "3px solid #FF6B6B",
            fontFamily: "'Fredoka', sans-serif",
            fontSize: "clamp(1.3rem, 3.5vw, 1.7rem)",
            fontWeight: 700,
            color: "#0D0D0D",
            letterSpacing: "0.01em",
            boxShadow: btnHover
              ? "0 0 40px rgba(255,107,107,0.5), 6px 6px 0px #B983FF"
              : "4px 4px 0px #B983FF",
            transition: "box-shadow 0.2s ease",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={btnHover ? "hover" : "normal"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              {btnHover ? "let's find out 🔥" : "START ASSESSMENT →"}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ color: "#555", fontSize: "0.78rem", fontFamily: "'Space Mono', monospace" }}
        >
          takes ~2 minutes · no email required · your data is none of our business
        </motion.p>

        {/* Stats ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-14 flex items-center gap-3 px-5 py-3 rounded-full overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            maxWidth: 380,
          }}
        >
          <span style={{ color: "#555", fontSize: "0.7rem", fontFamily: "'Space Mono', monospace", whiteSpace: "nowrap" }}>
            LIVE:
          </span>
          <div className="overflow-hidden" style={{ height: "1.2rem" }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={tickerIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="block"
                style={{
                  fontSize: "0.78rem",
                  fontFamily: "'Space Mono', monospace",
                  color: "#FFE66D",
                  whiteSpace: "nowrap",
                }}
              >
                {TICKER_ITEMS[tickerIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Archetype preview pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-10 flex flex-wrap gap-2 justify-center max-w-xl"
        >
          {[
            { label: "🕵️ Suspiciously Normal", color: "#6BCB77" },
            { label: "🍞 Slightly Toasted", color: "#FFE66D" },
            { label: "🥩 Medium Well", color: "#4D96FF" },
            { label: "🔥 Well Done", color: "#FF6B6B" },
            { label: "💀 FULLY COOKED™", color: "#B983FF" },
          ].map((a) => (
            <span
              key={a.label}
              className="px-3 py-1.5 rounded-full text-xs"
              style={{
                background: `${a.color}18`,
                border: `1px solid ${a.color}40`,
                color: a.color,
                fontFamily: "'Space Mono', monospace",
              }}
            >
              {a.label}
            </span>
          ))}
        </motion.div>

        {/* History button */}
        {historyCount > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            onClick={onHistory}
            className="mt-6 px-4 py-2 rounded-xl text-sm cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#888",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            📋 View past results ({historyCount})
          </motion.button>
        )}
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 text-center py-4 px-4"
        style={{ color: "#333", fontSize: "0.7rem", fontFamily: "'Space Mono', monospace" }}
      >
        not liable for any existential crises · made with chronic online energy
      </footer>
    </div>
  );
}
