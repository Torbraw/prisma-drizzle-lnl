/*
  Warnings:

  - A unique constraint covering the columns `[name,type]` on the table `prisma_permissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `prisma_permissions_name_key` ON `prisma_permissions`;

-- CreateIndex
CREATE UNIQUE INDEX `prisma_permissions_name_type_key` ON `prisma_permissions`(`name`, `type`);
