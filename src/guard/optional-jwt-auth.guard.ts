import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt-refresh") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = (await super.canActivate(context)) as boolean;
      const request = context.switchToHttp().getRequest();

      request.user = result
        ? await this.handleRequest(null, request.user, null)
        : null;

      return true;
    } catch {
      const request = context.switchToHttp().getRequest();
      request.user = null;
      return true;
    }
  }

  handleRequest(err: any, user: any, info: any) {
    return err || !user ? null : user;
  }
}
