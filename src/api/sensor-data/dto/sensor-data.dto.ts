import { IsString, IsNumber, MaxLength, IsEnum } from "class-validator";
import { SensorDataStatus } from "src/types/enum";

export class SensorDataDto {
  @MaxLength(50, { message: "The Maximum length should be 50" })
  @IsString()
  sensorId: string;

  @IsString()
  @MaxLength(50, { message: "The Maximum length should be 50" })
  deviceType: string;

  @IsString()
  @MaxLength(50, { message: "The Maximum length should be 50" })
  location: string;

  @IsNumber()
  sashHeight: number;

  @IsEnum(SensorDataStatus, { message: "Status must be either OPEN or CLOSED" })
  status: SensorDataStatus;

  @IsNumber()
  temperature: number;

  @IsNumber()
  humidity: number;
}

export const SensorDataDtoSwagger = {
  schema: {
    type: "object",
    properties: {
      sensorId: {
        type: "string",
        description: "Unique identifier for the sensor",
        example: "TEST_45",
        maxLength: 50,
      },
      deviceType: {
        type: "string",
        description: "Type of the IoT device",
        example: "window_sash_sensor",
        maxLength: 50,
      },
      location: {
        type: "string",
        description: "Location of the sensor",
        example: "office_window_2",
        maxLength: 50,
      },
      sashHeight: {
        type: "number",
        description: "The height of the sash measured by the sensor",
        example: 0,
      },
      status: {
        type: "string",
        description: "Current status of the sash (e.g., open or closed)",
        example: "closed",
        enum: ["OPEN", "CLOSED"],
        maxLength: 30,
      },
      temperature: {
        type: "number",
        description: "Temperature recorded by the sensor (in Celsius)",
        example: 22.5,
      },
      humidity: {
        type: "number",
        description: "Humidity level recorded by the sensor (in %)",
        example: 45,
      },
    },
    required: [
      "sensorId",
      "deviceType",
      "location",
      "sashHeight",
      "status",
      "temperature",
      "humidity",
    ],
  },
};
