/*
  Warnings:

  - You are about to drop the column `viewOnlyViaLink` on the `pads` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."pads_visibility_isListed_createdAt_idx";

-- AlterTable
ALTER TABLE "pads" DROP COLUMN "viewOnlyViaLink";

-- CreateIndex
CREATE INDEX "pads_visibility_isListed_expiresAt_idx" ON "pads"("visibility", "isListed", "expiresAt");
