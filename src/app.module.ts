import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { MailerModule } from "./mailer/mailer.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, PrismaModule, MailerModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
