/*
  Warnings:

  - You are about to drop the `participantes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "participantes_userId_poolId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "participantes";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    CONSTRAINT "participants_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_guesses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstTeamPoints" INTEGER NOT NULL,
    "secondTeamPoints" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameId" TEXT NOT NULL,
    "participantsId" TEXT NOT NULL,
    CONSTRAINT "guesses_participantsId_fkey" FOREIGN KEY ("participantsId") REFERENCES "participants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "guesses_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_guesses" ("createdAt", "firstTeamPoints", "gameId", "id", "participantsId", "secondTeamPoints") SELECT "createdAt", "firstTeamPoints", "gameId", "id", "participantsId", "secondTeamPoints" FROM "guesses";
DROP TABLE "guesses";
ALTER TABLE "new_guesses" RENAME TO "guesses";
CREATE UNIQUE INDEX "guesses_participantsId_gameId_key" ON "guesses"("participantsId", "gameId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "participants_userId_poolId_key" ON "participants"("userId", "poolId");
