/*
  Warnings:

  - You are about to drop the column `folderId` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the `Folder` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `key` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_folderId_fkey";

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "folderId",
ADD COLUMN     "key" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Folder";

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagMap" (
    "id" SERIAL NOT NULL,
    "songId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "TagMap_pkey" PRIMARY KEY ("id")
);
