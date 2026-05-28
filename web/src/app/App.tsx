import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ApiError,
  analyzeQuiz,
  fetchQuestions,
  fetchResultById,
  type ApiAnswer,
  type ApiQuestion,
  type ApiResult,
} from "./lib/api";
import {
  apiResultToQuizResult,
  type QuizResult,
} from "./data/quizData";
import { LandingPage } from "./components/LandingPage";
import { QuizFlow } from "./components/QuizFlow";
import { LoadingScreen } from "./components/LoadingScreen";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { HistoryScreen } from "./components/HistoryScreen";
import { ErrorScreen } from "./components/ErrorScreen";
import { BootScreen } from "./components/BootScreen";

type Screen = "boot" | "landing" | "quiz" | "loading" | "results" | "history" | "error";

const HISTORY_KEY = "hcay_history";
const HISTORY_LIMIT = 20;

function loadHistory(): QuizResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QuizResult[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: QuizResult[]) {
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

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("boot");
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [pendingAnswers, setPendingAnswers] = useState<ApiAnswer[]>([]);
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);
  const [sharedResult, setSharedResult] = useState<boolean>(false);
  const [history, setHistory] = useState<QuizResult[]>(loadHistory);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const analyzePromiseRef = useRef<Promise<ApiResult> | null>(null);
  const bootRanRef = useRef(false);

  // Initial boot: fetch questions + handle /r/:id share link
  useEffect(() => {
    if (bootRanRef.current) return;
    bootRanRef.current = true;

    const sharedId = getSharedId();

    (async () => {
      try {
        const [{ questions: qs }, shared] = await Promise.all([
          fetchQuestions(),
          sharedId ? fetchResultById(sharedId).catch(() => null) : Promise.resolve(null),
        ]);
        setQuestions(qs);

        if (sharedId && shared) {
          setCurrentResult(apiResultToQuizResult(shared));
          setSharedResult(true);
          setScreen("results");
          return;
        }
        if (sharedId && !shared) {
          // bad share id — fall back to landing with a soft warning
          window.history.replaceState(null, "", "/");
          setErrorMsg("That share link is cooked beyond recognition. We dropped you on the home screen.");
        }
        setScreen("landing");
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : "could not reach the server";
        setErrorMsg(msg);
        setScreen("error");
      }
    })();
  }, []);

  const handleStartQuiz = useCallback(() => {
    setPendingAnswers([]);
    setSharedResult(false);
    setCurrentResult(null);
    setScreen("quiz");
  }, []);

  const handleQuizComplete = useCallback((answers: ApiAnswer[]) => {
    setPendingAnswers(answers);
    // Kick off analyze in parallel with the loading screen animation
    analyzePromiseRef.current = analyzeQuiz({ answers });
    setScreen("loading");
  }, []);

  const handleLoadingComplete = useCallback(async () => {
    try {
      const promise = analyzePromiseRef.current ?? analyzeQuiz({ answers: pendingAnswers });
      const apiResult = await promise;
      const result = apiResultToQuizResult(apiResult, pendingAnswers);

      setCurrentResult(result);
      setSharedResult(false);
      setHistory((prev) => {
        const next = [result, ...prev.filter((r) => r.id !== result.id)].slice(0, HISTORY_LIMIT);
        saveHistory(next);
        return next;
      });
      setScreen("results");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "the diagnosis failed mid-cook";
      setErrorMsg(msg);
      setScreen("error");
    } finally {
      analyzePromiseRef.current = null;
    }
  }, [pendingAnswers]);

  const handleRetry = useCallback(() => {
    if (sharedResult) {
      // Came in via shared link — strip the URL and go home
      window.history.replaceState(null, "", "/");
      setSharedResult(false);
    }
    setCurrentResult(null);
    setScreen("landing");
  }, [sharedResult]);

  const handleViewHistory = useCallback(() => setScreen("history"), []);

  const handleViewHistoryResult = useCallback((result: QuizResult) => {
    setCurrentResult(result);
    setSharedResult(false);
    setScreen("results");
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  const handleRecoverFromError = useCallback(() => {
    if (questions.length === 0) {
      // never got off the ground — full reload is the cleanest recovery
      window.location.assign("/");
      return;
    }
    setErrorMsg("");
    window.history.replaceState(null, "", "/");
    setSharedResult(false);
    setCurrentResult(null);
    setScreen("landing");
  }, [questions.length]);

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
        {screen === "boot" && (
          <motion.div key="boot" {...PAGE_TRANSITION} className="min-h-full">
            <BootScreen />
          </motion.div>
        )}

        {screen === "landing" && (
          <motion.div key="landing" {...PAGE_TRANSITION} className="min-h-full">
            <LandingPage
              onStart={handleStartQuiz}
              onHistory={handleViewHistory}
              historyCount={history.length}
              questionCount={questions.length}
              noticeMsg={errorMsg || null}
              onDismissNotice={() => setErrorMsg("")}
            />
          </motion.div>
        )}

        {screen === "quiz" && (
          <motion.div key="quiz" {...PAGE_TRANSITION} className="min-h-full">
            <QuizFlow
              questions={questions}
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
              shared={sharedResult}
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

        {screen === "error" && (
          <motion.div key="error" {...PAGE_TRANSITION} className="min-h-full">
            <ErrorScreen message={errorMsg} onRetry={handleRecoverFromError} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
