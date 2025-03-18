import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Scope,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { User } from "src/auth/strategies/types";
import { ROLES_KEY } from "src/decorators/roles.decorator";

@Injectable({ scope: Scope.REQUEST })
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const token = context
      .switchToHttp()
      .getRequest<Request>()
      .get("authorization")
      ?.split(" ")
      .pop();

    const decodedToken = await this.jwtService.decode(token!);

    if (!decodedToken || !decodedToken.roles) {
      throw new ForbiddenException("Access denied");
    }

    const hasRole = requiredRoles.some((role) =>
      decodedToken.roles.includes(role),
    );

    if (!hasRole) {
      throw new ForbiddenException(
        "You do not have permission to access this resource",
      );
    }

    return true;
  }
}
