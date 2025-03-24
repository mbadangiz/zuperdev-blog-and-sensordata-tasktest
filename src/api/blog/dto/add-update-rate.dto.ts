import { IsNumber, Max, Min } from "class-validator";

export class AddUpdateRateDto {
  @IsNumber()
  @Max(6, { message: "Blog rate cant be more than 6" })
  @Min(1, { message: "Blog rate cant be less than 1" })
  rate: number;
}

export const AddUpdateRateDtoSwagger = {
  schema: {
    type: "object",
    properties: {
      rate: {
        type: "number",
        description: "Enter your rate",
        example: 2.5,
        max: 6,
        min: 1,
      },
    },
    required: ["rate"],
  },
};
