import { Body, Controller } from "@nestjs/common";
import { Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AwsUploadService } from "./aws-upload.service";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { Auth } from "src/decorators/auth.decorators";
import { Roles } from "src/decorators/roles.decorator";
import { UserRole } from "src/types/enum";
import { UploadFileDto, UploadFileDtoSwagger } from "./dto/uploadfile.dto";

@Controller("aws-upload")
export class AwsUploadController {
  constructor(private readonly AwsUploadService: AwsUploadService) {}

  @Post()
  // @Auth("jwt-refresh")
  // @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody(UploadFileDtoSwagger)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFileDto,
  ) {
    return await this.AwsUploadService.uploadController(file, body);
  }
}
