/*
  Warnings:

  - You are about to drop the column `userId` on the `prisma_user_infos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userInfoId]` on the table `prisma_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userInfoId` to the `prisma_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `prisma_user_infos` DROP FOREIGN KEY `prisma_user_infos_userId_fkey`;

-- AlterTable
ALTER TABLE `prisma_user_infos` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `prisma_users` ADD COLUMN `userInfoId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `prisma_users_userInfoId_key` ON `prisma_users`(`userInfoId`);

-- AddForeignKey
ALTER TABLE `prisma_users` ADD CONSTRAINT `prisma_users_userInfoId_fkey` FOREIGN KEY (`userInfoId`) REFERENCES `prisma_user_infos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
