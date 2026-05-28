import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  calculateScore,
  calculateStats,
  getArchetype,
  type QuizResult,
} from "./data/quizData";
import { LandingPage } from "./components/LandingPage";
import { QuizFlow } from "./components/QuizFlow";
import { LoadingScreen } from "./components/LoadingScreen";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { HistoryScreen } from "./components/HistoryScreen";

type Screen = "landing" | "quiz" | "loading" | "results" | "history";

const HISTORY_KEY = "hcay_history";

function loadHistory(): QuizResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: QuizResult[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    /* ignore */
  }
}

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [pendingAnswers, setPendingAnswers] = useState<number[]>([]);
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);
  const [history, setHistory] = useState<QuizResult[]>(loadHistory);

  const handleStartQuiz = () => {
    setPendingAnswers([]);
    setScreen("quiz");
  };

  const handleQuizComplete = (answers: number[]) => {
    setPendingAnswers(answers);
    setScreen("loading");
  };

  const handleLoadingComplete = () => {
    const score = calculateScore(pendingAnswers);
    const archetype = getArchetype(score);
    const stats = calculateStats(score, pendingAnswers);

    const result: QuizResult = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      score,
      archetype,
      stats,
      answers: pendingAnswers,
    };

    setCurrentResult(result);
    const newHistory = [result, ...history].slice(0, 20);
    setHistory(newHistory);
    saveHistory(newHistory);
    setScreen("results");
  };

  const handleRetry = () => {
    setScreen("landing");
    setCurrentResult(null);
  };

  const handleViewHistory = () => {
    setScreen("history");
  };

  const handleViewHistoryResult = (result: QuizResult) => {
    setCurrentResult(result);
    setScreen("results");
  };

  const handleClearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  return (
    <div
      className="size-full"
      style={{
        background: "#0D0D0D",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <AnimatePresence mode="wait">
        {screen === "landing" && (
          <motion.div key="landing" {...PAGE_TRANSITION} className="min-h-full">
            <LandingPage
              onStart={handleStartQuiz}
              onHistory={handleViewHistory}
              historyCount={history.length}
            />
          </motion.div>
        )}

        {screen === "quiz" && (
          <motion.div key="quiz" {...PAGE_TRANSITION} className="min-h-full">
            <QuizFlow
              onComplete={handleQuizComplete}
              onBack={() => setScreen("landing")}
            />
          </motion.div>
        )}

        {screen === "loading" && (
          <motion.div key="loading" {...PAGE_TRANSITION} className="min-h-full">
            <LoadingScreen onComplete={handleLoadingComplete} />
          </motion.div>
        )}

        {screen === "results" && currentResult && (
          <motion.div key="results" {...PAGE_TRANSITION} className="min-h-full">
            <ResultsDashboard
              result={currentResult}
              onRetry={handleRetry}
              onHistory={handleViewHistory}
            />
          </motion.div>
        )}

        {screen === "history" && (
          <motion.div key="history" {...PAGE_TRANSITION} className="min-h-full">
            <HistoryScreen
              history={history}
              onBack={() => setScreen(currentResult ? "results" : "landing")}
              onViewResult={handleViewHistoryResult}
              onClearHistory={handleClearHistory}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
