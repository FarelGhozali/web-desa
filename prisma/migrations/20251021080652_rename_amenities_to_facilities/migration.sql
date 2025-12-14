/*
  Warnings:

  - You are about to drop the column `amenities` on the `homestays` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `homestays` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `homestays` table. All the data in the column will be lost.
  - Added the required column `facilities` to the `homestays` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `homestays` DROP COLUMN `amenities`,
    DROP COLUMN `latitude`,
    DROP COLUMN `longitude`,
    ADD COLUMN `facilities` TEXT NOT NULL,
    ADD COLUMN `mapsEmbedCode` TEXT NULL;
