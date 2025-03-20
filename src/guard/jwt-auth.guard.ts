import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-refresh') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try { 
      const result = await super.canActivate(context);
      const request = context.switchToHttp().getRequest();
       
      const user = await this.handleRequest(null, request.user, null);
       
      request.user = user;

      if (!result || !user) {
        throw new UnauthorizedException('Invalid token');
      }
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or missing token');
    }
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token');
    }
    return user;
  }
} 