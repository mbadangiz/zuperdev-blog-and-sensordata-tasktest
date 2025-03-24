import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { BlogStatus } from "src/types/enum";

export class UpdateBlogDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(10, { message: "The Minimum Length is 10" })
  @MaxLength(150, { message: "The Maximum Length is 150" })
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(100, { message: "The Minimum Length is 100" })
  content?: string;

  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: "The Minimum Length is 10" })
  @MaxLength(150, { message: "The Maximum Length is 150" })
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: "The Minimum Length is 10" })
  @MaxLength(150, { message: "The Maximum Length is 150" })
  seoContent?: string;

  @IsOptional()
  file?: any;
}

export const UpdateBlogDtoSwagger = {
  schema: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "The title of the blog",
        example: "My First Blog",
        minLength: 10,
        maxLength: 150,
      },
      content: {
        type: "string",
        description: "The content of the blog",
        example: "This is the content of the blog.",
        minLength: 100,
      },
      status: {
        type: "string",
        description: "The status of the blog (e.g., DRAFT, PUBLISHED)",
        enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
        example: "PUBLISHED",
      },
      seoTitle: {
        type: "string",
        description: "SEO title of the blog (optional)",
        example: "First Blog SEO Title",
        minLength: 10,
        maxLength: 150,
      },
      seoContent: {
        type: "string",
        description: "SEO content of the blog (optional)",
        example: "This is SEO content for the first blog.",
        maxLength: 150,
      },
      file: {
        type: "string",
        format: "binary",
        description: "Blog Image (optional)",
      },
    },
    required: [], // Ensures no field is strictly required
  },
};
