import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./api/auth/auth.module";
import { AwsUploadModule } from "./api/aws-upload/aws-upload.module";
import { MailerModule } from "./api/mailer/mailer.module";
import { ProfileModule } from "./api/profile/profile.module";
import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { SensorDataModule } from "./api/sensor-data/sensor-data.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    MailerModule,
    ProfileModule,
    AwsUploadModule,
    SensorDataModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
