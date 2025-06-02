/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Passwordreset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `Passwordreset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `passwordreset` ADD COLUMN `uuid` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Passwordreset_uuid_key` ON `Passwordreset`(`uuid`);
