import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { Roles } from "./roles.decorator";

export function useRoles(...roles: string[]) {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard), 
    Roles(...roles)
  );
}
