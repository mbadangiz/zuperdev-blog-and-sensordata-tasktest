import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./api/auth/auth.module";
import { AwsUploadModule } from "./api/aws-upload/aws-upload.module";
import { MailerModule } from "./api/mailer/mailer.module";
import { ProfileModule } from "./api/profile/profile.module";
import { AppController } from "./app.controller";
import { RolesGuard } from "./guard/roles.guard";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    MailerModule,
    ProfileModule,
    AwsUploadModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
