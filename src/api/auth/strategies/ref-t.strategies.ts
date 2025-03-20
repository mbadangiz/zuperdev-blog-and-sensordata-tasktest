import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./types";

@Injectable()
export class RefreshTokenStrategies extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        process.env.REFT_JWTSECRET ||
        "L1uT6mHvdsppo9bY3sJgK0wFy7xZ2aQdE4rV8p9uT2cas",
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(req: Request, payload: any): Promise<User> {
    if (!payload) {
      throw new UnauthorizedException("Invalid token payload");
    }

    if (!payload.userid || !payload.roles) {
      throw new UnauthorizedException("Token payload missing required fields");
    }

    const user: User = {
      userid: payload.userid,
      roles: payload.roles,
    };

    return user;
  }
}
