-- CreateTable
CREATE TABLE "SensorData" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(50) NOT NULL,
    "sensorId" VARCHAR(50) NOT NULL,
    "deviceType" VARCHAR(50) NOT NULL,
    "location" VARCHAR(50) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sashHeight" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" INTEGER NOT NULL,

    CONSTRAINT "SensorData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SensorData_sensorId_key" ON "SensorData"("sensorId");

-- AddForeignKey
ALTER TABLE "SensorData" ADD CONSTRAINT "SensorData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
