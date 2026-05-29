import { prisma } from "../lib/prisma";
import { QUESTIONS } from "../data/questions";
import { runDiagnostic } from "../services/engine.service";
import { persistResult } from "../services/persistence.service";

async function main() {
  const samples = [
    {
      seed: 1337,
      yap: "i havent slept since tuesday and i think the microwave just judged me",
      answers: QUESTIONS.map((q, i) => ({
        qid: q.id,
        choiceId: q.choices[i % 4 === 0 ? 3 : 2]!.id,
      })),
    },
    {
      seed: 4242,
      yap: undefined,
      answers: QUESTIONS.map((q, i) => ({ qid: q.id, choiceId: q.choices[i % 2 === 0 ? 1 : 2]!.id })),
    },
    {
      seed: 777,
      yap: "i am thriving actually thanks for asking",
      answers: QUESTIONS.map((q) => ({ qid: q.id, choiceId: q.choices[0]!.id })),
    },
  ];

  for (const s of samples) {
    const out = runDiagnostic({ answers: s.answers, yap: s.yap, seed: s.seed });
    const r = await persistResult({
      stats: out.stats,
      cookedPercentage: out.cookedPercentage,
      archetypeTitle: out.archetype.title,
      diagnostic: out.diagnostic,
      answers: s.answers,
      seed: out.seed,
      yap: s.yap,
    });
    console.log(
      `seeded result ${r.id} — ${r.archetype} (${r.cookedPercentage}% cooked) · boss: ${out.diagnostic.boss.name} · ${out.diagnostic.achievements.length} achievements`
    );
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
