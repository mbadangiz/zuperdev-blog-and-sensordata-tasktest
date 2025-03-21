/*
  Warnings:

  - Changed the type of `status` on the `SensorData` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SensorDataStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "SensorData" DROP COLUMN "status",
ADD COLUMN     "status" "SensorDataStatus" NOT NULL;
