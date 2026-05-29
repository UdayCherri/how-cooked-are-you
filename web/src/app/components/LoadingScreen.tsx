import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LOADING_MESSAGES = [
  { text: "Calculating brain rot levels...", emoji: "🧠" },
  { text: "Consulting the chronically online elders...", emoji: "👴" },
  { text: "Mapping your situationship history...", emoji: "💔" },
  { text: "Processing sleep schedule... ERROR: not found", emoji: "🔍" },
  { text: "Cross-referencing your tab count with DSM-5...", emoji: "💻" },
  { text: "Analyzing your 3 AM life decisions...", emoji: "🌙" },
  { text: "Measuring touch grass urgency...", emoji: "🌿" },
  { text: "Generating fake psychological evaluation...", emoji: "📋" },
  { text: "Preparing devastating accuracy report...", emoji: "⚡" },
  { text: "DIAGNOSIS COMPLETE. Brace yourself.", emoji: "💀" },
];

const FAKE_WARNINGS = [
  "HIGH LEVELS OF BRAIN ROT DETECTED",
  "CIRCADIAN RHYTHM: CORRUPTED",
  "PARASOCIAL BONDS: CRITICAL",
  "REALITY GRIP: LOOSENING",
  "TOUCH GRASS REQUIREMENT: OVERDUE",
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [warningIndex, setWarningIndex] = useState(0);
  const firedRef = useRef(false);

  const totalDuration = 3200;
  const messageInterval = totalDuration / LOADING_MESSAGES.length;

  useEffect(() => {
    const start = Date.now();

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(progressTimer);
        if (!firedRef.current) {
          firedRef.current = true;
          setTimeout(onComplete, 300);
        }
      }
    }, 30);

    const messageTimer = setInterval(() => {
      setMessageIndex((i) => {
        if (i >= LOADING_MESSAGES.length - 1) {
          clearInterval(messageTimer);
          return i;
        }
        return i + 1;
      });
    }, messageInterval);

    const warningTimer = setInterval(() => {
      setWarningIndex((i) => (i + 1) % FAKE_WARNINGS.length);
    }, 900);

    return () => {
      clearInterval(progressTimer);
      clearInterval(messageTimer);
      clearInterval(warningTimer);
    };
  }, [onComplete]);

  const current = LOADING_MESSAGES[messageIndex];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Pulsing glow background */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(185,131,255,0.08) 0%, transparent 70%)",
            "radial-gradient(circle at 50% 50%, rgba(255,107,107,0.1) 0%, transparent 70%)",
            "radial-gradient(circle at 50% 50%, rgba(77,150,255,0.08) 0%, transparent 70%)",
            "radial-gradient(circle at 50% 50%, rgba(185,131,255,0.08) 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center gap-8">
        {/* Spinning brain */}
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: "4rem" }}
        >
          🧠
        </motion.div>

        {/* Header */}
        <div>
          <motion.h2
            className="mb-2"
            style={{
              fontFamily: "'Fredoka', sans-serif",
              fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
              fontWeight: 700,
              color: "#F5F5F5",
              lineHeight: 1.1,
            }}
            animate={{ opacity: [1, 0.8, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ANALYZING YOUR SITUATION
          </motion.h2>
          <p style={{ color: "#555", fontSize: "0.8rem", fontFamily: "'Space Mono', monospace" }}>
            DO NOT CLOSE THIS TAB
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div
            className="w-full h-4 rounded-full overflow-hidden mb-2"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #FF6B6B, #B983FF, #4D96FF)",
                backgroundSize: "200% 100%",
              }}
              animate={{
                width: `${progress}%`,
                backgroundPosition: ["0% 0%", "100% 0%"],
              }}
              transition={{
                width: { duration: 0.1, ease: "linear" },
                backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" },
              }}
            />
          </div>
          <div className="flex justify-between">
            <span style={{ color: "#444", fontSize: "0.65rem", fontFamily: "'Space Mono', monospace" }}>
              brain_scan.exe
            </span>
            <span style={{ color: "#B983FF", fontSize: "0.65rem", fontFamily: "'Space Mono', monospace" }}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Cycling message */}
        <div
          className="w-full rounded-2xl p-4 flex items-center gap-3"
          style={{
            background: "#1A1A1A",
            border: "1px solid rgba(255,255,255,0.08)",
            minHeight: 72,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 w-full"
            >
              <span className="text-2xl flex-shrink-0">{current.emoji}</span>
              <span
                style={{
                  color: "#C0C0C0",
                  fontSize: "0.9rem",
                  fontFamily: "'Space Mono', monospace",
                  textAlign: "left",
                }}
              >
                {current.text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Fake warning ticker */}
        <div
          className="w-full overflow-hidden rounded-xl p-2.5"
          style={{
            background: "rgba(255,107,107,0.1)",
            border: "1px solid rgba(255,107,107,0.25)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={warningIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              style={{
                color: "#FF6B6B",
                fontSize: "0.65rem",
                fontFamily: "'Space Mono', monospace",
                textAlign: "center",
              }}
            >
              ⚠ {FAKE_WARNINGS[warningIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Bouncing dots */}
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: ["#FF6B6B", "#FFE66D", "#6BCB77", "#4D96FF", "#B983FF"][i] }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
