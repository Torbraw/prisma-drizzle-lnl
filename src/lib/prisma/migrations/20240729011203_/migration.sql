-- DropForeignKey
ALTER TABLE `prisma_users` DROP FOREIGN KEY `prisma_users_userInfoId_fkey`;

-- AddForeignKey
ALTER TABLE `prisma_users` ADD CONSTRAINT `prisma_users_userInfoId_fkey` FOREIGN KEY (`userInfoId`) REFERENCES `prisma_user_infos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
