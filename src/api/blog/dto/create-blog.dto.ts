import { Transform } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { BlogStatus } from "src/types/enum";

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10, { message: "The Minimum Length is 10" })
  @MaxLength(150, { message: "The Maximum Length is 150" })
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(100, { message: "The Minimum Length is 100" })
  content: string;

  @IsEnum(BlogStatus)
  status: BlogStatus;

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

  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (!value) return [];

    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
      return value
        .split(",")
        .map((items) => Number(items))
        .filter(Boolean);
    }

    if (typeof value === "object") {
      return Object.values(value).filter(Boolean);
    }

    return [];
  })
  categoryIds: string[];
}

export const CreateBlogDtoSwagger = {
  schema: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "The title of the blog",
        example: "My First Blog",
        minLength: 10,
        maxLength: 150,
        errorMessage: {
          minLength: "The Minimum Length is 10",
          maxLength: "The Maximum Length is 150",
        },
      },
      content: {
        type: "string",
        description: "The content of the blog",
        example: "This is the content of the blog.",
        minLength: 100,
        errorMessage: {
          minLength: "The Minimum Length is 100",
        },
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
        errorMessage: {
          minLength: "The Minimum Length is 10",
          maxLength: "The Maximum Length is 150",
        },
      },
      seoContent: {
        type: "string",
        description: "SEO content of the blog (optional)",
        example: "This is SEO content for the first blog.",
        maxLength: 150,
        errorMessage: {
          maxLength: "The Maximum Length is 150",
        },
      },
      categoryIds: {
        type: "array",
        items: {
          type: "string",
          example: "1",
        },
        description: "List of category IDs the blog belongs to",
        minItems: 1,
        errorMessage: {
          minItems: "At least one category must be selected",
        },
      },
      file: {
        type: "string",
        format: "binary",
        description: "Blog Image",
      },
    },
    required: ["title", "content", "status", "categoryIds", "file"],
  },
};
