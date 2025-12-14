-- AlterTable
ALTER TABLE `attractions` ADD COLUMN `mapsEmbedCode` TEXT NULL;

-- AlterTable
ALTER TABLE `contact_info` ADD COLUMN `operatingHours` TEXT NULL,
    MODIFY `address` TEXT NOT NULL,
    MODIFY `mapsEmbedCode` TEXT NULL;

-- AlterTable
ALTER TABLE `culinary` ADD COLUMN `mapsEmbedCode` TEXT NULL;
