/*
  Warnings:

  - A unique constraint covering the columns `[userId,roleId]` on the table `UsersRoles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UsersRoles_userId_roleId_key" ON "UsersRoles"("userId", "roleId");
