-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cookedPct" INTEGER NOT NULL,
    "archetype" TEXT NOT NULL,
    "stats" TEXT NOT NULL,
    "diagnostic" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    "yap" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Result_createdAt_idx" ON "Result"("createdAt");
