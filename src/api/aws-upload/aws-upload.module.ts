import { Module } from "@nestjs/common";
import { AwsUploadService } from "./aws-upload.service";
import { AwsUploadController } from "./aws-upload.controller";

@Module({
  providers: [AwsUploadService],
  controllers: [AwsUploadController],
  exports: [AwsUploadService],
})
export class AwsUploadModule {}
