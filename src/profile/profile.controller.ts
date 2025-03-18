import { Controller, Get, Put, Req } from "@nestjs/common";
import { Request } from "express";
import { Auth } from "src/decorators/auth.decorators";
import { ProfileService } from "./profile.service";
import { Roles } from "src/decorators/roles.decorator";
import { UserRole } from "src/types/enum";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @Auth("jwt-refresh")
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.ORDINAL, UserRole.VIEWER)
  getProfile(@Req() req: Request) {
    return this.profileService.getProfile(req.user);
  }

  @Put()
  @Auth("jwt-refresh")
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.ORDINAL, UserRole.VIEWER)
  updateProfile(@Req() req: Request) {
    return this.profileService.updateProfile(req.user);
  }
}
