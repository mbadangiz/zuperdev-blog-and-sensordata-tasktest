import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RefreshTokenStrategies } from "./strategies/ref-t.strategies";
import { AccessTokenStrategies } from "./strategies/ac-t.strategies";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenStrategies, AccessTokenStrategies],
  exports: [AuthService],
})
export class AuthModule {}
