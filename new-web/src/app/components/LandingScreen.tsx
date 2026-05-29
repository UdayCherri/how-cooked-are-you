import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { MachineFace } from "./MachineFace";

interface LandingScreenProps {
  onStart: () => void;
  onHistory: () => void;
  historyCount: number;
}

const BOOT_LINES = [
  "DIAGNOSTIC SYSTEMS............. ONLINE",
  "SUBJECT DETECTION MODULE........ ACTIVE",
  "BRAIN ROT SCANNER.............. CALIBRATING",
  "EMPATHY MODULES................ DISABLED",
  "JUDGMENT ENGINE................. ENABLED",
  "EVIDENCE BOARD.................. READY",
  "─────────────────────────────────────────",
  "READY.",
];

export function LandingScreen({ onStart, onHistory, historyCount }: LandingScreenProps) {
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [phase, setPhase] = useState<"booting" | "ready">("booting");
  const [hoverBtn, setHoverBtn] = useState(false);

  useEffect(() => {
    let i = 0;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const addLine = () => {
      if (cancelled) return;
      if (i >= BOOT_LINES.length) {
        timer = setTimeout(() => { if (!cancelled) setPhase("ready"); }, 500);
        return;
      }
      const line = BOOT_LINES[i];
      const isLast = i === BOOT_LINES.length - 1;
      i++;
      setBootLines((prev) => [...prev, line]);
      timer = setTimeout(addLine, isLast ? 400 : 160);
    };
    setBootLines([]);
    setPhase("booting");
    timer = setTimeout(addLine, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 3px)",
          zIndex: 0,
        }}
      />

      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(185,131,255,0.06) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center gap-8">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              color: "#B983FF",
              marginBottom: 8,
            }}
          >
            UNIT Ω — PERSONALITY DIAGNOSTIC
          </p>
          <h1
            style={{
              fontFamily: "'Fredoka', sans-serif",
              fontSize: "clamp(2.4rem, 10vw, 4.2rem)",
              fontWeight: 700,
              color: "#F0F0F0",
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            How Cooked
          </h1>
          <h1
            style={{
              fontFamily: "'Fredoka', sans-serif",
              fontSize: "clamp(2.4rem, 10vw, 4.2rem)",
              fontWeight: 700,
              color: "#B983FF",
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            Are You?
          </h1>
        </motion.div>

        {/* Boot terminal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full"
          style={{
            background: "#0C0C0C",
            border: "2px solid #1E1E1E",
            boxShadow: "3px 3px 0 0 #1E1E1E",
          }}
        >
          {/* Terminal header */}
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{ borderBottom: "1px solid #1A1A1A", background: "#111" }}
          >
            <div className="flex gap-1.5">
              {["#FF6B6B", "#FFE66D", "#6BCB77"].map((c) => (
                <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.6rem",
                color: "#444",
                letterSpacing: "0.1em",
              }}
            >
              diagnostic.exe
            </span>
          </div>

          {/* Boot output */}
          <div className="p-4" style={{ minHeight: 180 }}>
            {bootLines.filter((line): line is string => typeof line === "string").map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.68rem",
                  color: line === "READY." ? "#6BCB77" : line.startsWith("─") ? "#222" : "#666",
                  lineHeight: 1.8,
                  letterSpacing: "0.04em",
                }}
              >
                {line === "READY." ? (
                  <span style={{ color: "#6BCB77" }}>
                    &gt; READY.
                  </span>
                ) : (
                  `> ${line}`
                )}
              </motion.p>
            ))}
            {phase === "booting" && (
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.7rem",
                  color: "#B983FF",
                  animation: "blink 0.8s step-end infinite",
                }}
              >
                ▮
              </span>
            )}
          </div>
        </motion.div>

        {/* Machine reveal + CTA */}
        <AnimatePresence>
          {phase === "ready" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center gap-6"
            >
              {/* Machine with intro dialogue */}
              <div
                className="w-full flex items-start gap-4 p-4"
                style={{
                  background: "#0C0C0C",
                  border: "2px solid #B983FF40",
                  boxShadow: "3px 3px 0 0 #B983FF30",
                }}
              >
                <MachineFace expression="neutral" size="md" />
                <div className="flex-1 min-w-0 pt-1">
                  <p
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.62rem",
                      color: "#B983FF",
                      letterSpacing: "0.1em",
                      marginBottom: 6,
                    }}
                  >
                    THE MACHINE
                  </p>
                  <p
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.78rem",
                      color: "#C0C0C0",
                      lineHeight: 1.7,
                    }}
                  >
                    Subject detected.{" "}
                    <span style={{ color: "#B983FF" }}>Initiating diagnostic protocol.</span>
                    <br />
                    This will take approximately 5 minutes.
                    <br />
                    The machine has questions.
                    <br />
                    <span style={{ color: "#666" }}>
                      It always has questions.
                    </span>
                  </p>
                </div>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97, rotate: -0.5 }}
                onHoverStart={() => setHoverBtn(true)}
                onHoverEnd={() => setHoverBtn(false)}
                onClick={onStart}
                className="w-full py-5 cursor-pointer relative overflow-hidden"
                style={{
                  background: hoverBtn ? "#B983FF" : "#0C0C0C",
                  border: "2px solid #B983FF",
                  boxShadow: hoverBtn
                    ? "4px 4px 0 0 #7B3FFF, 0 0 30px rgba(185,131,255,0.3)"
                    : "4px 4px 0 0 #7B3FFF40",
                  fontFamily: "'Fredoka', sans-serif",
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: hoverBtn ? "#080808" : "#B983FF",
                  letterSpacing: "0.02em",
                  transition: "all 0.15s ease",
                }}
              >
                {hoverBtn ? "I'm ready (I'm not ready)" : "BEGIN DIAGNOSTIC →"}
              </motion.button>

              {/* Sub-links */}
              <div className="flex items-center gap-6">
                {historyCount > 0 && (
                  <button
                    onClick={onHistory}
                    className="cursor-pointer"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.62rem",
                      color: "#444",
                      letterSpacing: "0.08em",
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                      background: "none",
                      border: "none",
                    }}
                  >
                    past sessions ({historyCount})
                  </button>
                )}
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.6rem",
                    color: "#333",
                    letterSpacing: "0.06em",
                  }}
                >
                  ~5 min · no data stored · the machine knows anyway
                </span>
              </div>

              {/* Archetype teaser */}
              <div className="w-full flex flex-col gap-2">
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.55rem",
                    color: "#333",
                    letterSpacing: "0.12em",
                    textAlign: "center",
                  }}
                >
                  KNOWN SUBJECT CLASSIFICATIONS
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    { label: "🕵️ Suspiciously Normal", color: "#6BCB77" },
                    { label: "🍞 Slightly Toasted", color: "#FFE66D" },
                    { label: "🥩 Medium Well", color: "#4D96FF" },
                    { label: "🔥 Well Done", color: "#FF6B6B" },
                    { label: "💀 FULLY COOKED™", color: "#B983FF" },
                  ].map((a) => (
                    <span
                      key={a.label}
                      className="px-2.5 py-1"
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.6rem",
                        color: a.color,
                        background: `${a.color}12`,
                        border: `1px solid ${a.color}35`,
                      }}
                    >
                      {a.label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
