import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { Request } from "express";
import { useRoles } from "src/decorators/useRoles.decorators";
import { UserRole } from "src/types/enum";
import {
  UpdateProfileDto,
  UpdateProfileDtoSwagger,
} from "./dto/updateProfile.dto";
import { ProfileService } from "./profile.service";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @useRoles(UserRole.ADMIN, UserRole.EDITOR, UserRole.ORDINAL, UserRole.VIEWER)
  getProfile(@Req() req: Request) {
    console.log(req.user);
    return this.profileService.getProfile(req.user);
  }

  @Put("update")
  @useRoles(UserRole.ADMIN, UserRole.EDITOR, UserRole.ORDINAL, UserRole.VIEWER)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody(UpdateProfileDtoSwagger)
  updateProfile(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(req.user, file, body);
  }
}
