import { motion } from "motion/react";

export function BootScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{ fontSize: "3rem" }}
      >
        🍳
      </motion.div>
      <p
        className="mt-6"
        style={{
          color: "#888",
          fontSize: "0.85rem",
          fontFamily: "'Space Mono', monospace",
        }}
      >
        warming up the diagnostic kitchen…
      </p>
      <div className="mt-4 flex gap-1.5">
        {["#FF6B6B", "#FFE66D", "#6BCB77", "#4D96FF", "#B983FF"].map((c, i) => (
          <motion.div
            key={c}
            className="w-2 h-2 rounded-full"
            style={{ background: c }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.7, delay: i * 0.1, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}
