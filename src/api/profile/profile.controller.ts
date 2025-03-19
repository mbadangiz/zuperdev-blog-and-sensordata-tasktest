import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { Request } from "express";
import { Auth } from "src/decorators/auth.decorators";
import { ProfileService } from "./profile.service";
import { Roles } from "src/decorators/roles.decorator";
import { UserRole } from "src/types/enum";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import {
  UpdateProfileDto,
  UpdateProfileDtoSwagger,
} from "./dto/updateProfile.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @Auth("jwt-refresh")
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.ORDINAL, UserRole.VIEWER)
  getProfile(@Req() req: Request) {
    return this.profileService.getProfile(req.user);
  }

  @Put("update")
  @Auth("jwt-refresh")
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.ORDINAL, UserRole.VIEWER)
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
