import { IsString, MaxLength, MinLength } from "class-validator";

export const UploadFileDtoSwagger = {
  schema: {
    type: "object",
    properties: {
      filename: {
        type: "string",
        description: "Enter your file name",
        example: "file name",
        maxLength: 100,
        minLength: 5,
      },
      file: {
        type: "string",
        format: "binary",
      },
    },
    required: ["filename"],
  },
};

export class UploadFileDto {
  @MinLength(5, { message: "The Minimum length of fileName is 5" })
  @MaxLength(100, { message: "The Maximum length of fileName is 100" })
  @IsString()
  filename: string;
}
