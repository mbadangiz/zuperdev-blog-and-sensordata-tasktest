import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { UploadFileDto } from "./dto/uploadfile.dto";
import { customInternalServerError } from "src/utils/customInternalServerError.utils";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AwsUploadService {
  private s3: S3Client;
  private bucketName: string;

  constructor(private readonly prisma: PrismaService) {
    this.s3 = new S3Client({
      region: "default",
      endpoint: "https://storage.c2.liara.space",
      credentials: {
        accessKeyId: "on0o4kc9ouqgec30",
        secretAccessKey: "bf3382c6-6def-422e-9a7a-1494d26b0c52",
      },
    });
    this.bucketName = process.env.LIARA_BUCKET_NAME || "mytestapp";
  }

  async upload(file: Express.Multer.File) {
    const fileKey = `${uuidv4()}-${file.originalname.split(" ").join("-")}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    try {
      await this.s3.send(new PutObjectCommand(uploadParams));
      return `https://storage.c2.liara.space/${this.bucketName}/${fileKey}`;
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: `Error uploading file: ${error.message}`,
      });
    }
  }

  async deleteFileFromList(fileBukectKey: string) {
    const params = {
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key: fileBukectKey,
    };

    try {
      await this.s3.send(new DeleteObjectCommand(params));
      console.log("File deleted successfully");
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  async uploadController(file: Express.Multer.File, body: UploadFileDto) {
    if (!file) {
      throw new NotFoundException({
        success: false,
        message: "File is Not Found!",
      });
    }
    const fileUrl = await this.upload(file);

    const fileType =
      file.originalname.split(".")[file.originalname.split(".").length - 1];

    const data = {
      filename: body.filename,
      mimetype: file.mimetype,
      type: fileType,
      size: file.size,
      url: fileUrl,
    };

    try {
      const newFile = await this.prisma.uploadedFiles.create({
        data,
      });

      if (!newFile) customInternalServerError();

      return {
        success: true,
        message: `The ${data.filename} file with ${data.type} type has been uploaded successfully.`,
        url: data.url,
      };
    } catch (error) {
      customInternalServerError();
    }
  }
}
