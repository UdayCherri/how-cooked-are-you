import { motion, AnimatePresence } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BOSS_STAGES,
  QUESTIONS,
  RANDOM_EVENTS,
  buildSchedule,
  calculateScore,
  getArchetype,
  getBossTier,
  getEarnedAchievements,
  type EvidenceItem,
  type Expression,
  type GameResult,
  type ScheduleItem,
} from "../data/gameData";
import { MachineFace } from "./MachineFace";
import { TypewriterText } from "./TypewriterText";

interface SessionScreenProps {
  onComplete: (result: GameResult) => void;
}

type SessionPhase =
  | "question_show"
  | "question_reacting"
  | "event_show"
  | "event_reacting"
  | "boss_intro"
  | "boss_waiting"
  | "boss_reacting"
  | "advance";

const EVIDENCE_TYPE_STYLES: Record<string, { color: string; label: string }> = {
  exhibit:    { color: "#FFE66D", label: "EXHIBIT" },
  behavioral: { color: "#4D96FF", label: "BEHAVIORAL" },
  testimony:  { color: "#6BCB77", label: "TESTIMONY" },
  critical:   { color: "#FF6B6B", label: "CRITICAL" },
};

function EvidencePip({ item }: { item: EvidenceItem }) {
  const style = EVIDENCE_TYPE_STYLES[item.type];
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      title={`${item.title}: ${item.description}`}
      className="flex items-center gap-1 px-1.5 py-0.5 shrink-0"
      style={{
        border: `1px solid ${style.color}50`,
        background: `${style.color}10`,
      }}
    >
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.5rem",
          color: style.color,
          letterSpacing: "0.06em",
        }}
      >
        {style.label}
      </span>
    </motion.div>
  );
}

