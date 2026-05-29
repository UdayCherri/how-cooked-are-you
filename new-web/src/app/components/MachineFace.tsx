import { motion, AnimatePresence } from "motion/react";
import type { Expression } from "../data/gameData";

const FACES: Record<Expression, { eyes: string; mouth: string }> = {
  neutral:    { eyes: "◉   ◉", mouth: "─────" },
  suspicious: { eyes: "▼   ▼", mouth: "─────" },
  shocked:    { eyes: "◎   ◎", mouth: "─────" },
  amused:     { eyes: "^   ^", mouth: "‿────" },
  glitching:  { eyes: "▓   ▓", mouth: "█████" },
  judging:    { eyes: "⊙   ⊙", mouth: "─────" },
  concerned:  { eyes: "◔   ◔", mouth: "──╮──" },
};

const BORDER_COLORS: Record<Expression, string> = {
  neutral:    "#B983FF",
  suspicious: "#FFE66D",
  shocked:    "#FF6B6B",
  amused:     "#6BCB77",
  glitching:  "#FF6B6B",
  judging:    "#B983FF",
  concerned:  "#4D96FF",
};

interface MachineFaceProps {
  expression: Expression;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function MachineFace({ expression, size = "md", label }: MachineFaceProps) {
  const face = FACES[expression];
  const color = BORDER_COLORS[expression];
  const isGlitching = expression === "glitching";

  const sizeMap = {
    sm: { outer: 64, inner: 44, eyeSize: "0.7rem", mouthSize: "0.55rem", padding: 8 },
    md: { outer: 88, inner: 60, eyeSize: "0.9rem", mouthSize: "0.72rem", padding: 10 },
    lg: { outer: 112, inner: 76, eyeSize: "1.1rem", mouthSize: "0.88rem", padding: 12 },
  };
  const s = sizeMap[size];

  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.div
        animate={
          isGlitching
            ? { x: [0, -3, 3, -2, 2, 0], opacity: [1, 0.6, 1, 0.8, 1] }
            : { x: 0, opacity: 1 }
        }
        transition={
          isGlitching
            ? { duration: 0.4, repeat: Infinity, repeatDelay: 0.6 }
            : {}
        }
        style={{
          width: s.outer,
          height: s.outer,
          border: `2px solid ${color}`,
          boxShadow: `3px 3px 0 0 ${color}60, 0 0 20px ${color}20`,
          background: "#080808",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {/* Corner ornaments */}
        <span
          style={{
            position: "absolute",
            top: 3,
            left: 4,
            fontSize: "0.45rem",
            color: `${color}80`,
            fontFamily: "'Space Mono', monospace",
            lineHeight: 1,
          }}
        >
          ┌
        </span>
        <span
          style={{
            position: "absolute",
            top: 3,
            right: 4,
            fontSize: "0.45rem",
            color: `${color}80`,
            fontFamily: "'Space Mono', monospace",
            lineHeight: 1,
          }}
        >
          ┐
        </span>
        <span
          style={{
            position: "absolute",
            bottom: 3,
            left: 4,
            fontSize: "0.45rem",
            color: `${color}80`,
            fontFamily: "'Space Mono', monospace",
            lineHeight: 1,
          }}
        >
          └
        </span>
        <span
          style={{
            position: "absolute",
            bottom: 3,
            right: 4,
            fontSize: "0.45rem",
            color: `${color}80`,
            fontFamily: "'Space Mono', monospace",
            lineHeight: 1,
          }}
        >
          ┘
        </span>

        {/* Face */}
        <div
          style={{
            width: s.inner,
            height: s.inner,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            background: "rgba(0,0,0,0.6)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`eyes-${expression}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: s.eyeSize,
                color,
                letterSpacing: "0.05em",
                lineHeight: 1,
                textShadow: `0 0 8px ${color}`,
              }}
            >
              {face.eyes}
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={`mouth-${expression}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: s.mouthSize,
                color: `${color}cc`,
                letterSpacing: "0.03em",
                lineHeight: 1,
              }}
            >
              {face.mouth}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {label && (
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.55rem",
            color: `${color}80`,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
