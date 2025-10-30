/*
  Warnings:

  - A unique constraint covering the columns `[shareToken]` on the table `pads` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EditPermission" AS ENUM ('ANYONE', 'ACCESS_KEY');

-- AlterEnum
ALTER TYPE "Visibility" ADD VALUE 'UNLISTED';

-- AlterTable
ALTER TABLE "pads" ADD COLUMN     "burnAfterReading" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "disableCopy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "editAccessKey" TEXT,
ADD COLUMN     "editPermission" "EditPermission" NOT NULL DEFAULT 'ANYONE',
ADD COLUMN     "enableAuditLogs" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "lastViewedAt" TIMESTAMP(3),
ADD COLUMN     "linkOnlyAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxViews" INTEGER,
ADD COLUMN     "notifyOnView" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shareToken" TEXT,
ADD COLUMN     "uniqueViews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "viewOnlyViaLink" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "padId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_padId_timestamp_idx" ON "audit_logs"("padId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "pads_shareToken_key" ON "pads"("shareToken");

-- CreateIndex
CREATE INDEX "pads_userId_idx" ON "pads"("userId");

-- CreateIndex
CREATE INDEX "pads_visibility_createdAt_idx" ON "pads"("visibility", "createdAt");

-- CreateIndex
CREATE INDEX "pads_expiresAt_idx" ON "pads"("expiresAt");

-- CreateIndex
CREATE INDEX "pads_shareToken_idx" ON "pads"("shareToken");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_padId_fkey" FOREIGN KEY ("padId") REFERENCES "pads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
