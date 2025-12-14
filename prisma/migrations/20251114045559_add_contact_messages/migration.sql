/*
  Warnings:

  - You are about to drop the column `isRead` on the `contact_messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `contact_messages` DROP COLUMN `isRead`,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'UNREAD';

-- CreateIndex
CREATE INDEX `contact_messages_status_idx` ON `contact_messages`(`status`);
