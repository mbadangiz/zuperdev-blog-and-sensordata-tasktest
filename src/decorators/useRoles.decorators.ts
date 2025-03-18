import { applyDecorators, UseGuards } from "@nestjs/common";
import { RolesGuard } from "src/guard/roles.guard";
import { Roles } from "./roles.decorator";

export function useRoles(...roles: string[]) {
  return applyDecorators(UseGuards(RolesGuard), Roles(...roles));
}
