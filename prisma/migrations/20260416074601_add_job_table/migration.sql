/*
  Warnings:

  - Added the required column `description` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cover_letter` to the `Proposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClientProfile" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "FreelancerProfile" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "cover_letter" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_JobToSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_JobToSkill_AB_unique" ON "_JobToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_JobToSkill_B_index" ON "_JobToSkill"("B");

-- AddForeignKey
ALTER TABLE "_JobToSkill" ADD CONSTRAINT "_JobToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToSkill" ADD CONSTRAINT "_JobToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
