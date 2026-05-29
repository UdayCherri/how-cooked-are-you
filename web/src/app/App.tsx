import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GameResult } from "./data/gameData";
import {
  ApiError,
  analyzeQuiz,
  fetchQuestions,
  fetchResultById,
  type ApiQuestion,
} from "./lib/api";
import { buildResultFromApi, toBackendAnswers } from "./lib/adapt";
import { LandingScreen } from "./components/LandingScreen";
import { SessionScreen } from "./components/SessionScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { HistoryScreen } from "./components/HistoryScreen";
import { BattleScreen } from "./components/BattleScreen";
import { MachineFace } from "./components/MachineFace";

type Screen =
  | "boot"
  | "landing"
  | "session"
  | "analyzing"
  | "results"
  | "history"
  | "battle"
  | "error";

const HISTORY_KEY = "hcay_v2_history";
const HISTORY_LIMIT = 30;

function loadHistory(): GameResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as GameResult[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: GameResult[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    /* quota / private mode — fine */
  }
}

function getSharedId(): string | null {
  if (typeof window === "undefined") return null;
  const m = window.location.pathname.match(/^\/r\/([A-Za-z0-9_-]{4,64})\/?$/);
  return m ? m[1]! : null;
}

const TRANSITION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25 },
};

// ── Small full-screen status views, in the machine's monospace aesthetic ──────
function StatusView({
  expression,
  title,
  lines,
  accent,
  action,
}: {
  expression: "neutral" | "glitching" | "judging" | "concerned" | "shocked";
  title: string;
  lines: string[];
  accent: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6"
      style={{ background: "#080808", fontFamily: "'DM Sans', sans-serif" }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <MachineFace expression={expression} size="lg" />
      <div className="relative z-10 flex flex-col items-center gap-2 max-w-sm">
        <h2
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: "1.4rem",
            fontWeight: 700,
            color: accent,
          }}
        >
          {title}
        </h2>
        {lines.map((l, i) => (
          <p
            key={i}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.72rem",
              color: "#777",
              lineHeight: 1.7,
            }}
          >
            {l}
          </p>
        ))}
      </div>
      {action && (
        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.97 }}
          onClick={action.onClick}
          className="relative z-10 px-6 py-3 cursor-pointer"
          style={{
            background: accent,
            border: `2px solid ${accent}`,
            boxShadow: `3px 3px 0 0 ${accent}40`,
            fontFamily: "'Fredoka', sans-serif",
            fontSize: "1rem",
            fontWeight: 700,
            color: "#080808",
          }}
        >
          {action.label}
        </motion.button>
      )}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("boot");
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [currentResult, setCurrentResult] = useState<GameResult | null>(null);
  const [history, setHistory] = useState<GameResult[]>(loadHistory);
  const [errorMsg, setErrorMsg] = useState("");
  const bootRan = useRef(false);

  // Boot: fetch the backend question deck + resolve any /r/:id share link.
  useEffect(() => {
    if (bootRan.current) return;
    bootRan.current = true;
    const sharedId = getSharedId();
    (async () => {
      try {
        const [{ questions: qs }, shared] = await Promise.all([
          fetchQuestions(),
          sharedId ? fetchResultById(sharedId).catch(() => null) : Promise.resolve(null),
        ]);
        setQuestions(qs);
        if (sharedId && shared) {
          setCurrentResult(buildResultFromApi(shared));
          setScreen("results");
          return;
        }
        if (sharedId && !shared) {
          window.history.replaceState(null, "", "/");
        }
        setScreen("landing");
      } catch (err) {
        setErrorMsg(err instanceof ApiError ? err.message : "could not reach the diagnostic server");
        setScreen("error");
      }
    })();
  }, []);

  // The session hands back a locally-assembled GameResult; we use only its
  // session data (answers + bespoke evidence) and let the backend judge.
  const handleSessionComplete = useCallback(
    async (local: GameResult) => {
      setScreen("analyzing");
      try {
        const answers = toBackendAnswers(local.questionAnswers, questions);
        const api = await analyzeQuiz({ answers });
        const result = buildResultFromApi(api, {
          questionAnswers: local.questionAnswers,
          evidence: local.evidence,
          bossChoiceIdx: local.bossChoiceIdx,
          bossEventId: local.bossEventId,
        });
        setCurrentResult(result);
        setHistory((prev) => {
          const next = [result, ...prev.filter((r) => r.id !== result.id)].slice(0, HISTORY_LIMIT);
          saveHistory(next);
          return next;
        });
        setScreen("results");
      } catch (err) {
        setErrorMsg(
          err instanceof ApiError ? err.message : "the diagnosis failed to transmit. try again."
        );
        setScreen("error");
      }
    },
    [questions]
  );

  const handleRetry = useCallback(() => {
    if (currentResult?.shared) {
      window.history.replaceState(null, "", "/");
    }
    setCurrentResult(null);
    setScreen("landing");
  }, [currentResult]);

  const handleViewHistoryResult = useCallback((result: GameResult) => {
    setCurrentResult(result);
    setScreen("results");
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return (
    <>
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
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
          {screen === "boot" && (
            <motion.div key="boot" {...TRANSITION} className="min-h-full">
              <StatusView
                expression="neutral"
                accent="#B983FF"
                title="BOOTING DIAGNOSTIC"
                lines={["Establishing connection to the machine…"]}
              />
            </motion.div>
          )}

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

          {screen === "analyzing" && (
            <motion.div key="analyzing" {...TRANSITION} className="min-h-full">
              <StatusView
                expression="glitching"
                accent="#B983FF"
                title="COMPILING FINAL ASSESSMENT"
                lines={[
                  "Transmitting case file to central diagnostic…",
                  "Cross-referencing the evidence board.",
                  "The verdict is being prepared.",
                ]}
              />
            </motion.div>
          )}

          {screen === "results" && currentResult && (
            <motion.div key="results" {...TRANSITION} className="min-h-full">
              <ResultsScreen
                result={currentResult}
                onRetry={handleRetry}
                onHistory={() => setScreen("history")}
                onBattle={() => setScreen("battle")}
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

          {screen === "battle" && currentResult && (
            <motion.div key="battle" {...TRANSITION} className="min-h-full">
              <BattleScreen
                current={currentResult}
                history={history}
                onBack={() => setScreen("results")}
              />
            </motion.div>
          )}

          {screen === "error" && (
            <motion.div key="error" {...TRANSITION} className="min-h-full">
              <StatusView
                expression="concerned"
                accent="#FF6B6B"
                title="DIAGNOSTIC ERROR"
                lines={[errorMsg || "something went wrong.", "the machine will reset."]}
                action={{
                  label: "↻ RESET",
                  onClick: () => {
                    if (questions.length === 0) {
                      window.location.assign("/");
                      return;
                    }
                    window.history.replaceState(null, "", "/");
                    setErrorMsg("");
                    setCurrentResult(null);
                    setScreen("landing");
                  },
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