export function SessionScreen({ onComplete }: SessionScreenProps) {
  const [schedule] = useState<ScheduleItem[]>(() => buildSchedule());
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<SessionPhase>("question_show");
  const [questionAnswers, setQuestionAnswers] = useState<Record<number, number>>({});
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [machineText, setMachineText] = useState("DIAGNOSTIC INITIATED.\nANSWER HONESTLY.\n(The machine always knows.)");
  const [expression, setExpression] = useState<Expression>("neutral");
  const [eventChoiceIdx, setEventChoiceIdx] = useState<number | null>(null);
  const [bossChoiceIdx, setBossChoiceIdx] = useState<number | null>(null);
  const [chosenAnswerIdx, setChosenAnswerIdx] = useState<number | null>(null);
  const [newEvidenceFlash, setNewEvidenceFlash] = useState(false);
  const [bossEventId, setBossEventId] = useState<string | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs so timeout callbacks always see current values (avoids stale closure bugs)
  const answersRef = useRef<Record<number, number>>({});
  const evidenceRef = useRef<EvidenceItem[]>([]);
  const bossChoiceRef = useRef<number | null>(null);
  const bossEventRef = useRef<string | null>(null);
  const stepIndexRef = useRef(0);

  const currentStep = schedule[stepIndex];

  const clearAdvance = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  };

  const scheduleAdvance = useCallback((delay: number, fn: () => void) => {
    clearAdvance();
    advanceTimer.current = setTimeout(fn, delay);
  }, []);

  const advanceStep = useCallback(() => {
    clearAdvance();
    const curIdx = stepIndexRef.current;
    if (curIdx >= schedule.length - 1) {
      const qa = answersRef.current;
      const ev = evidenceRef.current;
      const score = calculateScore(qa);
      const archetype = getArchetype(score);
      const achievements = getEarnedAchievements(qa);
      const result: GameResult = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString("en-US", {
          weekday: "short", month: "short", day: "numeric",
          year: "numeric", hour: "2-digit", minute: "2-digit",
        }),
        score,
        archetype,
        evidence: ev,
        achievements,
        questionAnswers: qa,
        bossChoiceIdx: bossChoiceRef.current ?? 0,
        bossEventId: bossEventRef.current,
      };
      onComplete(result);
    } else {
      const nextIndex = curIdx + 1;
      stepIndexRef.current = nextIndex;
      setStepIndex(nextIndex);
      setChosenAnswerIdx(null);
      setEventChoiceIdx(null);

      const nextStep = schedule[nextIndex];
      if (nextStep.kind === "question") {
        setPhase("question_show");
        const q = QUESTIONS[nextStep.questionIdx];
        setMachineText(`DIAGNOSTIC ${nextStep.questionIdx + 1} / 8\n${q.scanLabel}`);
        setExpression("neutral");
      } else if (nextStep.kind === "event") {
        setPhase("event_show");
        setExpression("glitching");
        const ev = RANDOM_EVENTS.find((e) => e.id === nextStep.eventId)!;
        setMachineText(ev.title + "\n─────────────────");
      } else if (nextStep.kind === "boss") {
        setPhase("boss_intro");
        setExpression("judging");
        const score = calculateScore(answersRef.current);
        const tier = getBossTier(score);
        const boss = BOSS_STAGES.find((b) => b.tier === tier)!;
        setMachineText(boss.title);
      }
    }
  }, [schedule, onComplete]);

  const handleQuestionChoice = (choiceIdx: number) => {
    if (phase !== "question_show") return;
    clearAdvance();

    const step = currentStep as { kind: "question"; questionIdx: number };
    const q = QUESTIONS[step.questionIdx];
    const choice = q.choices[choiceIdx];

    setChosenAnswerIdx(choiceIdx);
    answersRef.current = { ...answersRef.current, [step.questionIdx]: choiceIdx };
    setQuestionAnswers(answersRef.current);

    const newEvidence: EvidenceItem = { ...choice.evidence, fromQuestion: step.questionIdx };
    evidenceRef.current = [...evidenceRef.current, newEvidence];
    setEvidence(evidenceRef.current);
    setNewEvidenceFlash(true);
    setTimeout(() => setNewEvidenceFlash(false), 800);

    setExpression(choice.expression);
    setMachineText(choice.commentary);
    setPhase("question_reacting");

    scheduleAdvance(3200, advanceStep);
  };

  const handleEventChoice = (choiceIdx: number) => {
    if (phase !== "event_show") return;
    clearAdvance();

    const step = currentStep as { kind: "event"; eventId: string };
    const ev = RANDOM_EVENTS.find((e) => e.id === step.eventId)!;
    const evChoice = ev.choices[choiceIdx];

    bossEventRef.current = step.eventId;
    setBossEventId(step.eventId);
    setEventChoiceIdx(choiceIdx);
    setExpression(evChoice.expression);
    setMachineText(evChoice.reaction);
    setPhase("event_reacting");

    scheduleAdvance(2800, advanceStep);
  };

  const handleBossChoice = (choiceIdx: number) => {
    if (phase !== "boss_waiting") return;
    clearAdvance();

    const score = calculateScore(answersRef.current);
    const tier = getBossTier(score);
    const boss = BOSS_STAGES.find((b) => b.tier === tier)!;
    const bossChoice = boss.choices[choiceIdx];

    bossChoiceRef.current = choiceIdx;
    setBossChoiceIdx(choiceIdx);
    setExpression(bossChoice.expression);
    setMachineText(bossChoice.reaction);
    setPhase("boss_reacting");

    scheduleAdvance(3200, advanceStep);
  };

  const handleSkip = () => {
    if (phase === "question_reacting" || phase === "event_reacting" || phase === "boss_reacting") {
      clearAdvance();
      advanceStep();
    }
  };

  useEffect(() => {
    return () => clearAdvance();
  }, []);

  const questionsAnswered = Object.keys(answersRef.current).length;
  const totalQuestions = 8;
  const progressPct = (questionsAnswered / totalQuestions) * 100;

  const isBossPhase = phase === "boss_intro" || phase === "boss_waiting" || phase === "boss_reacting";
  const accentColor = isBossPhase ? "#FF6B6B" : "#B983FF";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#080808", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 3px)",
          zIndex: 0,
        }}
      />

      {/* Boss glow overlay */}
      <AnimatePresence>
        {isBossPhase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(255,107,107,0.12) 0%, transparent 60%)",
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div
        className="relative z-20 flex items-center justify-between px-4 py-2.5"
        style={{
          background: "#060606",
          borderBottom: "1px solid #111",
        }}
      >
        {/* Progress bar + label */}
        <div className="flex items-center gap-3 flex-1 max-w-xs">
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.55rem",
              color: "#444",
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
            }}
          >
            SCAN
          </span>
          <div
            className="flex-1 h-1.5 overflow-hidden"
            style={{ background: "#111" }}
          >
            <motion.div
              className="h-full"
              style={{ background: accentColor }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.55rem",
              color: "#444",
              letterSpacing: "0.06em",
            }}
          >
            {questionsAnswered}/{totalQuestions}
          </span>
        </div>

        {/* Evidence counter */}
        <motion.div
          animate={newEvidenceFlash ? { scale: [1, 1.3, 1], color: "#FFE66D" } : {}}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5 px-2.5 py-1"
          style={{
            background: newEvidenceFlash ? "rgba(255,230,109,0.12)" : "transparent",
            border: `1px solid ${newEvidenceFlash ? "#FFE66D50" : "#1E1E1E"}`,
            transition: "background 0.3s, border 0.3s",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.55rem",
              color: newEvidenceFlash ? "#FFE66D" : "#444",
              letterSpacing: "0.08em",
            }}
          >
            EVIDENCE: {evidence.length}
          </span>
        </motion.div>
      </div>

      {/* Machine dialogue area */}
      <div
        className="relative z-10 flex-shrink-0 px-4 pt-4 pb-3"
        style={{ background: "#060606", borderBottom: "1px solid #0E0E0E" }}
      >
        <div className="max-w-lg mx-auto flex items-start gap-4">
          <MachineFace expression={expression} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.52rem",
                  color: accentColor,
                  letterSpacing: "0.14em",
                }}
              >
                THE MACHINE
              </span>
              {(phase === "question_reacting" || phase === "event_reacting" || phase === "boss_reacting") && (
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.48rem",
                    color: "#333",
                    letterSpacing: "0.08em",
                  }}
                >
                  [click to skip]
                </span>
              )}
            </div>
            <TypewriterText
              key={machineText}
              text={machineText}
              speed={22}
              onDone={() => {
                if (phase === "boss_intro") {
                  setPhase("boss_waiting");
                }
              }}
              onSkip={handleSkip}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.78rem",
                color: "#B0B0B0",
                lineHeight: 1.75,
                minHeight: 60,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-5">
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">

            {/* ── QUESTION CARD ─── */}
            {(phase === "question_show" || phase === "question_reacting") &&
              currentStep.kind === "question" && (() => {
                const q = QUESTIONS[currentStep.questionIdx];
                return (
                  <motion.div
                    key={`q-${currentStep.questionIdx}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    {/* Case file header */}
                    <div
                      className="flex items-center justify-between px-3 py-2 mb-0"
                      style={{
                        background: "#0C0C0C",
                        border: "2px solid #1A1A1A",
                        borderBottom: "none",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "0.55rem",
                          color: "#444",
                          letterSpacing: "0.12em",
                        }}
                      >
                        DIAGNOSTIC FILE #{String(currentStep.questionIdx + 1).padStart(2, "0")}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "0.55rem",
                          color: "#333",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {q.scanLabel}
                      </span>
                    </div>

                    {/* Question */}
                    <div
                      className="px-4 pt-5 pb-4 mb-3"
                      style={{
                        background: "#0C0C0C",
                        border: "2px solid #1A1A1A",
                        borderTop: `3px solid ${accentColor}`,
                        boxShadow: `3px 3px 0 0 ${accentColor}20`,
                      }}
                    >
                      <h2
                        style={{
                          fontFamily: "'Fredoka', sans-serif",
                          fontSize: "clamp(1.3rem, 4vw, 1.7rem)",
                          fontWeight: 700,
                          color: "#ECECEC",
                          lineHeight: 1.25,
                          marginBottom: 20,
                        }}
                      >
                        {q.text}
                      </h2>

                      {/* Choices */}
                      <div className="flex flex-col gap-2">
                        {q.choices.map((choice, i) => {
                          const isChosen = chosenAnswerIdx === i;
                          const isOther = chosenAnswerIdx !== null && chosenAnswerIdx !== i;
                          const letter = ["A", "B", "C", "D"][i];
                          return (
                            <motion.button
                              key={i}
                              onClick={() => handleQuestionChoice(i)}
                              disabled={phase !== "question_show"}
                              whileHover={phase === "question_show" ? { x: 3 } : {}}
                              whileTap={phase === "question_show" ? { scale: 0.98 } : {}}
                              className="w-full text-left flex items-start gap-3 px-3 py-3 cursor-pointer"
                              style={{
                                background: isChosen ? `${accentColor}15` : "#111",
                                border: `2px solid ${isChosen ? accentColor : "#1E1E1E"}`,
                                boxShadow: isChosen ? `3px 3px 0 0 ${accentColor}40` : "none",
                                opacity: isOther ? 0.3 : 1,
                                transition: "all 0.15s ease",
                              }}
                            >
                              <span
                                className="flex-shrink-0 flex items-center justify-center w-6 h-6 text-xs"
                                style={{
                                  fontFamily: "'Space Mono', monospace",
                                  fontSize: "0.65rem",
                                  color: isChosen ? accentColor : "#444",
                                  border: `1px solid ${isChosen ? accentColor : "#2A2A2A"}`,
                                  background: isChosen ? `${accentColor}15` : "transparent",
                                  transition: "all 0.15s ease",
                                  flexShrink: 0,
                                }}
                              >
                                {isChosen ? "✓" : letter}
                              </span>
                              <span
                                style={{
                                  fontFamily: "'DM Sans', sans-serif",
                                  fontSize: "0.9rem",
                                  color: isChosen ? "#F0F0F0" : "#999",
                                  lineHeight: 1.45,
                                  transition: "color 0.15s ease",
                                }}
                              >
                                {choice.text}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Evidence pips for this question */}
                    {evidence.filter((e) => e.fromQuestion === currentStep.questionIdx).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {evidence
                          .filter((e) => e.fromQuestion === currentStep.questionIdx)
                          .map((e, i) => (
                            <EvidencePip key={i} item={e} />
                          ))}
                      </div>
                    )}
                  </motion.div>
                );
              })()}

            {/* ── RANDOM EVENT CARD ─── */}
            {(phase === "event_show" || phase === "event_reacting") &&
              currentStep.kind === "event" && (() => {
                const ev = RANDOM_EVENTS.find((e) => e.id === currentStep.eventId)!;
                return (
                  <motion.div
                    key={`event-${ev.id}`}
                    initial={{ opacity: 0, y: -20, rotate: -1 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 22 }}
                  >
                    <div
                      className="p-5"
                      style={{
                        background: "#0C0C0C",
                        border: "2px solid #FF6B6B50",
                        boxShadow: "3px 3px 0 0 #FF6B6B30, 0 0 40px rgba(255,107,107,0.06)",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "0.6rem",
                          color: "#FF6B6B",
                          letterSpacing: "0.14em",
                          marginBottom: 16,
                        }}
                      >
                        {ev.title}
                      </p>

                      <div className="flex flex-col gap-1.5 mb-6">
                        {ev.machineLines.map((line, i) => (
                          <motion.p
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.18, duration: 0.25 }}
                            style={{
                              fontFamily: "'Space Mono', monospace",
                              fontSize: line.startsWith("[") ? "0.72rem" : "0.78rem",
                              color: line.startsWith("[") ? "#FF6B6B" : "#888",
                              lineHeight: 1.7,
                            }}
                          >
                            {line}
                          </motion.p>
                        ))}
                      </div>

                      {phase === "event_show" && (
                        <div className="flex flex-col gap-2">
                          {ev.choices.map((choice, i) => (
                            <motion.button
                              key={i}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: ev.machineLines.length * 0.18 + i * 0.08 }}
                              whileHover={{ x: 3 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleEventChoice(i)}
                              className="w-full text-left px-3 py-3 cursor-pointer"
                              style={{
                                background: "#111",
                                border: "2px solid #1E1E1E",
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: "0.9rem",
                                color: "#999",
                              }}
                            >
                              {["›", "›", "›"][i]} {choice.text}
                            </motion.button>
                          ))}
                        </div>
                      )}

                      {phase === "event_reacting" && eventChoiceIdx !== null && (
                        <div
                          className="px-3 py-3"
                          style={{
                            background: "#111",
                            border: "1px solid #1E1E1E",
                            borderLeft: "3px solid #FF6B6B50",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: "0.88rem",
                              color: "#777",
                            }}
                          >
                            {ev.choices[eventChoiceIdx].text}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })()}

            {/* ── BOSS CARD ─── */}
            {(phase === "boss_intro" || phase === "boss_waiting" || phase === "boss_reacting") && (() => {
              const score = calculateScore(answersRef.current);
              const tier = getBossTier(score);
              const boss = BOSS_STAGES.find((b) => b.tier === tier)!;
              return (
                <motion.div
                  key="boss"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <div
                    className="p-5"
                    style={{
                      background: "#0A0606",
                      border: "2px solid #FF6B6B60",
                      boxShadow: "4px 4px 0 0 #FF6B6B40, 0 0 60px rgba(255,107,107,0.1)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.55rem",
                        color: "#FF6B6B",
                        letterSpacing: "0.18em",
                        marginBottom: 4,
                      }}
                    >
                      ⚡ CONFRONTATION SEQUENCE
                    </p>
                    <h3
                      style={{
                        fontFamily: "'Fredoka', sans-serif",
                        fontSize: "clamp(1.4rem, 4vw, 1.9rem)",
                        fontWeight: 700,
                        color: "#FF6B6B",
                        lineHeight: 1.1,
                        marginBottom: 20,
                        textShadow: "0 0 30px rgba(255,107,107,0.4)",
                      }}
                    >
                      {boss.title}
                    </h3>

                    <div className="flex flex-col gap-1.5 mb-6">
                      {boss.machineLines.map((line, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.22, duration: 0.3 }}
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "0.8rem",
                            color: line.startsWith("You are") || line.startsWith("...") ? "#FF6B6B" : "#888",
                            lineHeight: 1.75,
                          }}
                        >
                          {line}
                        </motion.p>
                      ))}
                    </div>

                    {phase === "boss_waiting" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col gap-2"
                      >
                        <p
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "0.55rem",
                            color: "#444",
                            letterSpacing: "0.1em",
                            marginBottom: 4,
                          }}
                        >
                          RESPOND:
                        </p>
                        {boss.choices.map((choice, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleBossChoice(i)}
                            className="w-full text-left px-4 py-3.5 cursor-pointer"
                            style={{
                              background: "#0E0808",
                              border: "2px solid #FF6B6B30",
                              boxShadow: "none",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: "0.95rem",
                              color: "#CC8888",
                              transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.border = "2px solid #FF6B6B80";
                              (e.currentTarget as HTMLElement).style.color = "#FF9999";
                              (e.currentTarget as HTMLElement).style.background = "#120A0A";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.border = "2px solid #FF6B6B30";
                              (e.currentTarget as HTMLElement).style.color = "#CC8888";
                              (e.currentTarget as HTMLElement).style.background = "#0E0808";
                            }}
                          >
                            &ldquo;{choice.text}&rdquo;
                          </motion.button>
                        ))}
                      </motion.div>
                    )}

                    {phase === "boss_reacting" && bossChoiceIdx !== null && (
                      <div
                        className="px-4 py-3"
                        style={{
                          background: "#0E0808",
                          border: "1px solid #1E1010",
                          borderLeft: "3px solid #FF6B6B50",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.88rem",
                            color: "#777",
                          }}
                        >
                          &ldquo;{boss.choices[bossChoiceIdx].text}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })()}

          </AnimatePresence>

          {/* Running evidence list */}
          {evidence.length > 0 && (
            <div className="mt-5">
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.52rem",
                  color: "#2A2A2A",
                  letterSpacing: "0.12em",
                  marginBottom: 8,
                }}
              >
                EVIDENCE COLLECTED ({evidence.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {evidence.map((e, i) => (
                  <EvidencePip key={i} item={e} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
