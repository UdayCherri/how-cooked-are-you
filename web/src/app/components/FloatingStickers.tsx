import { motion } from "motion/react";
import { useEffect, useState } from "react";

const STICKERS = [
  "🧠", "💀", "🍳", "🔥", "📱", "⚡", "🌙", "✨",
  "😭", "💅", "🤡", "👁️", "🫠", "🌀", "💻", "🎭",
  "🫶", "💔", "🐀", "🌈", "👻", "🔗", "🕳️", "🎪",
];

interface Sticker {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  duration: number;
  delay: number;
  fontSize: number;
}

export function FloatingStickers({ count = 18 }: { count?: number }) {
  const [stickers, setStickers] = useState<Sticker[]>([]);

  useEffect(() => {
    const generated: Sticker[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: STICKERS[i % STICKERS.length],
      x: 2 + (i / count) * 96 + (Math.sin(i * 2.3) * 8),
      y: 2 + Math.random() * 92,
      rotation: Math.random() * 40 - 20,
      scale: 0.7 + Math.random() * 0.9,
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 4,
      fontSize: 20 + Math.random() * 20,
    }));
    setStickers(generated);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {stickers.map((s) => (
        <motion.div
          key={s.id}
          className="absolute select-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.fontSize}px`,
            rotate: s.rotation,
            opacity: 0.08,
          }}
          animate={{
            y: [0, -18, 4, -12, 0],
            rotate: [s.rotation, s.rotation + 10, s.rotation - 6, s.rotation + 4, s.rotation],
            opacity: [0.06, 0.14, 0.08, 0.12, 0.06],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {s.emoji}
        </motion.div>
      ))}
    </div>
  );
}
