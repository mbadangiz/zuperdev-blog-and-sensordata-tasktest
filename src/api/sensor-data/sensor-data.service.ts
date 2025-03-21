import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SensorDataDto } from "./dto/sensor-data.dto";
import { customInternalServerError } from "src/utils/customInternalServerError.utils";
import { SearchQueryDto } from "./dto/get-all-data.dto";

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

  async getAllDataBySearchAndFilter(query: SearchQueryDto) {
    try {
      const { page = 1, limit = 10, search = "" } = query;
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.sensorData.findMany({
          where: {
            OR: [
              { sensorId: { contains: search, mode: "insensitive" } },
              { location: { contains: search, mode: "insensitive" } },
            ],
          },
          skip,
          take: limit,
          orderBy: {
            time: "desc",
          },
        }),
        this.prisma.sensorData.count({
          where: {
            OR: [
              { sensorId: { contains: search, mode: "insensitive" } },
              { location: { contains: search, mode: "insensitive" } },
            ],
          },
        }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data,
        meta: {
          total,
          page: Number(page),
          totalPages,
          limit: Number(limit),
        },
      };
    } catch (error) {
      console.log(error);
      customInternalServerError();
    }
  }
}
