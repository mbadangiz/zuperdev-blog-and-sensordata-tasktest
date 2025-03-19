/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `UploadedFiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UploadedFiles_url_key" ON "UploadedFiles"("url");
