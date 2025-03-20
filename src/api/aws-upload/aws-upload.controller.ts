import { Body, Controller, Delete } from "@nestjs/common";
import { Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AwsUploadService } from "./aws-upload.service";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { useRoles } from "src/decorators/useRoles.decorators";
import { UserRole } from "src/types/enum";
import { UploadFileDto, UploadFileDtoSwagger } from "./dto/uploadfile.dto";
import { DeleteFileDto, DeleteFileDtoSwagger } from "./dto/deletefile.dto";

@Controller("aws-upload")
export class AwsUploadController {
  constructor(private readonly AwsUploadService: AwsUploadService) {}

  @Post()
  @useRoles(UserRole.ADMIN, UserRole.EDITOR)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody(UploadFileDtoSwagger)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFileDto,
  ) {
    return await this.AwsUploadService.upload(file, body);
  }

  @Delete("delete")
  @useRoles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBody(DeleteFileDtoSwagger)
  async deleteFile(@Body() body: DeleteFileDto) {
    const data = body.idOrUrl.includes("https://")
      ? { url: body.idOrUrl }
      : { id: Number(body.idOrUrl) };

    return this.AwsUploadService.delete(body.filebucketname, data);
  }
}
