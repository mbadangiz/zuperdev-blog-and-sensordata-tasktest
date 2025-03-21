import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SensorDataDto } from "./dto/sensor-data.dto";
import { customInternalServerError } from "src/utils/customInternalServerError.utils";

@Injectable()
export class SensorDataService {
  constructor(private readonly prisma: PrismaService) {}

  async createSensorData(body: SensorDataDto, req) {
    const userId = req.userid;
    try {
      const createNewSensorData = await this.prisma.sensorData.create({
        data: { ...body, userId },
      });

      if (!createNewSensorData) {
        customInternalServerError();
      }

      return {
        success: true,
        message: "your sensor data has been added successfully.",
      };
    } catch (error) {
      console.log(error);
      customInternalServerError();
    }
  }
}
