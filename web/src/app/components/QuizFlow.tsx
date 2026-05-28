import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { QUESTIONS, type Answer } from "../data/quizData";

interface QuizFlowProps {
  onComplete: (answers: number[]) => void;
  onBack: () => void;
}

const PROGRESS_COLORS = [
  "#FF6B6B", "#FFE66D", "#6BCB77", "#4D96FF", "#B983FF",
  "#FF6B6B", "#FFE66D", "#6BCB77", "#4D96FF", "#B983FF",
];

export function QuizFlow({ onComplete, onBack }: QuizFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const question = QUESTIONS[currentIndex];
  const progressPercent = Math.round((currentIndex / QUESTIONS.length) * 100);

  const handleSelectAnswer = (answer: Answer, answerIndex: number) => {
    if (isTransitioning) return;
    setSelectedAnswer(answerIndex);
    setIsTransitioning(true);

    setTimeout(() => {
      const newAnswers = [...answers, answer.cookedness];
      if (currentIndex === QUESTIONS.length - 1) {
        onComplete(newAnswers);
      } else {
        setTimeout(() => {
          setCurrentIndex((i) => i + 1);
          setSelectedAnswer(null);
          setIsTransitioning(false);
        }, 350);
      }
    }, 400);
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      onBack();
    } else {
      setCurrentIndex((i) => i - 1);
      setAnswers((a) => a.slice(0, -1));
      setSelectedAnswer(null);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Progress bar row */}
      <div className="relative z-20 px-4 pt-4 pb-2">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#888",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ← back
          </button>
          <div className="flex-1 flex gap-1">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: i < currentIndex ? "100%" : i === currentIndex ? "50%" : "0%",
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{ background: PROGRESS_COLORS[i] }}
                />
              </div>
            ))}
          </div>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.7rem",
              color: "#555",
              minWidth: 40,
              textAlign: "right",
            }}
          >
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Question number + icon */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="max-w-2xl w-full mx-auto flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 60, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -60, rotate: -2 }}
              transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {/* Question card */}
              <div
                className="relative rounded-3xl p-6 sm:p-8 mb-6 overflow-hidden"
                style={{
                  background: "#1A1A1A",
                  border: `3px solid ${question.color}`,
                  boxShadow: `0 0 40px ${question.color}20, 6px 6px 0px ${question.color}40`,
                }}
              >
                {/* Corner decoration */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10"
                  style={{ background: question.color }}
                />

                {/* Q number badge */}
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm"
                    style={{
                      background: `${question.color}25`,
                      border: `1.5px solid ${question.color}60`,
                      color: question.color,
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    {currentIndex + 1}
                  </span>
                  <span style={{ color: "#555", fontSize: "0.75rem", fontFamily: "'Space Mono', monospace" }}>
                    of {QUESTIONS.length}
                  </span>
                </div>

                {/* Emoji */}
                <div className="text-5xl mb-4">{question.emoji}</div>

                {/* Question text */}
                <h2
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontSize: "clamp(1.4rem, 4vw, 2rem)",
                    fontWeight: 700,
                    color: "#F5F5F5",
                    lineHeight: 1.25,
                  }}
                >
                  {question.text}
                </h2>
              </div>

              {/* Answer cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.answers.map((answer, i) => {
                  const answerColors = ["#FF6B6B", "#FFE66D", "#6BCB77", "#B983FF"];
                  const color = answerColors[i];
                  const isSelected = selectedAnswer === i;

                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleSelectAnswer(answer, i)}
                      disabled={isTransitioning}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.3 }}
                      whileHover={!isTransitioning ? { scale: 1.03, rotate: i % 2 === 0 ? -0.8 : 0.8 } : {}}
                      whileTap={!isTransitioning ? { scale: 0.97 } : {}}
                      className="relative text-left rounded-2xl p-4 cursor-pointer transition-all overflow-hidden"
                      style={{
                        background: isSelected ? `${color}22` : "#1A1A1A",
                        border: `2px solid ${isSelected ? color : "rgba(255,255,255,0.1)"}`,
                        boxShadow: isSelected ? `0 0 24px ${color}30, 3px 3px 0px ${color}50` : "none",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{ background: `${color}08` }}
                        />
                      )}
                      <span className="text-2xl block mb-2">{answer.emoji}</span>
                      <span
                        className="relative text-sm sm:text-base leading-snug"
                        style={{
                          color: isSelected ? color : "#D0D0D0",
                          fontWeight: isSelected ? 700 : 400,
                        }}
                      >
                        {answer.text}
                      </span>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                          style={{ background: color, color: "#0D0D0D", fontWeight: 700 }}
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Fun quip at bottom */}
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
            style={{ color: "#333", fontSize: "0.72rem", fontFamily: "'Space Mono', monospace" }}
          >
            {[
              "there are no wrong answers (there are wrong answers)",
              "be honest. we already know.",
              "your results are judging you gently",
              "the algorithm feels things",
              "no going back (there is going back)",
              "your brain is being scanned rn",
              "certified diagnostic technology",
              "we see you. we don't judge. (we judge a little)",
              "science is happening",
              "your therapist would be so interested in this",
            ][currentIndex]}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
