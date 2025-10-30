/*
  Warnings:

  - A unique constraint covering the columns `[customId]` on the table `pads` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pads" ADD COLUMN     "customId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "pads_customId_key" ON "pads"("customId");

-- CreateIndex
CREATE INDEX "pads_customId_idx" ON "pads"("customId");
