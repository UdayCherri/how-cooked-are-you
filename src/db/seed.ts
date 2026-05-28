import { prisma } from "../lib/prisma";
import { QUESTIONS } from "../data/questions";
import { score } from "../services/scoring.service";
import { generateDiagnostic } from "../services/diagnostic.service";
import { persistResult } from "../services/persistence.service";

async function main() {
  const samples = [
    {
      yap: "i havent slept since tuesday and i think the microwave just judged me",
      answers: QUESTIONS.map((q, i) => ({
        qid: q.id,
        choiceId: q.choices[Math.min(3, i % 4 === 0 ? 3 : 2)]!.id,
      })),
    },
    {
      yap: undefined,
      answers: QUESTIONS.map((q, i) => ({ qid: q.id, choiceId: q.choices[i % 2 === 0 ? 1 : 2]!.id })),
    },
    {
      yap: "i am thriving actually thanks for asking",
      answers: QUESTIONS.map((q) => ({ qid: q.id, choiceId: q.choices[0]!.id })),
    },
  ];

  for (const s of samples) {
    const scoring = score({ answers: s.answers, yap: s.yap });
    const diag = generateDiagnostic({
      stats: scoring.stats,
      archetypeTitle: scoring.archetypeTitle,
      archetypeTag: scoring.archetypeTag,
      archetypeTagline: scoring.archetypeTagline,
      archetypeBestMatch: scoring.archetypeBestMatch,
      archetypeWorstMatch: scoring.archetypeWorstMatch,
      rng: scoring.rng,
    });
    const r = await persistResult({
      stats: scoring.stats,
      archetypeTitle: scoring.archetypeTitle,
      diagnostic: diag,
      answers: s.answers,
      yap: s.yap,
    });
    console.log(`seeded result ${r.id} — ${r.archetype} (${r.cookedPercentage}% cooked)`);
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
