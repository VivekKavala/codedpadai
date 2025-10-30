/*
  Warnings:

  - You are about to drop the column `content` on the `pads` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pads" DROP COLUMN "content";

-- CreateTable
CREATE TABLE "pad_files" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "padId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pad_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pad_files_padId_order_idx" ON "pad_files"("padId", "order");

-- AddForeignKey
ALTER TABLE "pad_files" ADD CONSTRAINT "pad_files_padId_fkey" FOREIGN KEY ("padId") REFERENCES "pads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
