-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,
    "blogId" VARCHAR(50) NOT NULL,
    "authourId" VARCHAR(50) NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "status" "BlogStatus" NOT NULL DEFAULT 'PUBLISHED',
    "publishedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "averageRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalLikes" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" VARCHAR(150),
    "seoConent" TEXT,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("blogId")
);

-- CreateTable
CREATE TABLE "BlogsRates" (
    "id" SERIAL NOT NULL,
    "userid" VARCHAR(50) NOT NULL,
    "blogId" VARCHAR(50) NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BlogsRates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogsLikes" (
    "id" SERIAL NOT NULL,
    "userid" VARCHAR(50) NOT NULL,
    "blogId" VARCHAR(50) NOT NULL,

    CONSTRAINT "BlogsLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCategories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "BlogCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCategoriesList" (
    "id" SERIAL NOT NULL,
    "blogId" VARCHAR(50) NOT NULL,
    "cateId" INTEGER NOT NULL,

    CONSTRAINT "BlogCategoriesList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "commentId" VARCHAR(50) NOT NULL,
    "content" TEXT NOT NULL,
    "userId" VARCHAR(50) NOT NULL,
    "blogId" VARCHAR(50) NOT NULL,
    "parentId" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("commentId")
);

-- CreateIndex
CREATE INDEX "Blog_id_idx" ON "Blog"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BlogsRates_blogId_userid_key" ON "BlogsRates"("blogId", "userid");

-- CreateIndex
CREATE UNIQUE INDEX "BlogsLikes_blogId_userid_key" ON "BlogsLikes"("blogId", "userid");

-- CreateIndex
CREATE INDEX "Comments_userId_idx" ON "Comments"("userId");

-- CreateIndex
CREATE INDEX "Comments_blogId_idx" ON "Comments"("blogId");

-- CreateIndex
CREATE INDEX "Comments_id_idx" ON "Comments"("id");

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_authourId_fkey" FOREIGN KEY ("authourId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogsRates" ADD CONSTRAINT "BlogsRates_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogsRates" ADD CONSTRAINT "BlogsRates_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("blogId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogsLikes" ADD CONSTRAINT "BlogsLikes_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogsLikes" ADD CONSTRAINT "BlogsLikes_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("blogId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCategoriesList" ADD CONSTRAINT "BlogCategoriesList_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("blogId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCategoriesList" ADD CONSTRAINT "BlogCategoriesList_cateId_fkey" FOREIGN KEY ("cateId") REFERENCES "BlogCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("blogId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comments"("commentId") ON DELETE SET NULL ON UPDATE CASCADE;
