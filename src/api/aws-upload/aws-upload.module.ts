import { Global, Module } from "@nestjs/common";
import { AwsUploadService } from "./aws-upload.service";
import { AwsUploadController } from "./aws-upload.controller";

@Global()
@Module({
  providers: [AwsUploadService],
  controllers: [AwsUploadController],
  exports: [AwsUploadService],
})
export class AwsUploadModule {}
