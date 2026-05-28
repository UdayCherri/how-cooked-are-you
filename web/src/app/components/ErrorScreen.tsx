import { motion } from "motion/react";

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

export function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        style={{ fontSize: "4rem" }}
      >
        🍳💥
      </motion.div>
      <h1
        className="mt-6"
        style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
          fontWeight: 700,
          color: "#F5F5F5",
          lineHeight: 1.1,
        }}
      >
        Something is unusually cooked.
      </h1>
      <p
        className="mt-3 max-w-md"
        style={{
          color: "#888",
          fontSize: "0.9rem",
          lineHeight: 1.5,
        }}
      >
        {message || "We hit a snag talking to the server. The vibes are off."}
      </p>
      <motion.button
        whileHover={{ scale: 1.04, rotate: -1 }}
        whileTap={{ scale: 0.96 }}
        onClick={onRetry}
        className="mt-8 px-7 py-3.5 rounded-2xl cursor-pointer"
        style={{
          background: "#FF6B6B",
          border: "3px solid #FF6B6B",
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "1.05rem",
          fontWeight: 700,
          color: "#0D0D0D",
          boxShadow: "4px 4px 0px #B983FF",
        }}
      >
        try again →
      </motion.button>
      <p
        className="mt-6"
        style={{ color: "#444", fontSize: "0.7rem", fontFamily: "'Space Mono', monospace" }}
      >
        if this keeps happening, the kitchen may need a hard reload
      </p>
    </div>
  );
}
