import { Body, Controller, Post, Req } from "@nestjs/common";
import { SensorDataDto, SensorDataDtoSwagger } from "./dto/sensor-data.dto";
import { useRoles } from "src/decorators/useRoles.decorators";
import { UserRole } from "src/types/enum";
import { ApiBody } from "@nestjs/swagger";
import { SensorDataService } from "./sensor-data.service";
import { Request } from "express";

@Controller("sensor-data")
@useRoles(UserRole.ADMIN, UserRole.EDITOR, UserRole.ORDINAL, UserRole.VIEWER)
export class SensorDataController {
  constructor(private readonly SensorDataService: SensorDataService) {}

  @Post()
  @ApiBody(SensorDataDtoSwagger)
  createNewSensorData(@Body() body: SensorDataDto, @Req() req: Request) {
    return this.SensorDataService.createSensorData(body, req.user);
  }
}
