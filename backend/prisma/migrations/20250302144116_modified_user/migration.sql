/*
  Warnings:

  - You are about to drop the column `public_address` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[address]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_public_address_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "public_address",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");
