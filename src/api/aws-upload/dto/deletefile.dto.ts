import { IsString } from "class-validator";

export const DeleteFileDtoSwagger = {
  schema: {
    type: "object",
    properties: {
      filebucketname: {
        type: "string",
        description: "The bucket name or folder where the file is stored",
        example: "my-app-bucket",
      },
      idOrUrl: {
        type: "string",
        description: "Either the file ID or the URL to identify the file",
        example: "12345 OR https://s3.amazonaws.com/mybucket/file.png",
      },
    },
    required: ["filebucketname", "idOrUrl"],
  },
};

export class DeleteFileDto {
  @IsString()
  filebucketname: string;

  @IsString()
  idOrUrl: string;
}
