import { Module } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { BlogController } from "./blog.controller";
import { AwsUploadService } from "../aws-upload/aws-upload.service";

@Module({
  providers: [BlogService, AwsUploadService],
  controllers: [BlogController],
})
export class BlogModule {}
