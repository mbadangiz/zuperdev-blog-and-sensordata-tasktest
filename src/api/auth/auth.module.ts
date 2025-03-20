import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RefreshTokenStrategies } from "./strategies/ref-t.strategies";
import { JwtModule } from "@nestjs/jwt";
import { RolesGuard } from "src/guard/roles.guard";

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenStrategies, RolesGuard],
  exports: [AuthService, JwtModule, RolesGuard],
})
export class AuthModule {}
