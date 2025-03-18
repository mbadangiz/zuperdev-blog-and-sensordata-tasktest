import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";

export function Auth(authType: string) {
  return applyDecorators(UseGuards(AuthGuard(authType)), ApiBearerAuth());
}
