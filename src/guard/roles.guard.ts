import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/decorators/roles.decorator";

@Injectable({ scope: Scope.REQUEST })
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;  
    if (!user) {
      throw new UnauthorizedException("Authentication required");
    }
 
    if (!user.roles) {
      throw new UnauthorizedException("User roles not found in token");
    }
 
    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException("You do not have permission to access this resource");
    }

    return true;
  }
}
