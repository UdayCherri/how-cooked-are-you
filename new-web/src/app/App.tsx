import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { GameResult } from "./data/gameData";
import { LandingScreen } from "./components/LandingScreen";
import { SessionScreen } from "./components/SessionScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { HistoryScreen } from "./components/HistoryScreen";

type Screen = "landing" | "session" | "results" | "history";

const HISTORY_KEY = "hcay_v2_history";

function loadHistory(): GameResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: GameResult[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch { /* ignore */ }
}

const TRANSITION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25 },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [currentResult, setCurrentResult] = useState<GameResult | null>(null);
  const [history, setHistory] = useState<GameResult[]>(loadHistory);

  const handleSessionComplete = (result: GameResult) => {
    setCurrentResult(result);
    const newHistory = [result, ...history].slice(0, 30);
    setHistory(newHistory);
    saveHistory(newHistory);
    setScreen("results");
  };

  const handleRetry = () => {
    setCurrentResult(null);
    setScreen("landing");
  };

  const handleViewHistoryResult = (result: GameResult) => {
    setCurrentResult(result);
    setScreen("results");
  };

  const handleClearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  return (
    <>
      {/* Global styles for typewriter cursor blink */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1A1A1A; }
      `}</style>

      <div
        className="size-full"
        style={{ background: "#080808", overflowY: "auto", overflowX: "hidden" }}
      >
        <AnimatePresence mode="wait">
          {screen === "landing" && (
            <motion.div key="landing" {...TRANSITION} className="min-h-full">
              <LandingScreen
                onStart={() => setScreen("session")}
                onHistory={() => setScreen("history")}
                historyCount={history.length}
              />
            </motion.div>
          )}

          {screen === "session" && (
            <motion.div key="session" {...TRANSITION} className="min-h-full">
              <SessionScreen onComplete={handleSessionComplete} />
            </motion.div>
          )}

          {screen === "results" && currentResult && (
            <motion.div key="results" {...TRANSITION} className="min-h-full">
              <ResultsScreen
                result={currentResult}
                onRetry={handleRetry}
                onHistory={() => setScreen("history")}
              />
            </motion.div>
          )}

          {screen === "history" && (
            <motion.div key="history" {...TRANSITION} className="min-h-full">
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
    </>
  );
}
